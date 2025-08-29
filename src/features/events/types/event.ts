import { SelectionStage } from '@/features/applicants/types/applicant';

// イベント（選考段階の定義）
export interface Event {
  id: string;
  name: string;
  description: string;
  stage: SelectionStage;
  venue: string;
  maxParticipants: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  stageConfig: {
    stage_group?: string;
    is_active?: boolean;
    requires_session?: boolean;
    session_types?: string[];
    estimated_duration?: number;
    color_scheme?: string;
    description?: string;
  };
}

// イベントセッション（具体的な開催日時）
export interface EventSession {
  id: string;
  eventId: string;
  name: string;
  sessionDate: Date;
  startTime: string;
  endTime: string;
  venue: string;
  format: '対面' | 'オンライン' | 'ハイブリッド';
  maxParticipants: number;
  zoomUrl?: string;
  notes?: string;
  recruiter?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventParticipant {
  id: string;
  sessionId: string;
  applicantId: string;
  status: ParticipationStatus;
  result?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ParticipationStatus = 
  | '参加'
  | '参加済み'
  | 'キャンセル'
  | '辞退'
  | '無断欠席'
  | '合格'
  | '不合格'
  | '保留'
  | '内定'
  | '不内定'
  | '確定'
  | '未承諾'
  | '承諾'
  | '申込'
  | '欠席'
  | '不参加'
  | '未定';