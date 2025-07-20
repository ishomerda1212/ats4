import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface StageDocumentScreeningDisplayProps {
  data?: {
    result?: '合格' | '不合格' | '保留';
    resultDate?: string;
    evaluator?: string;
    evaluationNotes?: string;
    notes?: string;
    tasks?: {
      detailedContact?: { completed: boolean; completedAt?: string };
      resultNotification?: { completed: boolean; completedAt?: string };
    };
  };
  onTaskChange?: (taskName: string, completed: boolean) => void;
}

export function StageDocumentScreeningDisplay({ data, onTaskChange }: StageDocumentScreeningDisplayProps) {
  const [tasks, setTasks] = useState(data?.tasks || {
    detailedContact: { completed: false },
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
        return <Badge variant="default" className="bg-green-100 text-green-800">合格</Badge>;
      case '不合格':
        return <Badge variant="destructive">不合格</Badge>;
      case '保留':
        return <Badge variant="secondary">保留</Badge>;
      default:
        return <Badge variant="outline">未定</Badge>;
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
        書類選考段階のタスク設定
        ========================================
        以下のタスクを各選考段階に応じて設定してください：
        
        - 詳細連絡
        - 結果連絡
        ========================================
      */}
      
      {/* 合否情報（データがある場合のみ表示） */}
      {data && (data.result || data.resultDate || data.evaluator) && (
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

          {data.evaluationNotes && (
            <div>
              <h6 className="font-medium">選考コメント</h6>
              <p className="text-sm text-muted-foreground mt-1">{data.evaluationNotes}</p>
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
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 