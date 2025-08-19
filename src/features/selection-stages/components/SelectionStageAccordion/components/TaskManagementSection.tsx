import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Calendar, Clock, Clipboard } from 'lucide-react';
import { formatDate } from '@/shared/utils/date';
import { getTaskStatusColor } from '../utils/stageHelpers';
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
        <Clipboard className="h-4 w-4 mr-2" />
        タスク
      </h4>
      {stageTasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-sm text-gray-900 truncate">{task.title}</h5>
              <div className="flex items-center space-x-2 ml-4">
                <Badge className={`${getTaskStatusColor(task.status)} text-xs`}>
                  {task.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditTask(task)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-1">{task.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {task.dueDate && (
                <span className="flex items-center">
                  <span className="mr-1">期限:</span>
                  <span className="font-medium">{formatDate(task.dueDate)}</span>
                </span>
              )}
              {task.notes && (
                <span className="flex items-center">
                  <span className="mr-1">メモ:</span>
                  <span className="truncate max-w-32">{task.notes}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
