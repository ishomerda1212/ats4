export interface PDFDocument {
  id: string;
  applicantId: string;
  name: string;
  category: PDFCategory;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
}

export type PDFCategory = 
  | '履歴書'
  | '適性検査'
  | '卒業証書'
  | '成績証明書'
  | '職務経歴書'
  | '推薦状'
  | 'その他';

export interface PDFUploadOptions {
  category: PDFCategory;
  description?: string;
} 