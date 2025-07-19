import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { useEvents } from '../hooks/useEvents';
import { Event } from '../types/event';

export function EventListPage() {
  const {
    events,
    loading,
    getEventSessions,
    getEventParticipantCount,
    deleteEvent
  } = useEvents();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteEvent = (event: Event) => {
    if (window.confirm(`「${event.name}」を削除しますか？`)) {
      deleteEvent(event.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">イベント管理</h1>
          <p className="text-muted-foreground mt-1">採用イベントの管理を行います</p>
        </div>
        
        <Link to="/events/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新規イベント作成
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>検索・絞り込み</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="イベント名または説明で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {filteredEvents.length}件のイベント
        </span>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">読み込み中...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm ? '条件に一致するイベントが見つかりませんでした。' : 'イベントがありません。'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              participantCount={getEventParticipantCount(event.id)}
              sessionCount={getEventSessions(event.id).length}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
}