import { BaseEntity } from '@/shared/types/common';
import { SelectionStage } from '../applicants/types/applicant';

export interface Event extends BaseEntity {
  name: string;
  description: string;
  stage: SelectionStage;
}

export interface EventSession extends BaseEntity {
  eventId: string;
  startDateTime: string;
  endDateTime: string;
  venue: string;
  notes?: string;
}

export type ParticipationStatus = '申込' | '参加' | '欠席';

export interface EventParticipant extends BaseEntity {
  eventSessionId: string;
  applicantId: string;
  status: ParticipationStatus;
  registrationDate: string;
}