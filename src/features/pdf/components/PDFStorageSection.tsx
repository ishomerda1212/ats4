import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Download, Trash2, Eye } from 'lucide-react';
import { usePDF } from '../hooks/usePDF';
import { PDFDocument, PDFCategory } from '../types/pdf';
import { Applicant } from '@/features/applicants/types/applicant';
import { toast } from '@/hooks/use-toast';
import { formatDate } from '@/shared/utils/date';

interface PDFStorageSectionProps {
  applicant: Applicant;
}

export function PDFStorageSection({ applicant }: PDFStorageSectionProps) {
  const { documents, uploadPDF, deletePDF, getDocumentsByApplicant } = usePDF();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PDFCategory>('履歴書');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applicantDocuments = getDocumentsByApplicant(applicant.id);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // PDFファイルかチェック
    if (file.type !== 'application/pdf') {
      toast({
        title: "エラー",
        description: "PDFファイルのみアップロードできます。",
        variant: "destructive",
      });
      return;
    }

    // ファイルサイズチェック（10MB制限）
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "エラー",
        description: "ファイルサイズは10MB以下にしてください。",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await uploadPDF(applicant.id, file, {
        category: selectedCategory,
        description: description || undefined
      });
      
      toast({
        title: "アップロード完了",
        description: `${file.name}が正常にアップロードされました。`,
      });

      // フォームをリセット
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "エラー",
        description: "アップロードに失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId: string, fileName: string) => {
    if (confirm(`「${fileName}」を削除しますか？`)) {
      try {
        await deletePDF(documentId);
        toast({
          title: "削除完了",
          description: `${fileName}が削除されました。`,
        });
      } catch (error) {
        console.error('Delete failed:', error);
        toast({
          title: "エラー",
          description: "削除に失敗しました。",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownload = (document: PDFDocument) => {
    // 実際の実装ではサーバーからファイルをダウンロード
    toast({
      title: "ダウンロード開始",
      description: `${document.fileName}のダウンロードを開始しました。`,
    });
  };

  const getCategoryColor = (category: PDFCategory) => {
    const colors: Record<PDFCategory, string> = {
      '履歴書': 'bg-blue-100 text-blue-800',
      '適性検査': 'bg-green-100 text-green-800',
      '卒業証書': 'bg-purple-100 text-purple-800',
      '成績証明書': 'bg-orange-100 text-orange-800',
      '職務経歴書': 'bg-red-100 text-red-800',
      '推薦状': 'bg-pink-100 text-pink-800',
      'その他': 'bg-gray-100 text-gray-800'
    };
    return colors[category];
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
            <FileText className="h-5 w-5" />
            <span>PDF書類管理</span>
          </CardTitle>
          <Button onClick={handleFileSelect} disabled={isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'アップロード中...' : 'PDFをアップロード'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* アップロード設定 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">書類カテゴリ</Label>
            <Select value={selectedCategory} onValueChange={(value: PDFCategory) => setSelectedCategory(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="履歴書">履歴書</SelectItem>
                <SelectItem value="適性検査">適性検査</SelectItem>
                <SelectItem value="卒業証書">卒業証書</SelectItem>
                <SelectItem value="成績証明書">成績証明書</SelectItem>
                <SelectItem value="職務経歴書">職務経歴書</SelectItem>
                <SelectItem value="推薦状">推薦状</SelectItem>
                <SelectItem value="その他">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">説明（任意）</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="書類の説明を入力"
            />
          </div>
        </div>

        {/* 隠しファイル入力 */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

        {/* 書類一覧 */}
        <div>
          <h4 className="font-medium mb-4">保存済み書類 ({applicantDocuments.length}件)</h4>
          
          {applicantDocuments.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">アップロードされた書類がありません</p>
              <p className="text-sm text-gray-400 mt-1">PDFファイルをアップロードしてください</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applicantDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div>
                      <h5 className="font-medium">{document.name}</h5>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getCategoryColor(document.category)}>
                          {document.category}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatFileSize(document.fileSize)}
                        </span>
                      </div>
                      {document.description && (
                        <p className="text-sm text-gray-600 mt-1">{document.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        アップロード: {formatDate(document.uploadedAt)} by {document.uploadedBy}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(document.id, document.fileName)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 