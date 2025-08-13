import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  ArrowRight 
} from 'lucide-react';

interface PipelineAnalysisProps {
  pipelineAnalysis: {
    totalInPipeline: number;
    stageDistribution: { stage: string; count: number; percentage: number }[];
    conversionRates: { fromStage: string; toStage: string; rate: number }[];
    flowPaths: { path: string[]; count: number; percentage: number }[];
  };
}

export function PipelineAnalysis({ pipelineAnalysis }: PipelineAnalysisProps) {
  const getConversionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // 前段階ごとにグループ化
  const groupedConversionRates = pipelineAnalysis.conversionRates.reduce((groups, item) => {
    if (!groups[item.fromStage]) {
      groups[item.fromStage] = [];
    }
    groups[item.fromStage].push(item);
    return groups;
  }, {} as Record<string, typeof pipelineAnalysis.conversionRates>);

  return (
    <div className="space-y-6">
      {/* パイプライン概要 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>パイプライン概要</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {pipelineAnalysis.totalInPipeline}名
              </span>
              <span className="text-muted-foreground">パイプライン内</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 段階別分布 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>段階別分布</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>選考段階</TableHead>
                <TableHead className="text-center">応募者数</TableHead>
                <TableHead className="text-center">割合</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pipelineAnalysis.stageDistribution.map((item) => (
                <TableRow key={item.stage}>
                  <TableCell className="font-medium">{item.stage}</TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold text-blue-600">{item.count}名</span>
                  </TableCell>
                                     <TableCell className="text-center">
                     <Badge className="border border-gray-300 bg-transparent">
                       {item.percentage.toFixed(1)}%
                     </Badge>
                   </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

             {/* 段階間変換率 */}
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center space-x-2">
             <TrendingUp className="h-5 w-5" />
             <span>段階間変換率（実際の遷移）</span>
           </CardTitle>
         </CardHeader>
         <CardContent>
           <Table>
                         <TableHeader>
              <TableRow>
                <TableHead>次段階</TableHead>
                <TableHead className="text-center">変換率</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
                           <TableBody>
                {Object.entries(groupedConversionRates).map(([fromStage, items]) => (
                  <React.Fragment key={fromStage}>
                    {/* 前段階のヘッダー行 */}
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={3} className="font-bold text-gray-700">
                        {fromStage}
                      </TableCell>
                    </TableRow>
                    {/* 各遷移の詳細行 */}
                    {items.map((item, index) => (
                      <TableRow key={`${fromStage}-${index}`}>
                        <TableCell className="pl-8 text-gray-600">
                          <div className="flex items-center space-x-1">
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <span>{item.toStage}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className={`font-bold ${getConversionRateColor(item.rate)}`}>
                            {item.rate.toFixed(1)}%
                          </div>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
           </Table>
         </CardContent>
       </Card>

       {/* 主要な選考パス */}
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center space-x-2">
             <BarChart3 className="h-5 w-5" />
             <span>主要な選考パス</span>
           </CardTitle>
         </CardHeader>
         <CardContent>
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>選考パス</TableHead>
                 <TableHead className="text-center">応募者数</TableHead>
                 <TableHead className="text-center">割合</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {pipelineAnalysis.flowPaths.map((item, index) => (
                 <TableRow key={index}>
                   <TableCell className="font-medium">
                     <div className="flex items-center space-x-1">
                       {item.path.map((stage, stageIndex) => (
                         <div key={stageIndex} className="flex items-center">
                           <span className="text-sm">{stage}</span>
                           {stageIndex < item.path.length - 1 && (
                             <ArrowRight className="h-3 w-3 text-gray-400 mx-1" />
                           )}
                         </div>
                       ))}
                     </div>
                   </TableCell>
                   <TableCell className="text-center">
                     <span className="font-bold text-blue-600">{item.count}名</span>
                   </TableCell>
                   <TableCell className="text-center">
                     <Badge className="border border-gray-300 bg-transparent">
                       {item.percentage.toFixed(1)}%
                     </Badge>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </CardContent>
       </Card>
     </div>
   );
 }
