// システム設定関連の型定義エクスポート

export * from './stageConfig';
export * from './taskConfig';
export * from './statusConfig';

// 共通のシステム設定関連の型定義

export interface SystemConfigSummary {
  totalStages: number;
  activeStages: number;
  totalTasks: number;
  totalStatuses: number;
  lastUpdated: Date;
}

export interface ConfigValidationResult {
  isValid: boolean;
  errors: ConfigValidationError[];
  warnings: ConfigValidationWarning[];
}

export interface ConfigValidationError {
  type: 'stage' | 'task' | 'status';
  id: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ConfigValidationWarning {
  type: 'stage' | 'task' | 'status';
  id: string;
  message: string;
  suggestion?: string;
}

export interface BulkUpdateResult {
  success: number;
  failed: number;
  errors: { id: string; error: string }[];
}

export interface ConfigTemplate {
  id: string;
  name: string;
  description: string;
  type: 'complete' | 'stage-only' | 'task-only' | 'status-only';
  data: {
    stages?: any[];
    tasks?: any[];
    statuses?: any[];
  };
}

// ドラッグ&ドロップ用の型定義
export interface DragDropItem {
  id: string;
  type: 'stage' | 'task' | 'status';
  index: number;
}

export interface DragDropResult {
  draggedId: string;
  sourceIndex: number;
  destinationIndex: number;
  type: 'stage' | 'task' | 'status';
}

// 共通のカラースキーム表示設定（統合版）
export const COLOR_SCHEME_DISPLAY: Record<string, { name: string; class: string; preview: string }> = {
  // ステージ用
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
  gray: { name: 'グレー', class: 'bg-gray-100 text-gray-800', preview: 'bg-gray-500' },
  // ステータス用（追加）
  green: { name: 'グリーン', class: 'bg-green-100 text-green-800', preview: 'bg-green-500' }
};