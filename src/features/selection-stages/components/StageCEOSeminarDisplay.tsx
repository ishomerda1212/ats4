import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export interface CEOSeminarStageData {
  sessionDate?: string;
  sessionName?: string;
  eventName?: string;
  reservationStatus?: string;
  attendanceStatus?: string;
  impression?: string;
  notes?: string;
  tasks?: {
    detailedContact?: { completed: boolean; completedAt?: string };
    reminder?: { completed: boolean; completedAt?: string };
  };
}

export interface StageCEOSeminarDisplayProps {
  data?: CEOSeminarStageData;
  applicantId?: string;
  applicantName?: string;
  applicantEmail?: string;
  onTaskChange?: (taskName: string, completed: boolean) => void;
}

export function StageCEOSeminarDisplay({ data }: StageCEOSeminarDisplayProps) {
  const getReservationStatusBadge = (status?: string) => {
    switch (status) {
      case '予約済み':
        return <Badge className="bg-blue-100 text-blue-800">予約済み</Badge>;
      case 'キャンセル':
        return <Badge className="bg-red-100 text-red-800">キャンセル</Badge>;
      case '待機中':
        return <Badge className="bg-gray-100 text-gray-800">待機中</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">未予約</Badge>;
    }
  };

  const getAttendanceStatusBadge = (status?: string) => {
    switch (status) {
      case '参加':
        return <Badge className="bg-green-100 text-green-800">参加</Badge>;
      case '欠席':
        return <Badge className="bg-red-100 text-red-800">欠席</Badge>;
      case '遅刻':
        return <Badge className="bg-yellow-100 text-yellow-800">遅刻</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">未定</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* 
        ========================================
        社長セミナー段階のタスク設定
        ========================================
        以下のタスクを各選考段階に応じて設定してください：
        
        - 詳細連絡
        - リマインド
        ========================================
      */}
      
      {/* セッション情報（データがある場合のみ表示） */}
      {data && (data.sessionDate || data.sessionName || data.eventName || data.reservationStatus) && (
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
              <h6 className="font-medium">予約状況</h6>
              <div className="mt-1">
                {getReservationStatusBadge(data.reservationStatus)}
              </div>
            </div>
            
            <div>
              <h6 className="font-medium">参加実績</h6>
              <div className="mt-1">
                {getAttendanceStatusBadge(data.attendanceStatus)}
              </div>
            </div>
          </div>

          {data.impression && (
            <div>
              <h6 className="font-medium">印象・感想</h6>
              <p className="text-sm text-muted-foreground mt-1">{data.impression}</p>
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