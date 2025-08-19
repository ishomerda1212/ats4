import { useState, useEffect } from 'react';
import { PDFFormData } from '../types/applicantDetail';
import { supabase } from '@/lib/supabase';

export interface PDFDocument {
  id: string;
  applicantId: string;
  category: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export function usePDFStorage(applicantId: string) {
  const [showPdfForm, setShowPdfForm] = useState(false);
  const [pdfDocuments, setPdfDocuments] = useState<PDFDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string>('');
  const [previewPdfName, setPreviewPdfName] = useState<string>('');
  const [pdfFormData, setPdfFormData] = useState<PDFFormData>({
    category: '',
    file: null
  });

  // PDFドキュメントを取得
  const fetchPDFDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pdf_documents')
        .select('*')
        .eq('applicant_id', applicantId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch PDF documents:', error);
      } else if (data) {
        const transformedData: PDFDocument[] = data.map(item => ({
          id: item.id,
          applicantId: item.applicant_id,
          category: item.category,
          fileName: item.file_name,
          filePath: item.file_path,
          fileSize: item.file_size,
          fileType: item.file_type,
          uploadedBy: item.uploaded_by,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
        setPdfDocuments(transformedData);
      }
    } catch (error) {
      console.error('Failed to fetch PDF documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicantId) {
      fetchPDFDocuments();
    }
  }, [applicantId]);

  // PDFフォームデータの更新
  const handlePdfFormDataChange = (field: string, value: string | File | null) => {
    setPdfFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // PDF保存機能
  const handleSavePdf = async () => {
    if (!pdfFormData.file || !pdfFormData.category) {
      console.error('PDFファイルとカテゴリを選択してください');
      return;
    }

    try {
      // ファイル名を生成（重複を避けるため）
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}_${pdfFormData.file.name}`;
      const filePath = `pdfs/${applicantId}/${fileName}`;

      // Supabase Storageにファイルをアップロード（認証なし）
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('applicant-documents')
        .upload(filePath, pdfFormData.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Failed to upload PDF:', uploadError);
        alert('PDFファイルのアップロードに失敗しました。');
        return;
      }

      // データベースにPDFドキュメント情報を保存
      const { error: dbError } = await supabase
        .from('pdf_documents')
        .insert([{
          applicant_id: applicantId,
          category: pdfFormData.category,
          file_name: pdfFormData.file.name,
          file_path: filePath,
          file_size: pdfFormData.file.size,
          file_type: pdfFormData.file.type,
          uploaded_by: 'システム管理者', // 後でログインユーザーから取得
        }]);

      if (dbError) {
        console.error('Failed to save PDF document:', dbError);
        alert('PDFドキュメントの保存に失敗しました。');
        return;
      }

      console.log('PDF保存成功:', pdfFormData);
      
      // フォームをリセット
      setPdfFormData({
        category: '',
        file: null
      });
      setShowPdfForm(false);
      
      // PDFドキュメントリストを再取得
      await fetchPDFDocuments();
    } catch (error) {
      console.error('PDF保存エラー:', error);
      alert('PDFファイルの保存に失敗しました。');
    }
  };

  // PDF削除機能
  const handleDeletePdf = async (documentId: string, filePath: string) => {
    try {
      // Supabase Storageからファイルを削除（認証なし）
      const { error: storageError } = await supabase.storage
        .from('applicant-documents')
        .remove([filePath]);

      if (storageError) {
        console.error('Failed to delete PDF from storage:', storageError);
        // Storage削除に失敗しても、データベースからは削除を試行
      }

      // データベースからレコードを削除
      const { error: dbError } = await supabase
        .from('pdf_documents')
        .delete()
        .eq('id', documentId);

      if (dbError) {
        console.error('Failed to delete PDF document:', dbError);
        alert('PDFドキュメントの削除に失敗しました。');
        return;
      }

      // PDFドキュメントリストを再取得
      await fetchPDFDocuments();
    } catch (error) {
      console.error('PDF削除エラー:', error);
      alert('PDFファイルの削除に失敗しました。');
    }
  };

  // PDFダウンロード機能
  const handleDownloadPdf = async (document: PDFDocument) => {
    try {
      // Supabase Storageからファイルをダウンロード（認証なし）
      const { data, error } = await supabase.storage
        .from('applicant-documents')
        .download(document.filePath);

      if (error) {
        console.error('Failed to download PDF:', error);
        alert('PDFファイルのダウンロードに失敗しました。');
        return;
      }

      // ファイルをダウンロード
      const url = window.URL.createObjectURL(data);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDFダウンロードエラー:', error);
      alert('PDFファイルのダウンロードに失敗しました。');
    }
  };

  // PDFプレビュー機能
  const handlePreviewPdf = async (document: PDFDocument) => {
    try {
      // Supabase StorageからファイルのURLを取得（認証なし）
      const { data } = supabase.storage
        .from('applicant-documents')
        .getPublicUrl(document.filePath);

      if (data?.publicUrl) {
        setPreviewPdfUrl(data.publicUrl);
        setPreviewPdfName(document.fileName);
        setShowPdfPreview(true);
      } else {
        alert('PDFファイルのプレビューに失敗しました。');
      }
    } catch (error) {
      console.error('PDFプレビューエラー:', error);
      alert('PDFファイルのプレビューに失敗しました。');
    }
  };

  // PDFプレビューを閉じる
  const closePdfPreview = () => {
    setShowPdfPreview(false);
    setPreviewPdfUrl('');
    setPreviewPdfName('');
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
    pdfDocuments,
    loading,
    setShowPdfForm,
    handlePdfFormDataChange,
    handleSavePdf,
    handleDeletePdf,
    handleDownloadPdf,
    resetPdfForm,
    fetchPDFDocuments,
    showPdfPreview,
    previewPdfUrl,
    previewPdfName,
    handlePreviewPdf,
    closePdfPreview
  };
}
