import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export interface FinalSelectionStageData {
  candidateDates?: string[];
  result?: string;
  resultDate?: string;
  evaluator?: string;
  comments?: string;
  notes?: string;
  tasks?: {
    detailedContact?: { completed: boolean; completedAt?: string };
    documentCollection?: { completed: boolean; completedAt?: string };
    resultNotification?: { completed: boolean; completedAt?: string };
  };
}

export interface StageFinalSelectionDisplayProps {
  data?: FinalSelectionStageData;
  applicantId?: string;
  applicantName?: string;
  applicantEmail?: string;
  onTaskChange?: (taskName: string, completed: boolean) => void;
}

export function StageFinalSelectionDisplay({ data }: StageFinalSelectionDisplayProps) {

  const getResultBadge = (result?: string) => {
    switch (result) {
      case '合格':
        return <Badge className="bg-green-100 text-green-800">合格</Badge>;
      case '不合格':
        return <Badge className="bg-red-100 text-red-800">不合格</Badge>;
      case '保留':
        return <Badge className="bg-yellow-100 text-yellow-800">保留</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">未定</Badge>;
    }
  };

  const getResultIcon = (result?: string) => {
    switch (result) {
      case '合格':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case '不合格':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case '保留':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 
        ========================================
        最終選考段階のタスク設定
        ========================================
        以下のタスクを各選考段階に応じて設定してください：
        
        - 詳細連絡
        - 提出書類回収
        - 結果連絡
        ========================================
      */}
      
      {/* 候補日程（データがある場合のみ表示） */}
      {data && data.candidateDates && data.candidateDates.length > 0 && (
        <div className="space-y-4">
          <h5 className="font-medium">候補日程</h5>
          <div className="space-y-2">
            {data.candidateDates.map((date: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {format(new Date(date), 'PPP', { locale: ja })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 合否（データがある場合のみ表示） */}
      {data && data.result && data.resultDate && (
        <div className="space-y-4">
          <h5 className="font-medium">合否</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              {getResultIcon(data.result)}
              <div>
                <h6 className="font-medium">選考結果</h6>
                <div className="mt-1">
                  {getResultBadge(data.result)}
                </div>
              </div>
            </div>
            
            <div>
              <h6 className="font-medium">結果確定日</h6>
              <p className="text-sm text-muted-foreground">
                {data.resultDate ? format(new Date(data.resultDate), 'PPP', { locale: ja }) : '未設定'}
              </p>
            </div>
          </div>

          {data.evaluator && (
            <div>
              <h6 className="font-medium">選考担当者</h6>
              <p className="text-sm text-muted-foreground">{data.evaluator}</p>
            </div>
          )}

          {data.comments && (
            <div>
              <h6 className="font-medium">選考コメント</h6>
              <p className="text-sm text-muted-foreground mt-1">{data.comments}</p>
            </div>
          )}

          {data.notes && (
            <div>
              <h6 className="font-medium">備考</h6>
              <p className="text-sm text-muted-foreground mt-1">{data.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* タスクはSelectionStageAccordionで統合管理されるため、ここでは表示しない */}
    </div>
  );
} 