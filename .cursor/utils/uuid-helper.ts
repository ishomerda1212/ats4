/**
 * UUID生成と管理のヘルパー関数
 */

/**
 * ブラウザ環境でUUIDを生成
 * @returns 生成されたUUID
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // フォールバック: 簡易UUID生成
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * UUIDが有効かどうかを検証
 * @param uuid 検証するUUID
 * @returns 有効な場合はtrue
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * データベース用のUUID生成（Supabase互換）
 * @returns 生成されたUUID
 */
export function generateDatabaseUUID(): string {
  return generateUUID();
}

/**
 * 複数のUUIDを生成
 * @param count 生成するUUIDの数
 * @returns UUIDの配列
 */
export function generateMultipleUUIDs(count: number): string[] {
  return Array.from({ length: count }, () => generateUUID());
}

/**
 * UUIDの短縮版を生成（表示用）
 * @param uuid 元のUUID
 * @param length 短縮する長さ（デフォルト: 8）
 * @returns 短縮されたUUID
 */
export function shortenUUID(uuid: string, length: number = 8): string {
  return uuid.replace(/-/g, '').substring(0, length);
}

/**
 * セッション作成用のUUID生成
 * @param prefix プレフィックス（オプション）
 * @returns 生成されたUUID
 */
export function generateSessionUUID(prefix?: string): string {
  const uuid = generateUUID();
  return prefix ? `${prefix}-${uuid}` : uuid;
}

/**
 * イベント作成用のUUID生成
 * @returns 生成されたUUID
 */
export function generateEventUUID(): string {
  return generateUUID();
}

/**
 * 応募者作成用のUUID生成
 * @returns 生成されたUUID
 */
export function generateApplicantUUID(): string {
  return generateUUID();
}

/**
 * タスク作成用のUUID生成
 * @returns 生成されたUUID
 */
export function generateTaskUUID(): string {
  return generateUUID();
}

/**
 * 選考履歴作成用のUUID生成
 * @returns 生成されたUUID
 */
export function generateSelectionHistoryUUID(): string {
  return generateUUID();
}

/**
 * 評価フォーム作成用のUUID生成
 * @returns 生成されたUUID
 */
export function generateEvaluationFormUUID(): string {
  return generateUUID();
}

/**
 * PDFドキュメント作成用のUUID生成
 * @returns 生成されたUUID
 */
export function generatePDFDocumentUUID(): string {
  return generateUUID();
}
