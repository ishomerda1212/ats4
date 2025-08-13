import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEventForm } from '../hooks/useEventForm';
import { SELECTION_STAGES } from '@/shared/utils/constants';
import { Event } from '../types/event';

interface EventFormProps {
  event?: Event;
  mode: 'create' | 'edit';
}

export function EventForm({ event, mode }: EventFormProps) {
  const { form, onSubmit, loading } = useEventForm(event, mode);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {mode === 'create' ? '新規イベント作成' : 'イベント編集'}
          </CardTitle>
          <Link to="/events">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              一覧に戻る
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>イベント名 *</FormLabel>
                  <FormControl>
                    <Input placeholder="会社説明会" {...field} />
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明 *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="イベントの詳細説明を入力してください" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>開催場所 *</FormLabel>
                  <FormControl>
                    <Input placeholder="本社オフィス" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最大参加者数 *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="50" 
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ステータス *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ステータスを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="予定">予定</SelectItem>
                        <SelectItem value="開催中">開催中</SelectItem>
                        <SelectItem value="終了">終了</SelectItem>
                        <SelectItem value="キャンセル">キャンセル</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link to="/events">
                <Button type="button" variant="outline">
                  キャンセル
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? '保存中...' : mode === 'create' ? '作成' : '更新'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}