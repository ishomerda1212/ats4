// ステータス設定の型定義

export interface StageStatusDefinition {
  id: string;
  stageId: string;
  statusValue: string;
  displayName: string;
  statusCategory: StatusCategory;
  colorScheme: ColorScheme;
  sortOrder: number;
  isActive: boolean;
  isFinal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStageStatusInput {
  stageId: string;
  statusValue: string;
  displayName: string;
  statusCategory: StatusCategory;
  colorScheme?: ColorScheme;
  sortOrder: number;
  isActive?: boolean;
  isFinal?: boolean;
}

export interface UpdateStageStatusInput {
  statusValue?: string;
  displayName?: string;
  statusCategory?: StatusCategory;
  colorScheme?: ColorScheme;
  sortOrder?: number;
  isActive?: boolean;
  isFinal?: boolean;
}

export type StatusCategory = 'passed' | 'failed' | 'pending' | 'declined' | 'cancelled';

export type ColorScheme = 
  | 'green' | 'red' | 'yellow' | 'blue' | 'gray'
  | 'purple' | 'indigo' | 'orange' | 'teal' | 'cyan' 
  | 'pink' | 'violet' | 'emerald' | 'amber';

export const STATUS_CATEGORIES: StatusCategory[] = [
  'passed', 'failed', 'pending', 'declined', 'cancelled'
];

export const COLOR_SCHEMES: ColorScheme[] = [
  'green', 'red', 'yellow', 'blue', 'gray',
  'purple', 'indigo', 'orange', 'teal', 'cyan',
  'pink', 'violet', 'emerald', 'amber'
];

export const STATUS_CATEGORY_DISPLAY: Record<StatusCategory, { name: string; icon: string; description: string; defaultColor: ColorScheme }> = {
  passed: { 
    name: '通過', 
    icon: '✅', 
    description: '選考を通過・成功した状態', 
    defaultColor: 'green' 
  },
  failed: { 
    name: '不通過', 
    icon: '❌', 
    description: '選考で不合格・失敗した状態', 
    defaultColor: 'red' 
  },
  pending: { 
    name: '保留', 
    icon: '⏳', 
    description: '結果待ち・検討中の状態', 
    defaultColor: 'yellow' 
  },
  declined: { 
    name: '辞退', 
    icon: '🚫', 
    description: '応募者が辞退した状態', 
    defaultColor: 'gray' 
  },
  cancelled: { 
    name: 'キャンセル', 
    icon: '⭕', 
    description: 'キャンセル・中止された状態', 
    defaultColor: 'gray' 
  }
};

export const STATUS_COLOR_SCHEME_DISPLAY: Record<ColorScheme, { name: string; class: string; preview: string }> = {
  green: { name: 'グリーン', class: 'bg-green-100 text-green-800', preview: 'bg-green-500' },
  red: { name: 'レッド', class: 'bg-red-100 text-red-800', preview: 'bg-red-500' },
  yellow: { name: 'イエロー', class: 'bg-yellow-100 text-yellow-800', preview: 'bg-yellow-500' },
  blue: { name: 'ブルー', class: 'bg-blue-100 text-blue-800', preview: 'bg-blue-500' },
  gray: { name: 'グレー', class: 'bg-gray-100 text-gray-800', preview: 'bg-gray-500' },
  purple: { name: 'パープル', class: 'bg-purple-100 text-purple-800', preview: 'bg-purple-500' },
  indigo: { name: 'インディゴ', class: 'bg-indigo-100 text-indigo-800', preview: 'bg-indigo-500' },
  orange: { name: 'オレンジ', class: 'bg-orange-100 text-orange-800', preview: 'bg-orange-500' },
  teal: { name: 'ティール', class: 'bg-teal-100 text-teal-800', preview: 'bg-teal-500' },
  cyan: { name: 'シアン', class: 'bg-cyan-100 text-cyan-800', preview: 'bg-cyan-500' },
  pink: { name: 'ピンク', class: 'bg-pink-100 text-pink-800', preview: 'bg-pink-500' },
  violet: { name: 'バイオレット', class: 'bg-violet-100 text-violet-800', preview: 'bg-violet-500' },
  emerald: { name: 'エメラルド', class: 'bg-emerald-100 text-emerald-800', preview: 'bg-emerald-500' },
  amber: { name: 'アンバー', class: 'bg-amber-100 text-amber-800', preview: 'bg-amber-500' }
};

// よく使用されるステータスのテンプレート
export const STATUS_TEMPLATES: Record<string, CreateStageStatusInput[]> = {
  'basic': [
    { stageId: '', statusValue: '合格', displayName: '合格', statusCategory: 'passed', sortOrder: 1, colorScheme: 'green' },
    { stageId: '', statusValue: '不合格', displayName: '不合格', statusCategory: 'failed', sortOrder: 2, colorScheme: 'red', isFinal: true },
    { stageId: '', statusValue: '辞退', displayName: '辞退', statusCategory: 'declined', sortOrder: 3, colorScheme: 'gray', isFinal: true }
  ],
  'interview': [
    { stageId: '', statusValue: '合格', displayName: '合格', statusCategory: 'passed', sortOrder: 1, colorScheme: 'green' },
    { stageId: '', statusValue: '不合格', displayName: '不合格', statusCategory: 'failed', sortOrder: 2, colorScheme: 'red', isFinal: true },
    { stageId: '', statusValue: '保留', displayName: '保留', statusCategory: 'pending', sortOrder: 3, colorScheme: 'yellow' },
    { stageId: '', statusValue: 'キャンセル', displayName: 'キャンセル', statusCategory: 'cancelled', sortOrder: 4, colorScheme: 'gray' },
    { stageId: '', statusValue: '辞退', displayName: '辞退', statusCategory: 'declined', sortOrder: 5, colorScheme: 'gray', isFinal: true },
    { stageId: '', statusValue: '無断欠席', displayName: '無断欠席', statusCategory: 'failed', sortOrder: 6, colorScheme: 'red', isFinal: true }
  ],
  'event': [
    { stageId: '', statusValue: '参加予定', displayName: '参加予定', statusCategory: 'pending', sortOrder: 1, colorScheme: 'blue' },
    { stageId: '', statusValue: '参加', displayName: '参加', statusCategory: 'passed', sortOrder: 2, colorScheme: 'green' },
    { stageId: '', statusValue: 'キャンセル', displayName: 'キャンセル', statusCategory: 'cancelled', sortOrder: 3, colorScheme: 'gray' },
    { stageId: '', statusValue: '辞退', displayName: '辞退', statusCategory: 'declined', sortOrder: 4, colorScheme: 'gray', isFinal: true },
    { stageId: '', statusValue: '無断欠席', displayName: '無断欠席', statusCategory: 'failed', sortOrder: 5, colorScheme: 'red', isFinal: true }
  ],
  'final': [
    { stageId: '', statusValue: '内定', displayName: '内定', statusCategory: 'passed', sortOrder: 1, colorScheme: 'green' },
    { stageId: '', statusValue: '不合格', displayName: '不合格', statusCategory: 'failed', sortOrder: 2, colorScheme: 'red', isFinal: true },
    { stageId: '', statusValue: '保留', displayName: '保留', statusCategory: 'pending', sortOrder: 3, colorScheme: 'yellow' },
    { stageId: '', statusValue: '辞退', displayName: '辞退', statusCategory: 'declined', sortOrder: 4, colorScheme: 'gray', isFinal: true }
  ]
};

// ステータスバリデーション用のルール
export interface StatusValidationRule {
  field: keyof StageStatusDefinition;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any, allStatuses?: StageStatusDefinition[]) => string | null;
}

export const STATUS_VALIDATION_RULES: StatusValidationRule[] = [
  {
    field: 'statusValue',
    required: true,
    minLength: 1,
    maxLength: 50,
    pattern: /^[^\s].*[^\s]$/,
    customValidator: (value: string, allStatuses: StageStatusDefinition[] = []) => {
      const duplicates = allStatuses.filter(s => s.statusValue === value);
      if (duplicates.length > 1) {
        return 'このステータス値は既に使用されています';
      }
      return null;
    }
  },
  {
    field: 'displayName',
    required: true,
    minLength: 1,
    maxLength: 100,
  }
];