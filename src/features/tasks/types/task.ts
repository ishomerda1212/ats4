import { BaseEntity } from '@/shared/types/common';
import { SelectionStage } from '@/features/applicants/types/applicant';

export type TaskType = 
  | 'アプローチ1'
  | 'アプローチ2' 
  | 'アプローチ3'
  | 'アプローチ4'
  | 'アプローチ5'
  | '詳細連絡'
  | '日程調整連絡'
  | 'リマインド'
  | '結果連絡'
  | '提出書類'
  | 'email'
  | 'document'
  | 'general'
  | 'interview'
  | '不採用通知';

export type TaskStatus = '未着手' | '完了' | '提出待ち' | '返信待ち';
export type ContactStatus = '未' | '済' | '返信待ち' | '○';

// 固定タスクテンプレート
export interface FixedTask {
  id: string;
  stage: SelectionStage;
  title: string;
  description: string;
  type: TaskType;
  isRequired: boolean;
  estimatedDuration: number; // 分単位
  order: number; // 段階内での順序
}

// タスクインスタンス（応募者固有）
export interface TaskInstance extends BaseEntity {
  applicantId: string;
  taskId: string; // FixedTaskのID
  status: TaskStatus;
  contactStatus?: ContactStatus; // 連絡系タスク用
  dueDate?: Date; // 任意の期限
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

// 既存のTask型（後方互換性のため保持）
export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  selectionHistoryId?: string;
  applicantId?: string;
  stage?: string;
}

export interface EmailTemplate extends BaseEntity {
  name: string;
  subject: string;
  body: string;
  stage: SelectionStage;
  isDefault: boolean;
  variables: string[]; // 使用可能な変数のリスト
}

export interface EmailLog extends BaseEntity {
  taskId: string;
  applicantId: string;
  templateId?: string;
  subject: string;
  body: string;
  sentAt: string;
  sentBy: string;
  status: 'sent' | 'failed' | 'draft';
}

export const TASK_TYPES: { value: TaskType; label: string }[] = [
  { value: 'アプローチ1', label: 'アプローチ1' },
  { value: 'アプローチ2', label: 'アプローチ2' },
  { value: 'アプローチ3', label: 'アプローチ3' },
  { value: 'アプローチ4', label: 'アプローチ4' },
  { value: 'アプローチ5', label: 'アプローチ5' },
  { value: '詳細連絡', label: '詳細連絡' },
  { value: '日程調整連絡', label: '日程調整連絡' },
  { value: 'リマインド', label: 'リマインド' },
  { value: '結果連絡', label: '結果連絡' },
  { value: '提出書類', label: '提出書類' },
  { value: 'email', label: 'メール' },
  { value: 'document', label: '書類' },
  { value: 'general', label: '一般' },
  { value: 'interview', label: '面接' },
  { value: '不採用通知', label: '不採用通知' }
];

export const CONTACT_STATUSES: { value: ContactStatus; label: string; color: string }[] = [
  { value: '未', label: '未', color: 'bg-gray-100 text-gray-800' },
  { value: '済', label: '済', color: 'bg-green-100 text-green-800' },
  { value: '返信待ち', label: '返信待ち', color: 'bg-yellow-100 text-yellow-800' },
  { value: '○', label: '○', color: 'bg-blue-100 text-blue-800' }
];