export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// API エラー関連の型
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

// API リクエスト関連の型
export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  timeout?: number;
}

// API エンドポイント関連の型
export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  requiresAuth?: boolean;
  description?: string;
}

// ファイルアップロード関連の型
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResponse {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

// WebSocket関連の型
export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
}

export interface WebSocketConnection {
  id: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastMessage?: WebSocketMessage;
}