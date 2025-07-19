import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save, X, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EmailTemplate } from '../types/task';
import { useTasks } from '../hooks/useTasks';
import { SELECTION_STAGES } from '@/shared/utils/constants';

const emailTemplateSchema = z.object({
  name: z.string().min(1, 'テンプレート名を入力してください'),
  subject: z.string().min(1, '件名を入力してください'),
  body: z.string().min(1, '本文を入力してください'),
  stage: z.string().min(1, '選考段階を選択してください'),
  isDefault: z.boolean(),
});

type EmailTemplateFormData = z.infer<typeof emailTemplateSchema>;

interface EmailTemplateFormProps {
  template?: EmailTemplate;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EmailTemplateForm({ template, onCancel, onSuccess }: EmailTemplateFormProps) {
  const { addEmailTemplate, updateEmailTemplate } = useTasks();

  const form = useForm<EmailTemplateFormData>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: template ? {
      name: template.name,
      subject: template.subject,
      body: template.body,
      stage: template.stage,
      isDefault: template.isDefault,
    } : {
      name: '',
      subject: '',
      body: '',
      stage: '',
      isDefault: false,
    },
  });

  const onSubmit = async (data: EmailTemplateFormData) => {
    try {
      const templateData = {
        ...data,
        variables: extractVariables(data.subject + ' ' + data.body),
      };

      if (template) {
        updateEmailTemplate(template.id, templateData);
      } else {
        addEmailTemplate(templateData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving email template:', error);
    }
  };

  // テンプレートから変数を抽出
  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{\{([^}]+)\}\}/g);
    if (!matches) return [];
    return [...new Set(matches.map(match => match.replace(/[{}]/g, '')))];
  };

  const commonVariables = [
    'applicantName', 'companyName', 'senderName', 'eventDate', 
    'venue', 'contactInfo', 'interviewDates', 'duration'
  ];

  const insertVariable = (variable: string) => {
    const currentBody = form.getValues('body');
    form.setValue('body', currentBody + `{{${variable}}}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{template ? 'メールテンプレート編集' : '新規メールテンプレート作成'}</CardTitle>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>テンプレート名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 会社説明会参加確認" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>選考段階 *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選考段階を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SELECTION_STAGES.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
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
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>件名 *</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 【{{companyName}}】会社説明会のご案内" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>本文 *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="メール本文を入力してください。{{applicantName}}などの変数を使用できます。" 
                      className="min-h-[200px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 変数挿入ボタン */}
            <div className="space-y-2">
              <Label>よく使う変数</Label>
              <div className="flex flex-wrap gap-2">
                {commonVariables.map((variable) => (
                  <Button
                    key={variable}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {`{{${variable}}}`}
                  </Button>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label>デフォルトテンプレートに設定</Label>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                キャンセル
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {template ? '更新' : '作成'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}