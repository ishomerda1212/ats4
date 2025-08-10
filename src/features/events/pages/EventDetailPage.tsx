import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit, Calendar, Users, ExternalLink, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventSessionCard } from '../components/EventSessionCard';
import { EventSessionForm } from '../components/EventSessionForm';
import { useEvents } from '../hooks/useEvents';
import { StatusBadge } from '@/shared/components/common/StatusBadge';
import { formatDate } from '@/shared/utils/date';
import { EventSession } from '../types/event';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { 
    events, 
    loading,
    getEventSessions,
    getParticipantsBySession
  } = useEvents();
  
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState<EventSession | null>(null);

  const event = events.find(e => e.id === id);
  const sessions = event ? getEventSessions(event.id) : [];

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
        <p className="text-muted-foreground">イベントが見つかりませんでした。</p>
        <Link to="/events">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddSession = () => {
    setEditingSession(null);
    setShowSessionForm(true);
  };

  const handleSessionFormSuccess = () => {
    setShowSessionForm(false);
    setEditingSession(null);
  };

  const handleSessionFormCancel = () => {
    setShowSessionForm(false);
    setEditingSession(null);
  };

  const totalParticipants = sessions.reduce((total, session) => {
    return total + getParticipantsBySession(session.id).length;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/events">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">イベント詳細</h1>
          <p className="text-muted-foreground mt-1">{event.name}</p>
        </div>
      </div>

      {/* イベント基本情報 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>基本情報</CardTitle>
            <Link to={`/events/${event.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                編集
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{event.name}</h2>
              <StatusBadge stage={event.stage} />
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gray-100 text-gray-800 flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{sessions.length}回開催</span>
              </Badge>
              <Badge className="bg-gray-100 text-gray-800 flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>総参加者{totalParticipants}名</span>
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">説明</h3>
            <p className="text-muted-foreground">{event.description}</p>
          </div>

          {/* サンプルフォームへのリンク */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium mb-2">応募者フォーム</h3>
                <p className="text-sm text-muted-foreground">
                  このイベントの応募者フォームのサンプルを確認できます
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Link to={`/applicant-form/sample/${event.id}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    サンプルフォームを確認
                  </Button>
                </Link>
                <Link to={`/applicant-response/sample/${event.id}`}>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    回答を確認
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>作成日: {formatDate(event.createdAt)}</span>
              <span>最終更新: {formatDate(event.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 日時一覧 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>開催日時 ({sessions.length}回)</CardTitle>
            <Button size="sm" onClick={handleAddSession}>
              <Plus className="h-4 w-4 mr-2" />
              日時追加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showSessionForm && (
            <div className="mb-4">
              <EventSessionForm
                eventId={event.id}
                session={editingSession || undefined}
                mode={editingSession ? 'edit' : 'create'}
                onCancel={handleSessionFormCancel}
                onSuccess={handleSessionFormSuccess}
              />
            </div>
          )}
          
          {sessions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              開催日時が設定されていません
            </p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <EventSessionCard
                  key={session.id}
                  session={session}
                  participantCount={getParticipantsBySession(session.id).length}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}