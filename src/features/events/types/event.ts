import { BaseEntity } from '@/shared/types/common';
import { SelectionStage } from '@/features/applicants/types/applicant';

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
  format: '対面' | 'オンライン'; // 開催形式
  participants: EventParticipant[];
  notes?: string;
  recruiter?: string;
  reportReminderDate?: string;
  participantReportDate?: string;
  maxParticipants?: number; // 参加者上限数（未設定の場合は無制限）
  currentParticipants?: number; // 現在の参加者数
}

export type ParticipationStatus = '参加' | '不参加' | '未定' | '申込' | '欠席';

export interface EventParticipant extends BaseEntity {
  sessionId: string;
  applicantId: string;
  status: ParticipationStatus;
  joinedAt?: Date;
  updatedAt: Date;
}