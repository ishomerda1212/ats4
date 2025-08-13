import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Event } from '../types/event';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { mockEvents } from '@/shared/data/mockEventData';
import { generateId } from '@/shared/utils/date';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { SelectionStage } from '@/features/applicants/types/applicant';

const eventSchema = z.object({
  name: z.string().min(1, 'イベント名を入力してください'),
  stage: z.string().min(1, '選考段階を選択してください'),
  description: z.string().min(1, '説明を入力してください'),
  venue: z.string().min(1, '開催場所を入力してください'),
  maxParticipants: z.number().min(1, '最大参加者数を入力してください'),
  status: z.string().min(1, 'ステータスを選択してください'),
});

type EventFormData = z.infer<typeof eventSchema>;

export function useEventForm(event?: Event, mode: 'create' | 'edit' = 'create') {
  const [, setEvents] = useLocalStorage<Event[]>('events', mockEvents);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ? {
      name: event.name,
      stage: event.stage,
      description: event.description,
      venue: event.venue,
      maxParticipants: event.maxParticipants,
      status: event.status,
    } : {
      name: '',
      stage: '',
      description: '',
      venue: '',
      maxParticipants: 50,
      status: '予定',
    },
  });

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);
    try {
      if (mode === 'create') {
        const newEvent: Event = {
          id: generateId(),
          name: data.name,
          stage: data.stage as SelectionStage,
          description: data.description,
          venue: data.venue,
          maxParticipants: data.maxParticipants,
          status: data.status as '予定' | '開催中' | '終了' | 'キャンセル',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setEvents(current => [...current, newEvent]);
        
        toast({
          title: "イベントを作成しました",
          description: `${data.name}が正常に作成されました。`,
        });

        navigate('/events');
      } else if (event) {
        const updatedEvent: Event = {
          ...event,
          name: data.name,
          stage: data.stage as SelectionStage,
          description: data.description,
          venue: data.venue,
          maxParticipants: data.maxParticipants,
          status: data.status as '予定' | '開催中' | '終了' | 'キャンセル',
          updatedAt: new Date(),
        };
        setEvents(current => 
          current.map(e => e.id === event.id ? updatedEvent : e)
        );
        
        toast({
          title: "イベントを更新しました",
          description: `${data.name}が正常に更新されました。`,
        });

        navigate(`/event/${event.id}`);
      }
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