import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export interface AptitudeTestStageData {
  id?: string;
  applicantId?: string;
  sessionDate?: string;
  sessionName?: string;
  eventName?: string;
  testType?: string;
  score?: number;
  result?: string;
  notes?: string;
  tasks?: {
    detailedContact?: { completed: boolean; completedAt?: string };
  };
}

export interface StageAptitudeTestDisplayProps {
  data?: AptitudeTestStageData;
  applicantId?: string;
  applicantName?: string;
  applicantEmail?: string;
  onTaskChange?: (taskName: string, completed: boolean) => void;
}

export function StageAptitudeTestDisplay({ data }: StageAptitudeTestDisplayProps) {


  const getResultBadge = (result?: string) => {
    switch (result) {
      case '優秀':
        return <Badge className="bg-green-100 text-green-800">優秀</Badge>;
      case '良好':
        return <Badge className="bg-blue-100 text-blue-800">良好</Badge>;
      case '普通':
        return <Badge className="bg-gray-100 text-gray-800">普通</Badge>;
      case '不合格':
        return <Badge className="bg-red-100 text-red-800">不合格</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">未評価</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* 
        ========================================
        適性検査段階のタスク設定
        ========================================
        以下のタスクを各選考段階に応じて設定してください：
        
        - 詳細連絡
        ========================================
      */}
      
      {/* セッション情報（データがある場合のみ表示） */}
      {data && (data.sessionDate || data.sessionName || data.eventName || data.testType) && (
        <div className="space-y-4">
          <h5 className="font-medium">セッション情報</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <h6 className="font-medium">セッション日時</h6>
                <p className="text-sm text-muted-foreground">
                  {data.sessionDate ? format(new Date(data.sessionDate), 'PPP', { locale: ja }) : '未設定'}
                </p>
              </div>
            </div>
            
            <div>
              <h6 className="font-medium">イベント名</h6>
              <p className="text-sm text-muted-foreground">{data.eventName || '未設定'}</p>
            </div>
          </div>

          <div>
            <h6 className="font-medium">セッション名</h6>
            <p className="text-sm text-muted-foreground">{data.sessionName || '未設定'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h6 className="font-medium">検査種別</h6>
              <p className="text-sm text-muted-foreground">{data.testType || '未設定'}</p>
            </div>
            
            {data.score && (
              <div>
                <h6 className="font-medium">スコア</h6>
                <p className="text-sm text-muted-foreground">{data.score}点</p>
              </div>
            )}
          </div>

          {data.result && (
            <div>
              <h6 className="font-medium">結果</h6>
              <div className="mt-1">
                {getResultBadge(data.result)}
              </div>
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