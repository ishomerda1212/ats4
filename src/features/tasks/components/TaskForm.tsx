import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task, TaskType, TaskPriority, TASK_TYPES, TASK_PRIORITIES } from '../types/task';
import { useTasks } from '../hooks/useTasks';
import { toast } from '@/hooks/use-toast';

const taskSchema = z.object({
  title: z.string().min(1, 'タスク名を入力してください'),
  description: z.string().min(1, '説明を入力してください'),
  type: z.string().min(1, 'タスクタイプを選択してください'),
  priority: z.string().min(1, '優先度を選択してください'),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  selectionHistoryId: string;
  task?: Task;
  onCancel: () => void;
  onSuccess: () => void;
}

export function TaskForm({ selectionHistoryId, task, onCancel, onSuccess }: TaskFormProps) {
  const { addTask, updateTask } = useTasks();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      type: task.type,
      priority: task.priority,
      assignee: task.assignee || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '', // datetime-local format
    } : {
      title: '',
      description: '',
      type: 'general',
      priority: '中',
      assignee: '',
      dueDate: '',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (task) {
        updateTask(task.id, {
          ...data,
          type: data.type as TaskType,
          priority: data.priority as TaskPriority,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        });
        toast({
          title: "タスクを更新しました",
          description: "タスクが正常に更新されました。",
        });
      } else {
        addTask({
          selectionHistoryId,
          applicantId: '', // 一時的に空文字列を設定
          ...data,
          type: data.type as TaskType,
          priority: data.priority as TaskPriority,
          status: '未着手',
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        });
        toast({
          title: "タスクを追加しました",
          description: "新しいタスクが正常に追加されました。",
        });
      }
      onSuccess();
    } catch {
      toast({
        title: "エラー",
        description: "タスクの保存に失敗しました。",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{task ? 'タスク編集' : '新規タスク追加'}</CardTitle>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タスク名 *</FormLabel>
                  <FormControl>
                    <Input placeholder="タスク名を入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>タスクタイプ *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="タイプを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>優先度 *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="優先度を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_PRIORITIES.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明 *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="タスクの詳細説明" 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>担当者</FormLabel>
                    <FormControl>
                      <Input placeholder="担当者名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>期限</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                キャンセル
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {task ? '更新' : '追加'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}