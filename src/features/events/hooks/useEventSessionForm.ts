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
      startDateTime: session.startDateTime.slice(0, 16), // datetime-local format
      endDateTime: session.endDateTime.slice(0, 16),
      venue: session.venue,
      notes: session.notes || '',
    } : {
      startDateTime: '',
      endDateTime: '',
      venue: '',
      notes: '',
    },
  });

  const onSubmit = async (data: EventSessionFormData) => {
    setLoading(true);
    try {
      if (mode === 'create') {
        const newSession: EventSession = {
          id: generateId(),
          eventId,
          startDateTime: new Date(data.startDateTime).toISOString(),
          endDateTime: new Date(data.endDateTime).toISOString(),
          venue: data.venue,
          notes: data.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setEventSessions(current => [...current, newSession]);
        
        toast({
          title: "日時を追加しました",
          description: "新しい開催日時が正常に追加されました。",
        });
      } else if (session) {
        const updatedSession: EventSession = {
          ...session,
          startDateTime: new Date(data.startDateTime).toISOString(),
          endDateTime: new Date(data.endDateTime).toISOString(),
          venue: data.venue,
          notes: data.notes,
          updatedAt: new Date().toISOString(),
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
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "日時の保存に失敗しました。",
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