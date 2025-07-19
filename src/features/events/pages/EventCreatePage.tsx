import { EventForm } from '../components/EventForm';

export function EventCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">新規イベント作成</h1>
        <p className="text-muted-foreground mt-1">新しいイベントを作成します</p>
      </div>

      <EventForm mode="create" />
    </div>
  );
}