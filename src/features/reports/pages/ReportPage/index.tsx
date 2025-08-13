import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  BarChart
} from 'lucide-react';
import { RecruitmentChart } from '../../components/RecruitmentChart';
import { RecruitmentMetrics } from './components/RecruitmentMetrics';
import { StageAnalysis } from './components/StageAnalysis';
import { ApplicantAnalysis } from './components/ApplicantAnalysis';
import { ExportSection } from './components/ExportSection';
import { PipelineAnalysis } from './components/PipelineAnalysis';
import { useReportData } from './hooks/useReportData';

export function ReportPage() {
  const {
    stageResults,
    sourceResults,
    groupResults,
    overallStats,
    thisMonthEntries,
    thisMonthInterviews,
    currentStageResults,
    pipelineAnalysis
  } = useReportData();

  const [activeTab, setActiveTab] = useState('group-summary');
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

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
      <RecruitmentMetrics overallStats={overallStats} />

      {/* タブコンテンツ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="group-summary" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>グループ別集計</span>
          </TabsTrigger>
          <TabsTrigger value="stage-summary" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>選考段階別集計</span>
          </TabsTrigger>
          <TabsTrigger value="pipeline-analysis" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>パイプライン分析</span>
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
          <ApplicantAnalysis 
            sourceResults={sourceResults}
            groupResults={groupResults}
          />
        </TabsContent>

        {/* 選考段階別集計タブ */}
        <TabsContent value="stage-summary" className="mt-6">
          <StageAnalysis 
            stageResults={stageResults} 
            currentStageResults={currentStageResults}
          />
        </TabsContent>

        {/* パイプライン分析タブ */}
        <TabsContent value="pipeline-analysis" className="mt-6">
          <PipelineAnalysis pipelineAnalysis={pipelineAnalysis} />
        </TabsContent>

        {/* 反響元別集計タブ */}
        <TabsContent value="source-summary" className="mt-6">
          <ApplicantAnalysis 
            sourceResults={sourceResults}
            groupResults={groupResults}
          />
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
                        {thisMonthEntries}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">今月の面接数</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {thisMonthInterviews}
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

      {/* エクスポート機能 */}
      <ExportSection 
        stageResults={stageResults}
        sourceResults={sourceResults}
        groupResults={groupResults}
        overallStats={overallStats}
      />
    </div>
  );
}
