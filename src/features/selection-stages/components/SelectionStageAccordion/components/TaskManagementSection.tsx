import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Edit } from 'lucide-react';
import { formatDate } from '@/shared/utils/date';
import { getTaskStatusIcon, getTaskStatusColor } from '../utils/stageHelpers';
import { FixedTask, TaskInstance } from '@/features/tasks/types/task';

// FixedTaskとTaskInstanceを組み合わせた型
type TaskWithFixedData = FixedTask & TaskInstance;

interface TaskManagementSectionProps {
  stageTasks: TaskWithFixedData[];
  onEditTask: (task: TaskWithFixedData) => void;
}

export function TaskManagementSection({ 
  stageTasks, 
  onEditTask 
}: TaskManagementSectionProps) {
  if (stageTasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium flex items-center">
        <ClipboardList className="h-4 w-4 mr-2" />
        タスク
      </h4>
      {stageTasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-3">
            {getTaskStatusIcon(task.status)}
            <div className="flex-1">
              <h5 className="font-medium text-sm">{task.title}</h5>
              <p className="text-xs text-muted-foreground">{task.description}</p>
              <p className="text-xs text-muted-foreground">ステータス: {task.status}</p>
              {task.dueDate && (
                <p className="text-xs text-muted-foreground">
                  期限: {formatDate(task.dueDate)}
                </p>
              )}
              {task.notes && (
                <p className="text-xs text-muted-foreground">
                  メモ: {task.notes}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getTaskStatusColor(task.status)}>
              {task.status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditTask(task)}
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
