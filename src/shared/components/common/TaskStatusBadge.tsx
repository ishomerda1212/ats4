import { Badge } from '@/components/ui/badge';
import { TaskStatus } from '@/features/tasks/types/task';
import { cn } from '@/lib/utils';

const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  '未着手': 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300',
  '進行中': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  '完了': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
};

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  return (
    <Badge 
      className={cn(
        TASK_STATUS_COLORS[status],
        'font-medium text-xs',
        className
      )}
    >
      {status}
    </Badge>
  );
}