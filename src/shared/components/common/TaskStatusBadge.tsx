import { Badge } from '@/components/ui/badge';
import { TaskStatus } from '@/features/tasks/types/task';
import { cn } from '@/lib/utils';

const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  '未着手': 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300',
  '完了': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  '提出待ち': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  '返信待ち': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
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