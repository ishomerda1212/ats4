import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, CheckCircle, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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

export function StageIndividualInterviewDisplay({ data, onTaskChange }: StageIndividualInterviewDisplayProps) {
  const [tasks, setTasks] = useState(data?.tasks || {
    detailedContact: { completed: false }
  });

  const handleTaskChange = (taskName: string, checked: boolean) => {
    const newTasks = { ...tasks };
    const taskKey = taskName as keyof typeof tasks;
    
    newTasks[taskKey] = {
      completed: checked,
      completedAt: checked ? new Date().toISOString() : undefined
    };
    
    setTasks(newTasks);
    onTaskChange?.(taskName, checked);
  };

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

      {/* タスク（常に表示） */}
      <div>
        <h5 className="font-medium mb-3">タスク</h5>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="detailedContact"
                checked={tasks.detailedContact?.completed || false}
                onCheckedChange={(checked: boolean | 'indeterminate') => handleTaskChange('detailedContact', checked === true)}
              />
              <div className="flex-1">
                <label htmlFor="detailedContact" className="text-sm font-medium">
                  詳細連絡
                </label>
                {tasks.detailedContact?.completed && tasks.detailedContact?.completedAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    完了日: {format(new Date(tasks.detailedContact.completedAt), 'PPP', { locale: ja })}
                  </p>
                )}
              </div>
              {tasks.detailedContact?.completed && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
            <Link to={`/applicants/${data?.applicantId}/mail?stage=個別面接&historyId=${data?.id || ''}`}>
              <Button variant="outline" size="sm">メール送信</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 