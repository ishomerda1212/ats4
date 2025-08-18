import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { TaskStatus, TaskType } from '@/features/tasks/types/task';
import { getTaskStatusIcon } from '../utils/stageHelpers';

interface TaskEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  taskStatus: TaskStatus;
  taskType?: TaskType; // タスクタイプを追加
  dueDate: string;
  notes: string;
  onTaskStatusChange: (status: TaskStatus) => void;
  onDueDateChange: (date: string) => void;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
}

export function TaskEditDialog({
  isOpen,
  onOpenChange,
  taskStatus,
  taskType,
  dueDate,
  notes,
  onTaskStatusChange,
  onDueDateChange,
  onNotesChange,
  onSave
}: TaskEditDialogProps) {
  // アプローチタスクかどうかを判定
  const isApproachTask = taskType && ['アプローチ1', 'アプローチ2', 'アプローチ3', 'アプローチ4', 'アプローチ5'].includes(taskType);
  
  // アプローチタスクの場合は「未着手」と「完了」のみ、それ以外はすべてのステータスを表示
  const availableStatuses: TaskStatus[] = isApproachTask 
    ? ['未着手', '完了']
    : ['未着手', '返信待ち', '提出待ち', '完了'];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="task-dialog-description">
        <DialogHeader>
          <DialogTitle>タスク編集</DialogTitle>
        </DialogHeader>
        <div id="task-dialog-description" className="sr-only">
          タスクの詳細情報を編集するダイアログです。ステータス、期限、メモを設定できます。
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="taskStatus">タスクステータス</Label>
            <Select 
              value={taskStatus} 
              onValueChange={(value: TaskStatus) => onTaskStatusChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="ステータスを選択してください" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    <div className="flex items-center space-x-2">
                      {getTaskStatusIcon(status)}
                      <span>{status}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dueDate">期限</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="notes">メモ</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="タスクに関するメモを入力"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
