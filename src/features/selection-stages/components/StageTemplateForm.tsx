import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SelectionStageTemplate } from '../types/selectionStage';
import { useSelectionStages } from '../hooks/useSelectionStages';

const stageTemplateSchema = z.object({
  name: z.string().min(1, '段階名を入力してください'),
  description: z.string().min(1, '説明を入力してください'),
  order: z.number().min(1, '順序を入力してください'),
  isActive: z.boolean(),
  estimatedDuration: z.number().optional(),
});

type StageTemplateFormData = z.infer<typeof stageTemplateSchema>;

interface StageTemplateFormProps {
  template?: SelectionStageTemplate;
  onCancel: () => void;
  onSuccess: () => void;
}

export function StageTemplateForm({ template, onCancel, onSuccess }: StageTemplateFormProps) {
  const { addStageTemplate, updateStageTemplate } = useSelectionStages();

  const form = useForm<StageTemplateFormData>({
    resolver: zodResolver(stageTemplateSchema),
    defaultValues: template ? {
      name: template.name,
      description: template.description,
      order: template.order,
      isActive: template.isActive,
      estimatedDuration: template.estimatedDuration || 0,
    } : {
      name: '',
      description: '',
      order: 1,
      isActive: true,
      estimatedDuration: 7,
    },
  });

  const onSubmit = async (data: StageTemplateFormData) => {
    try {
      if (template) {
        updateStageTemplate(template.id, {
          ...data,
          defaultTasks: template.defaultTasks,
          emailTemplates: template.emailTemplates,
        });
      } else {
        addStageTemplate({
          ...data,
          defaultTasks: [],
          emailTemplates: [],
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving stage template:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{template ? '選考段階編集' : '新規選考段階追加'}</CardTitle>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>段階名 *</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 一次面接" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明 *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="この選考段階の詳細説明" 
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
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>順序 *</FormLabel>
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

              <FormField
                control={form.control}
                name="estimatedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>予想期間（日数）</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="7" 
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label>この段階を有効にする</Label>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                キャンセル
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {template ? '更新' : '追加'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}