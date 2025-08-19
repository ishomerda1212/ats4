import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EventSession } from '../types/event';
import { supabase } from '@/lib/supabase';
import { generateId } from '@/shared/utils/date';
import { toast } from '@/hooks/use-toast';

const eventSessionSchema = z.object({
  startDateTime: z.string().min(1, '開始日時を入力してください'),
  endDateTime: z.string().min(1, '終了日時を入力してください'),
  venue: z.string().min(1, '会場を入力してください'),
  format: z.enum(['対面', 'オンライン', 'ハイブリッド']),
  zoomUrl: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  const start = new Date(data.startDateTime);
  const end = new Date(data.endDateTime);
  return end > start;
}, {
  message: "終了日時は開始日時より後に設定してください",
  path: ["endDateTime"],
});

type EventSessionFormData = z.infer<typeof eventSessionSchema>;

export function useEventSessionForm(
  eventId: string,
  eventName: string, // イベント名を追加
  session?: EventSession,
  mode: 'create' | 'edit' = 'create',
  onSuccess?: () => void
) {
  const [loading, setLoading] = useState(false);

  const form = useForm<EventSessionFormData>({
    resolver: zodResolver(eventSessionSchema),
    defaultValues: session ? {
      startDateTime: session.start.toISOString().slice(0, 16), // datetime-local format
      endDateTime: session.end.toISOString().slice(0, 16),
      venue: session.venue,
      format: session.format,
      zoomUrl: session.zoomUrl || '',
      notes: session.notes || '',
    } : {
      startDateTime: '',
      endDateTime: '',
      venue: '',
      format: '対面',
      zoomUrl: '',
      notes: '',
    },
  });

  const onSubmit = async (data: EventSessionFormData) => {
    setLoading(true);
    try {
      if (mode === 'create') {
        // 新しいセッションを作成
        const { error } = await supabase
          .from('event_sessions')
          .insert({
            id: crypto.randomUUID(),
            event_id: eventId,
            name: eventName, // イベント名を使用
            start_time: data.startDateTime,
            end_time: data.endDateTime,
            venue: data.venue,
            format: data.format,
            zoom_url: data.zoomUrl || null,
            notes: data.notes || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Failed to create session:', error);
          throw error;
        }
        
        toast({
          title: "日時を追加しました",
          description: "新しい開催日時が正常に追加されました。",
        });
      } else if (session) {
        // 既存のセッションを更新
        const { error } = await supabase
          .from('event_sessions')
          .update({
            name: eventName, // イベント名を使用
            start_time: data.startDateTime,
            end_time: data.endDateTime,
            venue: data.venue,
            format: data.format,
            zoom_url: data.zoomUrl || null,
            notes: data.notes || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', session.id);

        if (error) {
          console.error('Failed to update session:', error);
          throw error;
        }
        
        toast({
          title: "日時を更新しました",
          description: "開催日時が正常に更新されました。",
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Session save error:', error);
      toast({
        title: "エラー",
        description: "セッションの保存に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    loading,
  };
}