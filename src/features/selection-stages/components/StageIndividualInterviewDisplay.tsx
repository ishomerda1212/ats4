import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export interface IndividualInterviewStageData {
  id?: string;
  applicantId?: string;
  interviewDate?: string;
  interviewTime?: string;
  attendanceStatus?: string;
  location?: string;
  interviewer?: string;
  impression?: string;
  notes?: string;
  tasks?: {
    detailedContact?: { completed: boolean; completedAt?: string };
  };
}

export interface StageIndividualInterviewDisplayProps {
  data?: IndividualInterviewStageData;
  applicantId?: string;
  applicantName?: string;
  applicantEmail?: string;
  onTaskChange?: (taskName: string, completed: boolean) => void;
}

export function StageIndividualInterviewDisplay({ data }: StageIndividualInterviewDisplayProps) {

  const getAttendanceStatusBadge = (status?: string) => {
    switch (status) {
      case '参加':
        return <Badge className="bg-green-100 text-green-800">参加</Badge>;
      case '欠席':
        return <Badge className="bg-red-100 text-red-800">欠席</Badge>;
      case '遅刻':
        return <Badge className="bg-yellow-100 text-yellow-800">遅刻</Badge>;
      case '早退':
        return <Badge className="bg-purple-100 text-purple-800">早退</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">未定</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* 
        ========================================
        個別面談段階のタスク設定
        ========================================
        以下のタスクを各選考段階に応じて設定してください：
        
        - 詳細連絡
        ========================================
      */}
      
      {/* 面談情報（データがある場合のみ表示） */}
      {data && (data.interviewDate || data.interviewTime || data.attendanceStatus) && (
        <div className="space-y-4">
          <h5 className="font-medium">面談情報</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <h6 className="font-medium">面談日時</h6>
                <p className="text-sm text-muted-foreground">
                  {data.interviewDate ? format(new Date(data.interviewDate), 'PPP', { locale: ja }) : '未設定'}
                  {data.interviewTime && ` ${data.interviewTime}`}
                </p>
              </div>
            </div>
            
            <div>
              <h6 className="font-medium">参加実績</h6>
              <div className="mt-1">
                {getAttendanceStatusBadge(data.attendanceStatus)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <h6 className="font-medium">場所</h6>
                <p className="text-sm text-muted-foreground">{data.location || '未設定'}</p>
              </div>
            </div>
            
            <div>
              <h6 className="font-medium">面談官</h6>
              <p className="text-sm text-muted-foreground">{data.interviewer || '未設定'}</p>
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