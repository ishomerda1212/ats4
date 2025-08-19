import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X, Clock } from 'lucide-react';
import { useEventSessionForm } from '../hooks/useEventSessionForm';
import { EventSession } from '../types/event';
import { useState, useEffect } from 'react';

// 30分単位の時間オプションを生成
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(timeString);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

interface EventSessionFormProps {
  eventId: string;
  eventName: string; // イベント名を追加
  session?: EventSession;
  mode: 'create' | 'edit';
  onCancel: () => void;
  onSuccess: () => void;
}

export function EventSessionForm({ eventId, eventName, session, mode, onCancel, onSuccess }: EventSessionFormProps) {
  const { form, onSubmit, loading } = useEventSessionForm(eventId, eventName, session, mode, onSuccess);
  
  // 日付と時間の状態管理
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('10:00');

  // 初期値の設定
  useEffect(() => {
    if (session) {
      // 編集モードの場合、既存のセッションから値を設定
      const start = new Date(session.start);
      const end = new Date(session.end);
      
      setStartDate(start.toISOString().split('T')[0]);
      setStartTime(`${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`);
      setEndDate(end.toISOString().split('T')[0]);
      setEndTime(`${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`);
    } else {
      // 新規作成モードの場合、現在時刻を30分単位に丸めて設定
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${Math.floor(now.getMinutes() / 30) * 30 === 0 ? '00' : '30'}`;
      
      setStartDate(today);
      setStartTime(currentTime);
      setEndDate(today);
      
      // 1時間後の時間を計算
      const endHour = (now.getHours() + 1) % 24;
      const endTimeStr = `${endHour.toString().padStart(2, '0')}:${Math.floor(now.getMinutes() / 30) * 30 === 0 ? '00' : '30'}`;
      setEndTime(endTimeStr);
    }
  }, [session]);

  // フォームの値が変更されたときにdatetime-localの値を更新
  useEffect(() => {
    if (startDate && startTime) {
      form.setValue('startDateTime', `${startDate}T${startTime}`);
    }
  }, [startDate, startTime, form]);

  useEffect(() => {
    if (endDate && endTime) {
      form.setValue('endDateTime', `${endDate}T${endTime}`);
    }
  }, [endDate, endTime, form]);

  // 開始日時が変更されたときに終了日時を自動調整
  useEffect(() => {
    if (startDate && startTime && !session) {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1時間後
      
      const endDateStr = endDateTime.toISOString().split('T')[0];
      const endTimeStr = `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`;
      
      setEndDate(endDateStr);
      setEndTime(endTimeStr);
    }
  }, [startDate, startTime, session]);

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
              {/* 開始日時 */}
              <div>
                <FormLabel>開始日時 *</FormLabel>
                <div className="flex space-x-2">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map(time => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{time}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  開始日時を選択してください（時間は30分単位）
                </p>
              </div>

              {/* 終了日時 */}
              <div>
                <FormLabel>終了日時 *</FormLabel>
                <div className="flex space-x-2">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map(time => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{time}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  終了日時を選択してください（時間は30分単位）
                </p>
              </div>
            </div>

            {/* 隠しフィールド - フォームバリデーション用 */}
            <FormField
              control={form.control}
              name="startDateTime"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDateTime"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
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