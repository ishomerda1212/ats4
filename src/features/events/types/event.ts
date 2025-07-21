import { BaseEntity } from '@/shared/types/common';
import { SelectionStage } from '../applicants/types/applicant';

export interface Event extends BaseEntity {
  name: string;
  description: string;
  stage: SelectionStage;
}

export interface EventSession extends BaseEntity {
  eventId: string;
  name: string;
  start: Date;
  end: Date;
  venue: string;
  participants: EventParticipant[];
}

export type ParticipationStatus = '参加' | '不参加' | '未定';

export interface EventParticipant extends BaseEntity {
  eventId: string;
  applicantId: string;
  status: ParticipationStatus;
  joinedAt?: Date;
  updatedAt: Date;
}