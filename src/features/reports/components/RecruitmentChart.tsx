import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useApplicants } from '@/features/applicants/hooks/useApplicants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface RecruitmentChartProps {
  period: 'week' | 'month';
  chartType: 'bar' | 'line';
}

export function RecruitmentChart({ period, chartType }: RecruitmentChartProps) {
  const { applicants } = useApplicants();

  // データの集計
  const chartData = useMemo(() => {
    const now = new Date();
    const labels: string[] = [];
    const entryData: number[] = [];
    const interviewData: number[] = [];

    if (period === 'week') {
      // 過去7日間のデータ
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
        labels.push(dateStr);

        // その日のエントリー数
        const dayEntries = applicants.filter(applicant => {
          const entryDate = new Date(applicant.createdAt);
          return entryDate.toDateString() === date.toDateString();
        }).length;
        entryData.push(dayEntries);

                 // その日の面接数（面接段階の履歴がある応募者）
         const dayInterviews = applicants.filter(applicant => {
           return applicant.history?.some(history => {
             const historyDate = new Date(history.createdAt);
             return historyDate.toDateString() === date.toDateString() && 
                    (history.stage.includes('面接') || history.stage === 'CEOセミナー' || history.stage === '最終選考');
           });
         }).length;
        interviewData.push(dayInterviews);
      }
    } else {
      // 過去12ヶ月のデータ
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' });
        labels.push(monthStr);

        // その月のエントリー数
        const monthEntries = applicants.filter(applicant => {
          const entryDate = new Date(applicant.createdAt);
          return entryDate.getFullYear() === date.getFullYear() && 
                 entryDate.getMonth() === date.getMonth();
        }).length;
        entryData.push(monthEntries);

                 // その月の面接数
         const monthInterviews = applicants.filter(applicant => {
           return applicant.history?.some(history => {
             const historyDate = new Date(history.createdAt);
             return historyDate.getFullYear() === date.getFullYear() && 
                    historyDate.getMonth() === date.getMonth() &&
                    (history.stage.includes('面接') || history.stage === 'CEOセミナー' || history.stage === '最終選考');
           });
         }).length;
        interviewData.push(monthInterviews);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: 'エントリー数',
          data: entryData,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          tension: 0.1,
        },
        {
          label: '面接数',
          data: interviewData,
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          tension: 0.1,
        }
      ]
    };
  }, [applicants, period]);

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: period === 'week' ? '過去7日間の採用活動' : '過去12ヶ月の採用活動',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>採用活動推移</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">期間:</span>
                         <Select value={period} onValueChange={() => {
               // 期間変更の処理（親コンポーネントで管理）
             }}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">週間</SelectItem>
                <SelectItem value="month">月間</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartType === 'bar' ? (
            <Bar data={chartData} options={options} />
          ) : (
            <Line data={chartData} options={options} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
