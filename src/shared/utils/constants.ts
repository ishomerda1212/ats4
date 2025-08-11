import { SelectionStage, Source, Gender } from '@/features/applicants/types/applicant';

export const SELECTION_STAGES = [
  'エントリー',
  '書類選考',
  '会社説明会',
  '適性検査体験',
  '職場見学',
  '仕事体験',
  '人事面接',
  '集団面接',
  '最終選考',
  'CEOセミナー',
  '内定面談',
  '不採用'
] as const;

// 選考段階のグループ分け
export const STAGE_GROUPS: Record<string, readonly SelectionStage[]> = {
  'エントリー': ['エントリー'],
  'インターンシップ': ['CEOセミナー', '仕事体験', '適性検査体験', '会社説明会', '職場見学'],
  '選考': ['書類選考', '集団面接', '人事面接', '最終選考', '内定面談'],
  'その他': ['不採用']
} as const;

export type StageGroup = keyof typeof STAGE_GROUPS;

// 選考段階ごとの合否項目
export const STAGE_RESULT_OPTIONS = {
  'エントリー': ['合格', '不合格', '保留', '辞退', 'キャンセル'],
  '書類選考': ['合格', '不合格', '辞退'],
  '会社説明会': ['参加予定', '参加', 'キャンセル', '辞退', '無断欠席'],
  '適性検査体験': ['参加予定', '参加', 'キャンセル', '辞退', '無断欠席'],
  '職場見学': ['参加予定', '参加', 'キャンセル', '辞退', '無断欠席'],
  '仕事体験': ['参加予定', '参加', 'キャンセル', '辞退', '無断欠席'],
  '人事面接': ['合格', '不合格', 'キャンセル', '辞退', '無断欠席', '保留'],
  '集団面接': ['合格', '不合格', 'キャンセル', '辞退', '無断欠席', '保留'],
  '最終選考': ['内定', '不合格', 'キャンセル', '辞退', '無断欠席', '保留'],
  'CEOセミナー': ['参加予定', '参加', 'キャンセル', '辞退', '無断欠席'],
  '内定面談': ['未承諾', '承諾', '辞退'],
  '不採用': ['確定', '保留', '辞退', 'キャンセル']
} as const;

// セッション情報登録が必要な選考段階
export const STAGES_WITH_SESSION = [
  '会社説明会',
  '適性検査体験',
  '職場見学',
  '仕事体験',
  '人事面接',
  '集団面接',
  '最終選考',
  'CEOセミナー',
  '内定面談'
] as const;

// 対面/オンライン選択肢
export const SESSION_TYPE_OPTIONS = ['対面', 'オンライン'] as const;

export const SOURCES: Source[] = [
  'マイナビ',
  '学情',
  'オファーボックス',
  'その他'
];

export const GENDERS: Gender[] = [
  '男性',
  '女性',
  'その他'
];

export const STAGE_COLORS: Record<SelectionStage, string> = {
  'エントリー': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  '書類選考': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  '会社説明会': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  '適性検査体験': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  '職場見学': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  '仕事体験': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  '人事面接': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  '集団面接': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  'CEOセミナー': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  '最終選考': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
  '内定面談': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  '不採用': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
};

export const STAGE_TASKS: Record<SelectionStage, string[]> = {
  'エントリー': ['詳細連絡'],
  '書類選考': ['詳細連絡', '提出書類', '結果連絡'],
  '会社説明会': ['詳細連絡', 'リマインド'],
  '適性検査体験': ['詳細連絡'],
  '職場見学': ['詳細連絡'],
  '仕事体験': ['詳細連絡'],
  '人事面接': ['詳細連絡', '日程調整連絡', 'リマインド', '結果連絡'],
  '集団面接': ['詳細連絡', '日程調整連絡', 'リマインド', '結果連絡'],
  'CEOセミナー': ['詳細連絡', 'リマインド'],
  '最終選考': ['詳細連絡', '日程調整連絡', '提出書類', 'リマインド', '結果連絡'],
  '内定面談': ['内定通知', '入社手続き案内'],
  '不採用': ['結果連絡']
};
