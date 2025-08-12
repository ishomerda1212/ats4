import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { TaskStatus } from '@/features/tasks/types/task';
import { getTaskStatusIcon } from '../utils/stageHelpers';

interface TaskEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  taskStatus: TaskStatus;
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
  dueDate,
  notes,
  onTaskStatusChange,
  onDueDateChange,
  onNotesChange,
  onSave
}: TaskEditDialogProps) {
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
                <SelectItem value="未着手">
                  <div className="flex items-center space-x-2">
                    {getTaskStatusIcon('未着手')}
                    <span>未着手</span>
                  </div>
                </SelectItem>
                <SelectItem value="返信待ち">
                  <div className="flex items-center space-x-2">
                    {getTaskStatusIcon('返信待ち')}
                    <span>返信待ち</span>
                  </div>
                </SelectItem>
                <SelectItem value="提出待ち">
                  <div className="flex items-center space-x-2">
                    {getTaskStatusIcon('提出待ち')}
                    <span>提出待ち</span>
                  </div>
                </SelectItem>
                <SelectItem value="完了">
                  <div className="flex items-center space-x-2">
                    {getTaskStatusIcon('完了')}
                    <span>完了</span>
                  </div>
                </SelectItem>
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
