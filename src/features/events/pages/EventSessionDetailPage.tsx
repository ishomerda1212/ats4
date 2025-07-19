import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, MapPin, Users, FileText } from 'lucide-react';
import { EventSessionForm } from '../components/EventSessionForm';
import { ParticipantList } from '../components/ParticipantList';
import { useEvents } from '../hooks/useEvents';
import { useApplicants } from '@/features/applicants/hooks/useApplicants';
import { formatDateTime } from '@/shared/utils/date';
import { EventSession } from '../types/event';

export function EventSessionDetailPage() {
  const { eventId, sessionId } = useParams<{ eventId: string; sessionId: string }>();
  const {
    events,
    getEventSessions,
    getSessionParticipants,
    updateParticipantStatus,
    deleteEventSession,
    loading
  } = useEvents();
  
  const { applicants } = useApplicants();
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState<EventSession | null>(null);

  const event = events.find(e => e.id === eventId);
  const sessions = event ? getEventSessions(event.id) : [];
  const session = sessions.find(s => s.id === sessionId);
  const participants = session ? getSessionParticipants(session.id) : [];

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  if (!event || !session) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">セッションが見つかりませんでした。</p>
        <Link to={`/events/${eventId}`}>
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            イベント詳細に戻る
          </Button>
        </Link>
      </div>
    );
  }

  const handleDeleteSession = () => {
    if (window.confirm('このセッションを削除しますか？')) {
      deleteEventSession(session.id);
      // 削除後はイベント詳細ページに戻る
      window.location.href = `/events/${eventId}`;
    }
  };

  const handleEditSession = () => {
    setEditingSession(session);
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

  const handleStatusChange = (participantId: string, status: any) => {
    updateParticipantStatus(participantId, status);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to={`/events/${eventId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            イベント詳細に戻る
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">セッション詳細</h1>
          <p className="text-muted-foreground mt-1">{event.name}</p>
        </div>
      </div>

      {/* セッション基本情報 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>セッション情報</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleEditSession}>
                <Edit className="h-4 w-4 mr-2" />
                編集
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeleteSession}>
                <Trash2 className="h-4 w-4 mr-2" />
                削除
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">開始日時</h3>
                  <p className="text-muted-foreground">{formatDateTime(session.startDateTime)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">終了日時</h3>
                  <p className="text-muted-foreground">{formatDateTime(session.endDateTime)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">開催場所</h3>
                  <p className="text-muted-foreground">{session.venue}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">参加者数</h3>
                  <p className="text-muted-foreground">{participants.length}名</p>
                </div>
              </div>
            </div>
          </div>
          
          {session.notes && (
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">備考</h3>
              <p className="text-muted-foreground">{session.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 参加者一覧 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">参加者一覧 ({participants.length}名)</h2>
        <Link to={`/events/${eventId}/sessions/${sessionId}/participants`}>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            評定表管理
          </Button>
        </Link>
      </div>
      
      <ParticipantList
        participants={participants}
        applicants={applicants}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
} 