import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DefaultTask } from '../types/selectionStage';
import { useSelectionStages } from '../hooks/useSelectionStages';
import { TASK_TYPES, TASK_PRIORITIES } from '@/features/tasks/types/task';
import { useTasks } from '@/features/tasks/hooks/useTasks';

const defaultTaskSchema = z.object({
  title: z.string().min(1, 'タスク名を入力してください'),
  description: z.string().min(1, '説明を入力してください'),
  type: z.string().min(1, 'タスクタイプを選択してください'),
  priority: z.string().min(1, '優先度を選択してください'),
  assignee: z.string().optional(),
  dueOffsetDays: z.number().optional(),
  isRequired: z.boolean(),
  emailTemplateId: z.string().optional(),
});

type DefaultTaskFormData = z.infer<typeof defaultTaskSchema>;

interface DefaultTaskFormProps {
  stageId: string;
  task?: DefaultTask;
  onCancel: () => void;
  onSuccess: () => void;
}

export function DefaultTaskForm({ stageId, task, onCancel, onSuccess }: DefaultTaskFormProps) {
  const { addDefaultTask, updateDefaultTask } = useSelectionStages();
  const { emailTemplates } = useTasks();

  const form = useForm<DefaultTaskFormData>({
    resolver: zodResolver(defaultTaskSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      type: task.type,
      priority: task.priority,
      assignee: task.assignee || '',
      dueOffsetDays: task.dueOffsetDays || 0,
      isRequired: task.isRequired,
      emailTemplateId: task.emailTemplateId || '',
    } : {
      title: '',
      description: '',
      type: 'general',
      priority: '中',
      assignee: '',
      dueOffsetDays: 1,
      isRequired: false,
      emailTemplateId: '',
    },
  });

  const selectedTaskType = form.watch('type');

  const onSubmit = async (data: DefaultTaskFormData) => {
    try {
      if (task) {
        updateDefaultTask(stageId, task.id, {
          ...data,
          type: data.type as TaskType,
          priority: data.priority as TaskPriority,
        });
      } else {
        addDefaultTask(stageId, {
          ...data,
          type: data.type as TaskType,
          priority: data.priority as TaskPriority,
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving default task:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{task ? 'デフォルトタスク編集' : '新規デフォルトタスク追加'}</CardTitle>
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

            {selectedTaskType === 'email' && (
              <FormField
                control={form.control}
                name="emailTemplateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールテンプレート</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="テンプレートを選択（任意）" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {emailTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assignee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>デフォルト担当者</FormLabel>
                    <FormControl>
                      <Input placeholder="担当者名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueOffsetDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>期限（段階開始からの日数）</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isRequired"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label>必須タスク</Label>
                </FormItem>
              )}
            />

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