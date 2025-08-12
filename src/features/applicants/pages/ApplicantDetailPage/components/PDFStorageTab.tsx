import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileArchive,
  Plus,
  CheckCircle
} from 'lucide-react';
import { PDFStorageTabProps } from '../types/applicantDetail';

export function PDFStorageTab({
  pdfFormData,
  showPdfForm,
  onShowPdfForm,
  onPdfFormDataChange,
  onSavePdf
}: PDFStorageTabProps) {
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
      </CardContent>
    </Card>
  );
}
