import { useParams } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { EventForm } from '../components/EventForm';

export function EventEditPage() {
  const { id } = useParams<{ id: string }>();
  const { events, loading } = useEvents();

  const event = events.find(e => e.id === id);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">選考段階が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">選考段階編集</h1>
        <p className="text-muted-foreground mt-1">{event.name}の情報を編集します</p>
      </div>

      <EventForm event={event} mode="edit" />
    </div>
  );
}