export type Status = 'loading' | 'error' | 'success' | 'idle';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SelectOption {
  value: string;
  label: string;
}

// ステータス関連の型
export type ApplicationStatus = 
  | 'エントリー'
  | '書類選考'
  | '一次面接'
  | '二次面接'
  | '最終選考'
  | '内定'
  | '内定承諾'
  | '辞退'
  | '不合格';

export type TaskStatus = 
  | '未着手'
  | '進行中'
  | '完了'
  | 'キャンセル';

export type EventStatus = 
  | '予定'
  | '開催中'
  | '終了'
  | 'キャンセル';

// 評価関連の型
export type Rating = 'A' | 'B' | 'C' | 'D' | 'E';

export interface EvaluationCriteria {
  criteria: string[];
  [key: string]: unknown;
}

// フォーム関連の型
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'date' | 'file';
  required?: boolean;
  options?: SelectOption[];
  placeholder?: string;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

// ページネーション関連の型
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 検索・フィルター関連の型
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
  pagination?: PaginationParams;
}

// ファイル関連の型
export interface FileUpload {
  file: File;
  name: string;
  size: number;
  type: string;
  progress?: number;
}

// 通知関連の型
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
}