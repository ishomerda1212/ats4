import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserMinus,
  UserX,
  Building2,
  BarChart
} from 'lucide-react';
import { useApplicants } from '@/features/applicants/hooks/useApplicants';
import { SelectionStage } from '@/features/applicants/types/applicant';
import { SELECTION_STAGES, STAGE_GROUPS } from '@/shared/utils/constants';
import { RecruitmentChart } from '../components/RecruitmentChart';

interface StageResult {
  stage: string;
  total: number;
  passed: number;
  failed: number;
  pending: number;
  declined: number;
  cancelled: number;
}

interface SourceResult {
  source: string;
  total: number;
  passed: number;
  failed: number;
  pending: number;
  declined: number;
  cancelled: number;
}

interface GroupResult {
  group: string;
  total: number;
  passed: number;
  failed: number;
  pending: number;
  declined: number;
  cancelled: number;
}

export function ReportPage() {
  const { applicants } = useApplicants();
  const [activeTab, setActiveTab] = useState('group-summary');
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  // 選考段階ごとの集計
  const stageResults = useMemo((): StageResult[] => {
    const results: StageResult[] = SELECTION_STAGES.map(stage => ({
      stage,
      total: 0,
      passed: 0,
      failed: 0,
      pending: 0,
      declined: 0,
      cancelled: 0
    }));

    applicants.forEach(applicant => {
      // 各選考段階の履歴を確認
      applicant.history?.forEach(historyItem => {
        const stageIndex = results.findIndex(r => r.stage === historyItem.stage);
        if (stageIndex !== -1) {
          results[stageIndex].total++;
          
                                 // 結果に基づいてカウント
            switch (historyItem.status) {
              case '合格':
              case '参加':
              case '内定':
              case '承諾':
                results[stageIndex].passed++;
                break;
              case '不合格':
              case '不参加':
              case '無断欠席':
              case '未承諾':
                results[stageIndex].failed++;
                break;
              case '保留':
              case '参加予定':
                results[stageIndex].pending++;
                break;
              case '辞退':
                results[stageIndex].declined++;
                break;
              case 'キャンセル':
                results[stageIndex].cancelled++;
                break;
              case '完了':
                // 完了の場合は段階に応じて判定
                if (historyItem.stage === '最終選考' || historyItem.stage === '内定面談') {
                  results[stageIndex].passed++;
                } else {
                  results[stageIndex].pending++;
                }
                break;
              case '不採用':
                results[stageIndex].failed++;
                break;
              default:
                results[stageIndex].pending++;
                break;
            }
        }
      });
    });

    return results.filter(result => result.total > 0);
  }, [applicants]);

  // 反響元ごとの集計
  const sourceResults = useMemo((): SourceResult[] => {
    const sourceMap = new Map<string, SourceResult>();

    applicants.forEach(applicant => {
      const source = applicant.source || 'その他';
      
      if (!sourceMap.has(source)) {
        sourceMap.set(source, {
          source,
          total: 0,
          passed: 0,
          failed: 0,
          pending: 0,
          declined: 0,
          cancelled: 0
        });
      }

      const sourceResult = sourceMap.get(source)!;
      sourceResult.total++;

                     // 最終的な結果を判定
        const finalStage = applicant.history?.[applicant.history.length - 1];
        if (finalStage) {
          switch (finalStage.status) {
            case '合格':
            case '参加':
            case '内定':
            case '承諾':
              sourceResult.passed++;
              break;
            case '不合格':
            case '不参加':
            case '無断欠席':
            case '未承諾':
              sourceResult.failed++;
              break;
            case '保留':
            case '参加予定':
              sourceResult.pending++;
              break;
            case '辞退':
              sourceResult.declined++;
              break;
            case 'キャンセル':
              sourceResult.cancelled++;
              break;
            case '完了':
              // 完了の場合は段階に応じて判定
              if (finalStage.stage === '最終選考' || finalStage.stage === '内定面談') {
                sourceResult.passed++;
              } else {
                sourceResult.pending++;
              }
              break;
            case '不採用':
              sourceResult.failed++;
              break;
            default:
              sourceResult.pending++;
              break;
          }
        } else {
          sourceResult.pending++;
        }
    });

    return Array.from(sourceMap.values()).sort((a, b) => b.total - a.total);
  }, [applicants]);

  // グループ別集計
  const groupResults = useMemo((): GroupResult[] => {
    const groupMap = new Map<string, GroupResult>();

    // 各グループを初期化
    Object.keys(STAGE_GROUPS).forEach(groupName => {
      groupMap.set(groupName, {
        group: groupName,
        total: 0,
        passed: 0,
        failed: 0,
        pending: 0,
        declined: 0,
        cancelled: 0
      });
    });

    applicants.forEach(applicant => {
      // 各選考段階の履歴を確認
      applicant.history?.forEach(historyItem => {
        // どのグループに属するかを判定
        let targetGroup = 'その他';
        for (const [groupName, stages] of Object.entries(STAGE_GROUPS)) {
          if (stages.includes(historyItem.stage as SelectionStage)) {
            targetGroup = groupName;
            break;
          }
        }

        const groupResult = groupMap.get(targetGroup);
        if (groupResult) {
          groupResult.total++;
          
          // 結果に基づいてカウント
          switch (historyItem.status) {
            case '合格':
            case '参加':
            case '内定':
            case '承諾':
              groupResult.passed++;
              break;
            case '不合格':
            case '不参加':
            case '不内定':
            case '確定':
            case '無断欠席':
            case '未承諾':
              groupResult.failed++;
              break;
            case '保留':
            case '参加予定':
              groupResult.pending++;
              break;
            case '辞退':
              groupResult.declined++;
              break;
            case 'キャンセル':
              groupResult.cancelled++;
              break;
            case '完了':
              // 完了の場合は段階に応じて判定
              if (historyItem.stage === '最終選考' || historyItem.stage === '内定面談') {
                groupResult.passed++;
              } else {
                groupResult.pending++;
              }
              break;
            case '不採用':
              groupResult.failed++;
              break;
            default:
              groupResult.pending++;
              break;
          }
        }
      });
    });

    return Array.from(groupMap.values()).filter(result => result.total > 0);
  }, [applicants]);

     // 全体の統計
   const overallStats = useMemo(() => {
     const total = applicants.length;
         const passed = applicants.filter(a => {
      const finalStage = a.history?.[a.history.length - 1];
      return finalStage?.status === '合格' || 
             finalStage?.status === '参加' ||
             finalStage?.status === '内定' ||
             finalStage?.status === '承諾' ||
             (finalStage?.status === '完了' && 
              (finalStage.stage === '最終選考' || finalStage.stage === '内定面談'));
    }).length;
    const failed = applicants.filter(a => {
      const finalStage = a.history?.[a.history.length - 1];
      return finalStage?.status === '不合格' || 
             finalStage?.status === '不採用' ||
             finalStage?.status === '不参加' ||
             finalStage?.status === '無断欠席' ||
             finalStage?.status === '未承諾';
    }).length;
    const pending = applicants.filter(a => {
      const finalStage = a.history?.[a.history.length - 1];
      return finalStage?.status === '保留' || 
             finalStage?.status === '参加予定' ||
             finalStage?.status === '進行中' ||
             !finalStage;
    }).length;
     const declined = applicants.filter(a => 
       a.history?.[a.history.length - 1]?.status === '辞退'
     ).length;
     const cancelled = applicants.filter(a => 
       a.history?.[a.history.length - 1]?.status === 'キャンセル'
     ).length;

    return {
      total,
      passed,
      failed,
      pending,
      declined,
      cancelled,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0'
    };
  }, [applicants]);

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">採用レポート</h1>
          <p className="text-muted-foreground mt-1">
            選考状況と成果の分析レポート
          </p>
        </div>
      </div>

      {/* 全体統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総応募者数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">合格者数</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallStats.passed}</div>
            <p className="text-xs text-muted-foreground">
              合格率: {overallStats.passRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">不合格者数</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overallStats.failed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">進行中</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{overallStats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* タブコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="group-summary" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>グループ別集計</span>
          </TabsTrigger>
          <TabsTrigger value="stage-summary" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>選考段階別集計</span>
          </TabsTrigger>
          <TabsTrigger value="source-summary" className="flex items-center space-x-2">
            <PieChart className="h-4 w-4" />
            <span>反響元別集計</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>トレンド分析</span>
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center space-x-2">
            <BarChart className="h-4 w-4" />
            <span>グラフ</span>
          </TabsTrigger>
        </TabsList>

        {/* グループ別集計タブ */}
        <TabsContent value="group-summary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>グループ別集計</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>グループ</TableHead>
                    <TableHead className="text-center">総数</TableHead>
                    <TableHead className="text-center">合格/参加</TableHead>
                    <TableHead className="text-center">不合格/不参加</TableHead>
                    <TableHead className="text-center">保留</TableHead>
                    <TableHead className="text-center">辞退</TableHead>
                    <TableHead className="text-center">キャンセル</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupResults.map((result) => (
                    <TableRow key={result.group}>
                      <TableCell className="font-medium">{result.group}</TableCell>
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
        </TabsContent>

                 {/* 選考段階別集計タブ */}
         <TabsContent value="stage-summary" className="mt-6">
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
         </TabsContent>

                 {/* 反響元別集計タブ */}
         <TabsContent value="source-summary" className="mt-6">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center space-x-2">
                 <PieChart className="h-5 w-5" />
                 <span>反響元別集計</span>
               </CardTitle>
             </CardHeader>
             <CardContent>
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>反響元</TableHead>
                     <TableHead className="text-center">総数</TableHead>
                     <TableHead className="text-center">合格</TableHead>
                     <TableHead className="text-center">不合格</TableHead>
                     <TableHead className="text-center">保留</TableHead>
                     <TableHead className="text-center">辞退</TableHead>
                     <TableHead className="text-center">キャンセル</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {sourceResults.map((result) => (
                     <TableRow key={result.source}>
                       <TableCell className="font-medium">
                         <div className="flex items-center space-x-2">
                           <Building2 className="h-4 w-4 text-muted-foreground" />
                           <span>{result.source}</span>
                         </div>
                       </TableCell>
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
         </TabsContent>

         {/* トレンド分析タブ */}
         <TabsContent value="trends" className="mt-6">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center space-x-2">
                 <TrendingUp className="h-5 w-5" />
                 <span>トレンド分析</span>
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <Card>
                     <CardHeader>
                       <CardTitle className="text-sm">今月のエントリー数</CardTitle>
                     </CardHeader>
                     <CardContent>
                       <div className="text-2xl font-bold text-blue-600">
                         {(() => {
                           const now = new Date();
                           const thisMonth = applicants.filter(applicant => {
                             const entryDate = new Date(applicant.createdAt);
                             return entryDate.getFullYear() === now.getFullYear() && 
                                    entryDate.getMonth() === now.getMonth();
                           }).length;
                           return thisMonth;
                         })()}
                       </div>
                     </CardContent>
                   </Card>
                   
                   <Card>
                     <CardHeader>
                       <CardTitle className="text-sm">今月の面接数</CardTitle>
                     </CardHeader>
                     <CardContent>
                       <div className="text-2xl font-bold text-green-600">
                         {(() => {
                           const now = new Date();
                           const thisMonth = applicants.filter(applicant => {
                             return applicant.history?.some(history => {
                               const historyDate = new Date(history.startDate);
                               return historyDate.getFullYear() === now.getFullYear() && 
                                      historyDate.getMonth() === now.getMonth() &&
                                      (history.stage.includes('面接') || history.stage === 'CEOセミナー' || history.stage === '最終選考');
                             });
                           }).length;
                           return thisMonth;
                         })()}
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               </div>
             </CardContent>
           </Card>
         </TabsContent>

         {/* グラフタブ */}
         <TabsContent value="charts" className="mt-6">
           <div className="space-y-6">
             <div className="flex items-center justify-between">
               <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-2">
                   <span className="text-sm font-medium">グラフタイプ:</span>
                   <div className="flex space-x-2">
                     <button
                       onClick={() => setChartType('bar')}
                       className={`px-3 py-1 rounded-md text-sm font-medium ${
                         chartType === 'bar' 
                           ? 'bg-blue-100 text-blue-700' 
                           : 'bg-gray-100 text-gray-600'
                       }`}
                     >
                       棒グラフ
                     </button>
                     <button
                       onClick={() => setChartType('line')}
                       className={`px-3 py-1 rounded-md text-sm font-medium ${
                         chartType === 'line' 
                           ? 'bg-blue-100 text-blue-700' 
                           : 'bg-gray-100 text-gray-600'
                       }`}
                     >
                       折れ線グラフ
                     </button>
                   </div>
                 </div>
                 
                 <div className="flex items-center space-x-2">
                   <span className="text-sm font-medium">期間:</span>
                   <div className="flex space-x-2">
                     <button
                       onClick={() => setChartPeriod('week')}
                       className={`px-3 py-1 rounded-md text-sm font-medium ${
                         chartPeriod === 'week' 
                           ? 'bg-green-100 text-green-700' 
                           : 'bg-gray-100 text-gray-600'
                       }`}
                     >
                       週間
                     </button>
                     <button
                       onClick={() => setChartPeriod('month')}
                       className={`px-3 py-1 rounded-md text-sm font-medium ${
                         chartPeriod === 'month' 
                           ? 'bg-green-100 text-green-700' 
                           : 'bg-gray-100 text-gray-600'
                       }`}
                     >
                       月間
                     </button>
                   </div>
                 </div>
               </div>
             </div>
             
             <RecruitmentChart period={chartPeriod} chartType={chartType} />
           </div>
         </TabsContent>
       </Tabs>
     </div>
   );
 }
