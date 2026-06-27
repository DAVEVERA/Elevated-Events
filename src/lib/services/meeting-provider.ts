import type { MeetingProvider } from '@/types';

interface CreateMeetingLinkInput {
  title: string;
  startTime: string;
  endTime: string;
  attendeeEmail: string;
}

const provider: MeetingProvider =
  (process.env.MEETING_PROVIDER as MeetingProvider) || 'manual';

async function createManualLink(input: CreateMeetingLinkInput): Promise<string> {
  const baseUrl =
    process.env.DIGITAL_MEETING_BASE_URL ||
    'https://meet.elevated-eventmaker.nl';
  const meetingId = crypto.randomUUID().slice(0, 8);
  return `${baseUrl}/room/${meetingId}`;
}

export async function createDigitalMeetingLink(
  input: CreateMeetingLinkInput
): Promise<string> {
  switch (provider) {
    case 'google_meet':
      return createManualLink(input);
    case 'zoom':
      return createManualLink(input);
    case 'whereby':
      return createManualLink(input);
    case 'manual':
    default:
      return createManualLink(input);
  }
}
