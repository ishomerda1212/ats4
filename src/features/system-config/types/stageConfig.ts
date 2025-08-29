// 選考段階設定の型定義

export interface SelectionStageDefinition {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  stageGroup: StageGroup;
  sortOrder: number;
  isActive: boolean;
  colorScheme: ColorScheme;
  icon?: string;
  estimatedDurationMinutes: number;
  requiresSession: boolean;
  sessionTypes: SessionType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSelectionStageInput {
  name: string;
  displayName: string;
  description?: string;
  stageGroup: StageGroup;
  sortOrder: number;
  isActive?: boolean;
  colorScheme?: ColorScheme;
  icon?: string;
  estimatedDurationMinutes?: number;
  requiresSession?: boolean;
  sessionTypes?: SessionType[];
}

export interface UpdateSelectionStageInput {
  name?: string;
  displayName?: string;
  description?: string;
  stageGroup?: StageGroup;
  sortOrder?: number;
  isActive?: boolean;
  colorScheme?: ColorScheme;
  icon?: string;
  estimatedDurationMinutes?: number;
  requiresSession?: boolean;
  sessionTypes?: SessionType[];
}

export type StageGroup = 'エントリー' | 'インターンシップ' | '選考' | 'その他';

export type ColorScheme = 
  | 'blue' | 'purple' | 'indigo' | 'lime' | 'yellow' 
  | 'orange' | 'red' | 'amber' | 'teal' | 'cyan' 
  | 'pink' | 'violet' | 'emerald' | 'gray';

export type SessionType = '対面' | 'オンライン' | 'ハイブリッド';

export const STAGE_GROUPS: StageGroup[] = ['エントリー', 'インターンシップ', '選考', 'その他'];

export const COLOR_SCHEMES: ColorScheme[] = [
  'blue', 'purple', 'indigo', 'lime', 'yellow', 
  'orange', 'red', 'amber', 'teal', 'cyan', 
  'pink', 'violet', 'emerald', 'gray'
];

export const SESSION_TYPES: SessionType[] = ['対面', 'オンライン', 'ハイブリッド'];

export const STAGE_GROUP_DISPLAY_NAMES: Record<StageGroup, string> = {
  'エントリー': 'エントリー',
  'インターンシップ': 'インターンシップ',
  '選考': '選考',
  'その他': 'その他'
};

export const STAGE_COLOR_SCHEME_DISPLAY: Record<ColorScheme, { name: string; class: string; preview: string }> = {
  blue: { name: 'ブルー', class: 'bg-blue-100 text-blue-800', preview: 'bg-blue-500' },
  purple: { name: 'パープル', class: 'bg-purple-100 text-purple-800', preview: 'bg-purple-500' },
  indigo: { name: 'インディゴ', class: 'bg-indigo-100 text-indigo-800', preview: 'bg-indigo-500' },
  lime: { name: 'ライム', class: 'bg-lime-100 text-lime-800', preview: 'bg-lime-500' },
  yellow: { name: 'イエロー', class: 'bg-yellow-100 text-yellow-800', preview: 'bg-yellow-500' },
  orange: { name: 'オレンジ', class: 'bg-orange-100 text-orange-800', preview: 'bg-orange-500' },
  red: { name: 'レッド', class: 'bg-red-100 text-red-800', preview: 'bg-red-500' },
  amber: { name: 'アンバー', class: 'bg-amber-100 text-amber-800', preview: 'bg-amber-500' },
  teal: { name: 'ティール', class: 'bg-teal-100 text-teal-800', preview: 'bg-teal-500' },
  cyan: { name: 'シアン', class: 'bg-cyan-100 text-cyan-800', preview: 'bg-cyan-500' },
  pink: { name: 'ピンク', class: 'bg-pink-100 text-pink-800', preview: 'bg-pink-500' },
  violet: { name: 'バイオレット', class: 'bg-violet-100 text-violet-800', preview: 'bg-violet-500' },
  emerald: { name: 'エメラルド', class: 'bg-emerald-100 text-emerald-800', preview: 'bg-emerald-500' },
  gray: { name: 'グレー', class: 'bg-gray-100 text-gray-800', preview: 'bg-gray-500' }
};

export const AVAILABLE_ICONS = [
  { value: 'user-plus', name: 'ユーザー追加', icon: '👤' },
  { value: 'file-text', name: 'ファイル', icon: '📄' },
  { value: 'presentation', name: 'プレゼンテーション', icon: '📊' },
  { value: 'brain', name: 'テスト', icon: '🧠' },
  { value: 'building', name: '建物', icon: '🏢' },
  { value: 'briefcase', name: 'ビジネス', icon: '💼' },
  { value: 'user', name: 'ユーザー', icon: '👤' },
  { value: 'users', name: 'グループ', icon: '👥' },
  { value: 'award', name: 'アワード', icon: '🏆' },
  { value: 'star', name: 'スター', icon: '⭐' },
  { value: 'check-circle', name: 'チェック', icon: '✅' },
  { value: 'x-circle', name: 'バツ', icon: '❌' }
];