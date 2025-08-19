import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileArchive,
  Plus,
  CheckCircle,
  Trash2,
  Download,
  FileText,
  Eye
} from 'lucide-react';
import { PDFStorageTabProps } from '../types/applicantDetail';
import { PDFDocument } from '../hooks/usePDFStorage';
import { PDFViewer } from './PDFViewer';

interface ExtendedPDFStorageTabProps extends PDFStorageTabProps {
  pdfDocuments: PDFDocument[];
  loading: boolean;
  onDeletePdf: (documentId: string, filePath: string) => void;
  onPreviewPdf: (document: PDFDocument) => void;
  onDownloadPdf: (document: PDFDocument) => void;
  showPdfPreview: boolean;
  previewPdfUrl: string;
  previewPdfName: string;
  onClosePdfPreview: () => void;
}

export function PDFStorageTab({
  pdfFormData,
  showPdfForm,
  onShowPdfForm,
  onPdfFormDataChange,
  onSavePdf,
  pdfDocuments,
  loading,
  onDeletePdf,
  onPreviewPdf,
  onDownloadPdf,
  showPdfPreview,
  previewPdfUrl,
  previewPdfName,
  onClosePdfPreview
}: ExtendedPDFStorageTabProps) {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'resume': return '履歴書';
      case 'cover-letter': return '職務経歴書';
      case 'evaluation': return '評価資料';
      case 'contract': return '契約書類';
      case 'other': return 'その他';
      default: return category;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileArchive className="h-5 w-5" />
            <span>PDF管理</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onShowPdfForm(!showPdfForm)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {showPdfForm ? 'フォームを閉じる' : 'PDF追加'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showPdfForm ? (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">PDF追加</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">カテゴリ</Label>
                <Select value={pdfFormData.category} onValueChange={(value) => onPdfFormDataChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resume">履歴書</SelectItem>
                    <SelectItem value="cover-letter">職務経歴書</SelectItem>
                    <SelectItem value="evaluation">評価資料</SelectItem>
                    <SelectItem value="contract">契約書類</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">PDFファイル</Label>
                <Input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => onPdfFormDataChange('file', e.target.files?.[0] || null)}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => onShowPdfForm(false)}>
                キャンセル
              </Button>
              <Button onClick={onSavePdf}>
                追加
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 保存されたPDFの一覧 */}
            {pdfDocuments.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">保存されたPDF</h3>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin h-6 w-6 border-b-2 border-blue-600 rounded-full mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">読み込み中...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pdfDocuments.map((document) => (
                      <Card key={document.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-8 w-8 text-red-500" />
                            <div>
                              <h4 className="font-medium text-sm">{document.fileName}</h4>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {getCategoryLabel(document.category)}
                                </span>
                                <span>{formatFileSize(document.fileSize)}</span>
                                <span>{new Date(document.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onPreviewPdf(document)}
                              title="プレビュー"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onDownloadPdf(document)}
                              title="ダウンロード"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onDeletePdf(document.id, document.filePath)}
                              title="削除"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 初期表示（PDFがない場合） */}
            {pdfDocuments.length === 0 && !loading && (
              <div className="text-center py-8">
                <FileArchive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">PDF管理機能</h3>
                <p className="text-muted-foreground mb-4">
                  PDF管理機能は現在開発中です。<br />
                  応募者の書類や評価資料をPDFで管理できます。
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>PDFファイルのアップロード</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>カテゴリ別の整理</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>検索・フィルタリング</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {/* PDFビューアー */}
      <PDFViewer
        isOpen={showPdfPreview}
        onClose={onClosePdfPreview}
        pdfUrl={previewPdfUrl}
        pdfName={previewPdfName}
      />
    </Card>
  );
}
