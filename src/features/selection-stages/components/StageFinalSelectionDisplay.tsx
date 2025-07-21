import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, CheckCircle, XCircle, Clock, FileText, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

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

export function StageFinalSelectionDisplay({ data, onTaskChange }: StageFinalSelectionDisplayProps) {
  const [tasks, setTasks] = useState(data?.tasks || {
    detailedContact: { completed: false },
    documentCollection: { completed: false },
    resultNotification: { completed: false }
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

      {/* タスク（常に表示） */}
      <div>
        <h5 className="font-medium mb-3">タスク</h5>
        <div className="space-y-3">
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

          <div className="flex items-center space-x-3">
            <Checkbox
              id="documentCollection"
              checked={tasks.documentCollection?.completed || false}
              onCheckedChange={(checked: boolean | 'indeterminate') => handleTaskChange('documentCollection', checked === true)}
            />
            <div className="flex-1">
              <label htmlFor="documentCollection" className="text-sm font-medium">
                提出書類回収
              </label>
              {tasks.documentCollection?.completed && tasks.documentCollection?.completedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  完了日: {format(new Date(tasks.documentCollection.completedAt), 'PPP', { locale: ja })}
                </p>
              )}
            </div>
            {tasks.documentCollection?.completed && (
              <FileText className="h-4 w-4 text-green-600" />
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="resultNotification"
              checked={tasks.resultNotification?.completed || false}
              onCheckedChange={(checked: boolean | 'indeterminate') => handleTaskChange('resultNotification', checked === true)}
            />
            <div className="flex-1">
              <label htmlFor="resultNotification" className="text-sm font-medium">
                結果連絡
              </label>
              {tasks.resultNotification?.completed && tasks.resultNotification?.completedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  完了日: {format(new Date(tasks.resultNotification.completedAt), 'PPP', { locale: ja })}
                </p>
              )}
            </div>
            {tasks.resultNotification?.completed && (
              <Send className="h-4 w-4 text-green-600" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 