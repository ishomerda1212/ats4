import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  Activity 
} from 'lucide-react';
import { type CurrentStageResult } from '../utils/reportCalculations';

interface CurrentStageAnalysisProps {
  currentStageResults: CurrentStageResult[];
}

export function CurrentStageAnalysis({ currentStageResults }: CurrentStageAnalysisProps) {
  const getStatusBadge = (active: number, completed: number) => {
    const total = active + completed;
    if (total === 0) return <Badge className="bg-gray-100 text-gray-800">なし</Badge>;
    
    const activePercentage = (active / total) * 100;
    if (activePercentage > 70) {
      return <Badge className="bg-green-100 text-green-800">活発</Badge>;
    } else if (activePercentage > 30) {
      return <Badge className="bg-yellow-100 text-yellow-800">通常</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">停滞</Badge>;
    }
  };

  const getConversionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>現在の選考段階別集計（リアルタイム）</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>選考段階</TableHead>
              <TableHead className="text-center">現在の応募者</TableHead>
              <TableHead className="text-center">アクティブ</TableHead>
              <TableHead className="text-center">完了</TableHead>
              <TableHead className="text-center">変換率</TableHead>
              <TableHead className="text-center">平均滞留期間</TableHead>
              <TableHead className="text-center">状況</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStageResults.map((result) => (
              <TableRow key={result.stage}>
                <TableCell className="font-medium">{result.stage}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-blue-600">{result.current}名</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-600">{result.active}名</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="font-bold text-purple-600">{result.completed}名</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className={`font-bold ${getConversionRateColor(result.conversionRate)}`}>
                    {result.conversionRate.toFixed(1)}%
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="font-bold text-gray-600">
                      {result.avgDuration > 0 ? `${result.avgDuration.toFixed(1)}日` : 'N/A'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(result.active, result.completed)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
