'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = [
  'Type',
  'Wanneer',
  'Gegevens',
  'Bevestiging',
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="relative">
        <div className="absolute top-3 left-0 right-0 h-px bg-border-soft" />
        <motion.div
          className="absolute top-3 left-0 h-px bg-deep-gold"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        />
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }, (_, i) => {
            const step = i + 1;
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;

            return (
              <div key={step} className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    'w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium transition-colors duration-300',
                    isCompleted && 'bg-deep-gold border-deep-gold text-white',
                    isActive && 'border-deep-gold text-deep-gold bg-white',
                    !isActive && !isCompleted && 'border-border-soft text-text-muted bg-white/60'
                  )}
                  animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  {isCompleted ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6L5 8.5L9.5 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    step
                  )}
                </motion.div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium tracking-wide transition-colors duration-300',
                    isActive && 'text-deep-gold',
                    isCompleted && 'text-text-muted',
                    !isActive && !isCompleted && 'text-text-muted/50'
                  )}
                >
                  {STEP_LABELS[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
