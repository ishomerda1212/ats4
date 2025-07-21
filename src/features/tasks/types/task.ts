import { BaseEntity } from '@/shared/types/common';
import { SelectionStage } from '@/features/applicants/types/applicant';

export type TaskType = 'general' | 'email' | 'document' | 'interview' | 'evaluation';
export type TaskStatus = '未着手' | '進行中' | '完了';
export type TaskPriority = '低' | '中' | '高';

export interface Task extends BaseEntity {
  selectionHistoryId: string;
  title: string;
  description: string;
  type?: TaskType;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: string;
  completedAt?: string;
  emailTemplateId?: string;
  metadata?: Record<string, unknown>;
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
  { value: 'general', label: '一般タスク' },
  { value: 'email', label: 'メール送信' },
  { value: 'document', label: '書類準備' },
  { value: 'interview', label: '面接調整' },
  { value: 'evaluation', label: '評価・審査' }
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: '低', label: '低', color: 'bg-gray-100 text-gray-800' },
  { value: '中', label: '中', color: 'bg-yellow-100 text-yellow-800' },
  { value: '高', label: '高', color: 'bg-red-100 text-red-800' }
];