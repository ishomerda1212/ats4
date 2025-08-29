// 固定タスク設定の型定義

export interface FixedTaskDefinition {
  id: string;
  stageId: string;
  name: string;
  displayName: string;
  description?: string;
  taskType: TaskType;
  sortOrder: number;
  isRequired: boolean;
  isActive: boolean;
  dueOffsetDays?: number;
  emailTemplateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFixedTaskInput {
  stageId: string;
  name: string;
  displayName: string;
  description?: string;
  taskType: TaskType;
  sortOrder: number;
  isRequired?: boolean;
  isActive?: boolean;
  dueOffsetDays?: number;
  emailTemplateId?: string;
}

export interface UpdateFixedTaskInput {
  name?: string;
  displayName?: string;
  description?: string;
  taskType?: TaskType;
  sortOrder?: number;
  isRequired?: boolean;
  isActive?: boolean;
  dueOffsetDays?: number;
  emailTemplateId?: string;
}

export type TaskType = 'email' | 'document' | 'general' | 'phone' | 'meeting';

export const TASK_TYPES: TaskType[] = ['email', 'document', 'general', 'phone', 'meeting'];

export const TASK_TYPE_DISPLAY: Record<TaskType, { name: string; icon: string; description: string }> = {
  email: { name: 'メール送信', icon: '📧', description: 'メールでの連絡・案内' },
  document: { name: '書類提出', icon: '📄', description: '書類の提出・確認' },
  general: { name: '一般タスク', icon: '📋', description: '一般的な業務タスク' },
  phone: { name: '電話連絡', icon: '📞', description: '電話での連絡・確認' },
  meeting: { name: '会議・面談', icon: '🤝', description: '会議や面談の実施' }
};

export interface DueDateSetting {
  type: 'none' | 'relative' | 'fixed';
  relativeDays?: number;
  fixedDate?: Date;
}

export const DUE_DATE_PRESETS = [
  { label: '当日', days: 0 },
  { label: '1日後', days: 1 },
  { label: '3日後', days: 3 },
  { label: '1週間後', days: 7 },
  { label: '2週間後', days: 14 },
  { label: '1ヶ月後', days: 30 }
];

// タスクバリデーション用のルール
export interface TaskValidationRule {
  field: keyof FixedTaskDefinition;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => string | null;
}

export const TASK_VALIDATION_RULES: TaskValidationRule[] = [
  {
    field: 'name',
    required: true,
    minLength: 1,
    maxLength: 100,
    pattern: /^[^\s].*[^\s]$/,
  },
  {
    field: 'displayName',
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  {
    field: 'description',
    required: false,
    maxLength: 500,
  },
  {
    field: 'dueOffsetDays',
    required: false,
    customValidator: (value: number | undefined) => {
      if (value !== undefined && (value < 0 || value > 365)) {
        return '期限は0日から365日の間で設定してください';
      }
      return null;
    }
  }
];