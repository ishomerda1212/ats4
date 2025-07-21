import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, CheckCircle, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export interface StageWorkplaceVisitDisplayProps {
  data?: any;
  applicantId?: string;
  applicantName?: string;
  applicantEmail?: string;
  onTaskChange?: (taskName: string, completed: boolean) => void;
}

export function StageWorkplaceVisitDisplay({ data, onTaskChange }: StageWorkplaceVisitDisplayProps) {
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
        return <Badge variant="default">参加</Badge>;
      case '欠席':
        return <Badge variant="destructive">欠席</Badge>;
      case '遅刻':
        return <Badge variant="secondary">遅刻</Badge>;
      case '早退':
        return <Badge variant="secondary">早退</Badge>;
      default:
        return <Badge variant="outline">未定</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* 
        ========================================
        仕事体験段階のタスク設定
        ========================================
        以下のタスクを各選考段階に応じて設定してください：
        
        - 詳細連絡
        ========================================
      */}
      
      {/* セッション情報（参加実績）（データがある場合のみ表示） */}
      {data && (data.sessionDate || data.sessionName || data.eventName || data.attendanceStatus) && (
        <div className="space-y-4">
          <h5 className="font-medium">セッション情報（参加実績）</h5>
          
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
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <h6 className="font-medium">場所</h6>
                <p className="text-sm text-muted-foreground">{data.location || '未設定'}</p>
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
            <Link to={`/applicants/${data?.applicantId}/mail?stage=職場見学&historyId=${data?.id || ''}`}>
              <Button variant="outline" size="sm">メール送信</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 