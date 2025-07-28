import { useState, useCallback } from 'react';
import { PDFDocument, PDFCategory } from '../types/pdf';
import { generateId } from '@/shared/utils/date';

// モックデータ（実際の実装ではAPIやストレージを使用）
const mockPDFDocuments: PDFDocument[] = [
  {
    id: '1',
    applicantId: '1',
    name: '田中太郎_履歴書',
    category: '履歴書',
    fileName: 'tanaka_resume.pdf',
    fileSize: 1024000,
    uploadedAt: new Date('2024-01-15'),
    uploadedBy: '人事部 田中',
    description: '応募時の履歴書'
  },
  {
    id: '2',
    applicantId: '1',
    name: '田中太郎_適性検査結果',
    category: '適性検査',
    fileName: 'tanaka_aptitude_test.pdf',
    fileSize: 512000,
    uploadedAt: new Date('2024-01-18'),
    uploadedBy: '人事部 田中',
    description: 'SPI適性検査の結果'
  }
];

export const usePDF = () => {
  const [documents, setDocuments] = useState<PDFDocument[]>(mockPDFDocuments);

  const uploadPDF = useCallback(async (
    applicantId: string,
    file: File,
    options: { category: PDFCategory; description?: string }
  ): Promise<PDFDocument> => {
    // 実際の実装ではファイルをサーバーにアップロード
    const newDocument: PDFDocument = {
      id: generateId(),
      applicantId,
      name: file.name.replace('.pdf', ''),
      category: options.category,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date(),
      uploadedBy: '人事部 田中', // 実際の実装ではログインユーザーから取得
      description: options.description
    };

    setDocuments(prev => [...prev, newDocument]);
    return newDocument;
  }, []);

  const deletePDF = useCallback(async (documentId: string): Promise<void> => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  }, []);

  const getDocumentsByApplicant = useCallback((applicantId: string): PDFDocument[] => {
    return documents.filter(doc => doc.applicantId === applicantId);
  }, [documents]);

  const getDocumentsByCategory = useCallback((applicantId: string, category: PDFCategory): PDFDocument[] => {
    return documents.filter(doc => doc.applicantId === applicantId && doc.category === category);
  }, [documents]);

  return {
    documents,
    uploadPDF,
    deletePDF,
    getDocumentsByApplicant,
    getDocumentsByCategory
  };
}; 