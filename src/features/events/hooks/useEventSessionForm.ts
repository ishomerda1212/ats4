import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EventSession } from '../types/event';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { mockEventSessions } from '@/shared/data/mockEventData';
import { generateId } from '@/shared/utils/date';
import { toast } from '@/hooks/use-toast';

const eventSessionSchema = z.object({
  startDateTime: z.string().min(1, '開始日時を入力してください'),
  endDateTime: z.string().min(1, '終了日時を入力してください'),
  venue: z.string().min(1, '会場を入力してください'),
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
  session?: EventSession,
  mode: 'create' | 'edit' = 'create',
  onSuccess?: () => void
) {
  const [, setEventSessions] = useLocalStorage<EventSession[]>('eventSessions', mockEventSessions);
  const [loading, setLoading] = useState(false);

  const form = useForm<EventSessionFormData>({
    resolver: zodResolver(eventSessionSchema),
    defaultValues: session ? {
      startDateTime: session.start.toISOString().slice(0, 16), // datetime-local format
      endDateTime: session.end.toISOString().slice(0, 16),
      venue: session.venue,
    } : {
      startDateTime: '',
      endDateTime: '',
      venue: '',
    },
  });

  const onSubmit = async (data: EventSessionFormData) => {
    setLoading(true);
    try {
      if (mode === 'create') {
        const newSession: EventSession = {
          id: generateId(),
          eventId,
          name: `セッション ${Date.now()}`,
          start: new Date(data.startDateTime),
          end: new Date(data.endDateTime),
          venue: data.venue,
          participants: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setEventSessions(current => [...current, newSession]);
        
        toast({
          title: "日時を追加しました",
          description: "新しい開催日時が正常に追加されました。",
        });
      } else if (session) {
        const updatedSession: EventSession = {
          ...session,
          start: new Date(data.startDateTime),
          end: new Date(data.endDateTime),
          venue: data.venue,
          updatedAt: new Date(),
        };
        setEventSessions(current => 
          current.map(s => s.id === session.id ? updatedSession : s)
        );
        
        toast({
          title: "日時を更新しました",
          description: "開催日時が正常に更新されました。",
        });
      }

      onSuccess?.();
    } catch {
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