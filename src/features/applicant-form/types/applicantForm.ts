export interface ApplicantEventResponse {
  applicantId: string;
  eventId: string;
  sessionResponses: SessionResponse[];
  submittedAt: Date;
}

export interface SessionResponse {
  sessionId: string;
  status: 'participate' | 'not_participate' | 'pending'; // 参加/不参加/保留
}

export interface EventFormData {
  eventName: string;
  eventDescription: string;
  stage: string;
  sessions: SessionFormData[];
}

export interface SessionFormData {
  sessionId: string;
  sessionName: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  maxParticipants?: number;
  currentParticipants: number;
  recruiter?: string;
}

export interface ApplicantFormProps {
  applicantId: string;
  eventId: string;
}