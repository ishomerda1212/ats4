import { SelectionStage, Source, Gender } from '@/features/applicants/types/applicant';

export const SELECTION_STAGES: SelectionStage[] = [
  'エントリー',
  '会社説明会',
  '適性検査',
  '職場見学',
  '社長セミナー',
  '人事面接',
  'グループ面接',
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
  '会社説明会': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  '適性検査': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  '職場見学': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  '社長セミナー': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  '人事面接': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'グループ面接': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  '最終選考': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  '内定': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  '不採用': 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300'
};
