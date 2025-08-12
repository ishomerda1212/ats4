import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserMinus, 
  UserX 
} from 'lucide-react';
import { type StageResult } from '../utils/reportCalculations';

interface StageAnalysisProps {
  stageResults: StageResult[];
}

export function StageAnalysis({ stageResults }: StageAnalysisProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case '合格':
      case '参加':
      case '内定':
      case '承諾':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case '不合格':
      case '不参加':
      case '無断欠席':
      case '未承諾':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case '保留':
      case '参加予定':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case '辞退':
        return <UserMinus className="h-4 w-4 text-gray-600" />;
      case 'キャンセル':
        return <UserX className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>選考段階別集計</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>選考段階</TableHead>
              <TableHead className="text-center">総数</TableHead>
              <TableHead className="text-center">合格</TableHead>
              <TableHead className="text-center">不合格</TableHead>
              <TableHead className="text-center">保留</TableHead>
              <TableHead className="text-center">辞退</TableHead>
              <TableHead className="text-center">キャンセル</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stageResults.map((result) => (
              <TableRow key={result.stage}>
                <TableCell className="font-medium">{result.stage}</TableCell>
                <TableCell className="text-center font-bold">{result.total}名</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {getStatusIcon('合格')}
                    <span className="font-bold text-green-600">{result.passed}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.total > 0 ? ((result.passed / result.total) * 100).toFixed(1) : '0.0'}%
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {getStatusIcon('不合格')}
                    <span className="font-bold text-red-600">{result.failed}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.total > 0 ? ((result.failed / result.total) * 100).toFixed(1) : '0.0'}%
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {getStatusIcon('保留')}
                    <span className="font-bold text-yellow-600">{result.pending}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.total > 0 ? ((result.pending / result.total) * 100).toFixed(1) : '0.0'}%
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {getStatusIcon('辞退')}
                    <span className="font-bold text-gray-600">{result.declined}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.total > 0 ? ((result.declined / result.total) * 100).toFixed(1) : '0.0'}%
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {getStatusIcon('キャンセル')}
                    <span className="font-bold text-gray-600">{result.cancelled}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.total > 0 ? ((result.cancelled / result.total) * 100).toFixed(1) : '0.0'}%
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
