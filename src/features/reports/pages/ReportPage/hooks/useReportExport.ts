import { useState } from 'react';
import { type StageResult, type SourceResult, type GroupResult, type OverallStats } from '../utils/reportCalculations';

export const useReportExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  // CSVデータを生成する関数
  const generateCSVData = (
    stageResults: StageResult[],
    sourceResults: SourceResult[],
    groupResults: GroupResult[],
    overallStats: OverallStats
  ): string => {
    const csvData: string[] = [];

    // 全体統計
    csvData.push('=== 全体統計 ===');
    csvData.push('項目,数値');
    csvData.push(`総応募者数,${overallStats.total}`);
    csvData.push(`合格者数,${overallStats.passed}`);
    csvData.push(`不合格者数,${overallStats.failed}`);
    csvData.push(`進行中,${overallStats.pending}`);
    csvData.push(`辞退者数,${overallStats.declined}`);
    csvData.push(`キャンセル数,${overallStats.cancelled}`);
    csvData.push(`合格率,${overallStats.passRate}%`);
    csvData.push('');

    // グループ別集計
    csvData.push('=== グループ別集計 ===');
    csvData.push('グループ,総数,合格/参加,不合格/不参加,保留,辞退,キャンセル');
    groupResults.forEach(result => {
      csvData.push(`${result.group},${result.total},${result.passed},${result.failed},${result.pending},${result.declined},${result.cancelled}`);
    });
    csvData.push('');

    // 選考段階別集計
    csvData.push('=== 選考段階別集計 ===');
    csvData.push('選考段階,総数,合格,不合格,保留,辞退,キャンセル');
    stageResults.forEach(result => {
      csvData.push(`${result.stage},${result.total},${result.passed},${result.failed},${result.pending},${result.declined},${result.cancelled}`);
    });
    csvData.push('');

    // 反響元別集計
    csvData.push('=== 反響元別集計 ===');
    csvData.push('反響元,総数,合格,不合格,保留,辞退,キャンセル');
    sourceResults.forEach(result => {
      csvData.push(`${result.source},${result.total},${result.passed},${result.failed},${result.pending},${result.declined},${result.cancelled}`);
    });

    return csvData.join('\n');
  };

  // CSVファイルをダウンロードする関数
  const exportToCSV = async (
    stageResults: StageResult[],
    sourceResults: SourceResult[],
    groupResults: GroupResult[],
    overallStats: OverallStats
  ) => {
    setIsExporting(true);
    
    try {
      const csvData = generateCSVData(stageResults, sourceResults, groupResults, overallStats);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `採用レポート_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('CSVエクスポートエラー:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // PDFエクスポート（将来的な拡張用）
  const exportToPDF = async (
    stageResults: StageResult[],
    sourceResults: SourceResult[],
    groupResults: GroupResult[],
    overallStats: OverallStats
  ) => {
    setIsExporting(true);
    
    try {
      // PDF生成ロジックをここに実装
      console.log('PDFエクスポート機能は未実装です', { stageResults, sourceResults, groupResults, overallStats });
    } catch (error) {
      console.error('PDFエクスポートエラー:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportToCSV,
    exportToPDF
  };
};
