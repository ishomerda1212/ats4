import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { useEventSessionForm } from '../hooks/useEventSessionForm';
import { EventSession } from '../types/event';

interface EventSessionFormProps {
  eventId: string;
  session?: EventSession;
  mode: 'create' | 'edit';
  onCancel: () => void;
  onSuccess: () => void;
}

export function EventSessionForm({ eventId, session, mode, onCancel, onSuccess }: EventSessionFormProps) {
  const { form, onSubmit, loading } = useEventSessionForm(eventId, session, mode, onSuccess);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {mode === 'create' ? '新規日時追加' : '日時編集'}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>開始日時 *</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>終了日時 *</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>会場 *</FormLabel>
                  <FormControl>
                    <Input placeholder="本社会議室A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>開催形式 *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="開催形式を選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="対面">対面</SelectItem>
                      <SelectItem value="オンライン">オンライン</SelectItem>
                      <SelectItem value="ハイブリッド">ハイブリッド</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zoomUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZOOM URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://zoom.us/j/xxxxxxxxx" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備考</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="資料配布あり、動きやすい服装でお越しください など" 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                キャンセル
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? '保存中...' : mode === 'create' ? '追加' : '更新'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}