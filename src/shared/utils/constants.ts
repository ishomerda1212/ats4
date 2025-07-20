import { SelectionStage, Source, Gender } from '@/features/applicants/types/applicant';

export const SELECTION_STAGES: SelectionStage[] = [
  'エントリー',
  '書類選考',
  '会社説明会',
  '適性検査',
  '職場見学',
  '仕事体験',
  '個別面接',
  '集団面接',
  'CEOセミナー',
  '人事面接',
  '最終選考',
  '内定',
  '不採用'
];

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
  '書類選考': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  '会社説明会': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  '適性検査': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  '職場見学': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  '仕事体験': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  '個別面接': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  '集団面接': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  'CEOセミナー': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  '人事面接': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  '最終選考': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  '内定': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  '不採用': 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300'
};

export const STAGE_TASKS: Record<SelectionStage, string[]> = {
  'エントリー': ['エントリーシート確認', '基本要件チェック'],
  '書類選考': ['詳細連絡', '結果連絡'],
  '会社説明会': ['詳細連絡'],
  '適性検査': ['適性検査案内メール送信', '結果確認'],
  '職場見学': ['見学日程調整', '見学案内メール送信'],
  '仕事体験': ['詳細連絡'],
  '個別面接': ['詳細連絡'],
  '集団面接': ['詳細連絡', '結果連絡'],
  'CEOセミナー': ['詳細連絡', 'リマインド'],
  '人事面接': ['面接日程調整', '面接官アサイン'],
  '最終選考': ['詳細連絡', '提出書類回収', '結果連絡'],
  '内定': ['内定通知', '入社手続き案内'],
  '不採用': ['不採用通知', 'フィードバック']
};
