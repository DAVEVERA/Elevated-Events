'use client';

import { useState, useCallback, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { plannerSchema } from '@/lib/validations/planner';
import type { PlannerFormValues } from '@/lib/validations/planner';
import type { MeetingType } from '@/types';
import { StepIndicator } from '@/components/planner/StepIndicator';
import { MeetingTypeSelector } from '@/components/planner/MeetingTypeSelector';
import { TimeSlotPicker } from '@/components/planner/TimeSlotPicker';
import { FaceToFacePreferences } from '@/components/planner/FaceToFacePreferences';
import { PlannerForm } from '@/components/planner/PlannerForm';
import { PlannerConfirmation } from '@/components/planner/PlannerConfirmation';

const TOTAL_STEPS = 4;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export default function PlannerPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<PlannerFormValues | null>(null);

  const methods = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerSchema),
    mode: 'onBlur',
    defaultValues: {
      meeting_type: 'digital',
      full_name: '',
      company_name: '',
      email: '',
      phone: '',
      website: '',
      linkedin_url: '',
      event_type: undefined,
      estimated_event_date: '',
      estimated_guest_count: undefined,
      message: '',
      selected_slot: undefined,
      preferred_location: '',
      preferred_date_windows: [],
      preferred_time_windows: [],
    },
  });

  const { watch, setValue, trigger } = methods;
  const meetingType = watch('meeting_type');
  const selectedSlot = watch('selected_slot');
  const rawPreferredDates = watch('preferred_date_windows');
  const rawPreferredTimeWindows = watch('preferred_time_windows');
  const rawPreferredLocation = watch('preferred_location');
  const preferredDates = useMemo(() => rawPreferredDates || [], [rawPreferredDates]);
  const preferredTimeWindows = useMemo(() => rawPreferredTimeWindows || [], [rawPreferredTimeWindows]);
  const preferredLocation = rawPreferredLocation || '';

  const [selectedMeetingType, setSelectedMeetingType] = useState<MeetingType | null>(null);

  const handleMeetingTypeChange = useCallback(
    (type: MeetingType) => {
      setSelectedMeetingType(type);
      setValue('meeting_type', type);
    },
    [setValue]
  );

  const canAdvance = useCallback(() => {
    switch (step) {
      case 1:
        return selectedMeetingType !== null;
      case 2:
        if (meetingType === 'digital') return !!selectedSlot;
        return preferredDates.length > 0 && preferredTimeWindows.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  }, [step, selectedMeetingType, meetingType, selectedSlot, preferredDates, preferredTimeWindows]);

  const goForward = useCallback(async () => {
    if (step === 3) {
      const fieldsToValidate: (keyof PlannerFormValues)[] = [
        'full_name',
        'company_name',
        'email',
        'phone',
        'event_type',
        'website',
        'linkedin_url',
      ];
      const valid = await trigger(fieldsToValidate);
      if (!valid) return;

      setSubmitting(true);
      setSubmitError(null);

      try {
        const data = methods.getValues();
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errorBody = await res.json().catch(() => null);
          throw new Error(
            errorBody?.message || 'Er ging iets mis bij het versturen. Probeer het opnieuw.'
          );
        }

        setSubmittedData(data);
        setDirection(1);
        setStep(4);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Er ging iets mis. Probeer het opnieuw.'
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!canAdvance()) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, [step, canAdvance, trigger, methods]);

  const goBack = useCallback(() => {
    if (step <= 1) return;
    setDirection(-1);
    setStep((s) => s - 1);
  }, [step]);

  return (
    <section className="min-h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-2xl rounded-[34px] border border-white/20 bg-[rgba(250,246,236,0.88)] px-5 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-md md:px-8 md:py-10">
          {step < 4 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
            </motion.div>
          )}

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              >
                <FormProvider {...methods}>
                  {step === 1 && (
                    <MeetingTypeSelector
                      value={selectedMeetingType}
                      onChange={handleMeetingTypeChange}
                    />
                  )}

                  {step === 2 && meetingType === 'digital' && (
                    <TimeSlotPicker
                      value={selectedSlot}
                      onChange={(slot) => setValue('selected_slot', slot)}
                    />
                  )}

                  {step === 2 && meetingType === 'face_to_face' && (
                    <FaceToFacePreferences
                      selectedDates={preferredDates}
                      selectedTimeWindows={preferredTimeWindows}
                      location={preferredLocation}
                      onDatesChange={(dates) => setValue('preferred_date_windows', dates)}
                      onTimeWindowsChange={(windows) =>
                        setValue('preferred_time_windows', windows)
                      }
                      onLocationChange={(loc) => setValue('preferred_location', loc)}
                    />
                  )}

                  {step === 3 && <PlannerForm />}

                  {step === 4 && submittedData && (
                    <PlannerConfirmation data={submittedData} />
                  )}
                </FormProvider>
              </motion.div>
            </AnimatePresence>
          </div>

          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl border border-red-400/40 bg-red-50 text-center"
            >
              <p className="text-red-600 text-sm">{submitError}</p>
            </motion.div>
          )}

          {step < 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between mt-12 max-w-lg mx-auto"
            >
              <div>
                {step > 1 && (
                  <motion.button
                    type="button"
                    onClick={goBack}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium',
                      'text-text-muted hover:text-text-dark transition-colors duration-200'
                    )}
                  >
                    <ArrowLeft size={16} />
                    Vorige
                  </motion.button>
                )}
              </div>

              <motion.button
                type="button"
                onClick={goForward}
                disabled={!canAdvance() || submitting}
                className={cn(
                  canAdvance() && !submitting
                    ? 'btn-elevated'
                    : 'flex items-center justify-center gap-2 min-h-[52px] px-7 py-3 rounded-[10px] text-sm font-extrabold bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300'
                )}
                whileHover={canAdvance() && !submitting ? { scale: 1.02 } : undefined}
                whileTap={canAdvance() && !submitting ? { scale: 0.98 } : undefined}
              >
                <span className="relative z-[1] flex items-center gap-2">
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Versturen...
                    </>
                  ) : step === 3 ? (
                    <>
                      Verstuur aanvraag
                      <ArrowRight size={16} />
                    </>
                  ) : (
                    <>
                      Volgende
                      <ArrowRight size={16} />
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
