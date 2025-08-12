import { useState } from 'react';
import { PDFFormData } from '../types/applicantDetail';

export function usePDFStorage() {
  const [showPdfForm, setShowPdfForm] = useState(false);
  const [pdfFormData, setPdfFormData] = useState<PDFFormData>({
    category: '',
    file: null
  });

  // PDFフォームデータの更新
  const handlePdfFormDataChange = (field: string, value: string | File | null) => {
    setPdfFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // PDF保存機能
  const handleSavePdf = () => {
    // ここでPDFの保存処理を実装
    console.log('PDF保存:', pdfFormData);
    
    // フォームをリセット
    setPdfFormData({
      category: '',
      file: null
    });
    setShowPdfForm(false);
  };

  // PDFフォームをリセット
  const resetPdfForm = () => {
    setPdfFormData({
      category: '',
      file: null
    });
    setShowPdfForm(false);
  };

  return {
    showPdfForm,
    pdfFormData,
    setShowPdfForm,
    handlePdfFormDataChange,
    handleSavePdf,
    resetPdfForm
  };
}
