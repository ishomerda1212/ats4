import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvaluationForm } from '../hooks/useEvaluationForm';
import { EVALUATION_FIELDS } from '../types/evaluation';

interface EvaluationFormProps {
  applicantId: string;
  selectionHistoryId: string;
}

export function EvaluationForm({ applicantId, selectionHistoryId }: EvaluationFormProps) {
  const { form, onSubmit, loading } = useEvaluationForm(applicantId, selectionHistoryId);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>評定表入力</CardTitle>
          <Link to={`/applicants/${applicantId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="evaluatorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>評価者名 *</FormLabel>
                  <FormControl>
                    <Input placeholder="評価者の氏名を入力してください" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {EVALUATION_FIELDS.map((fieldConfig) => (
              <FormField
                key={fieldConfig.key}
                control={form.control}
                name={fieldConfig.key as keyof typeof form.control._defaultValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldConfig.label} *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={fieldConfig.placeholder}
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link to={`/applicants/${applicantId}`}>
                <Button type="button" variant="outline">
                  キャンセル
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? '保存中...' : '評定表を保存'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}