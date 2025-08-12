import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { type StageResult, type SourceResult, type GroupResult, type OverallStats } from '../utils/reportCalculations';
import { useReportExport } from '../hooks/useReportExport';

interface ExportSectionProps {
  stageResults: StageResult[];
  sourceResults: SourceResult[];
  groupResults: GroupResult[];
  overallStats: OverallStats;
}

export function ExportSection({ 
  stageResults, 
  sourceResults, 
  groupResults, 
  overallStats 
}: ExportSectionProps) {
  const { isExporting, exportToCSV, exportToPDF } = useReportExport();

  const handleCSVExport = () => {
    exportToCSV(stageResults, sourceResults, groupResults, overallStats);
  };

  const handlePDFExport = () => {
    exportToPDF(stageResults, sourceResults, groupResults, overallStats);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>レポートエクスポート</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={handleCSVExport} 
              disabled={isExporting}
              className="w-full"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              CSVエクスポート
            </Button>
            
            <Button 
              onClick={handlePDFExport} 
              disabled={isExporting}
              className="w-full"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              PDFエクスポート
            </Button>
          </div>
          
          {isExporting && (
            <div className="text-center text-sm text-muted-foreground">
              エクスポート中...
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            <p>• CSVエクスポート: 全データをCSV形式でダウンロード</p>
            <p>• PDFエクスポート: レポートをPDF形式でダウンロード（開発中）</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
