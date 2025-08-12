import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Calendar, Clock, MapPin, Users, Eye, CalendarPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { EventReservationForm, ReservationFormData } from '../components/EventReservationForm';
import { useEvents } from '../hooks/useEvents';
import { formatDateTime } from '@/shared/utils/date';
import { useApplicants } from '@/features/applicants/hooks/useApplicants';

export function EventListPage() {
  const { 
    events, 
    loading,
    getEventSessions,
    getParticipantsBySession,
    getEventParticipantCount,
    registerParticipant
  } = useEvents();

  const { applicants } = useApplicants();
  const [searchTerm, setSearchTerm] = useState('');
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);

  const handleReservationSubmit = async (formData: ReservationFormData) => {
    setReservationLoading(true);
    try {
      // 1. イベント参加者として登録
      registerParticipant({
        sessionId: formData.selectedSessionId,
        applicantId: formData.selectedApplicantId,
        status: '申込'
      });

      // 2. フォームを閉じる
      setShowReservationForm(false);
      
      // 3. 成功メッセージを表示
      alert('予約が完了しました！');
    } catch (error) {
      console.error('予約エラー:', error);
      alert('予約に失敗しました。もう一度お試しください。');
    } finally {
      setReservationLoading(false);
    }
  };

  const handleReservationCancel = () => {
    setShowReservationForm(false);
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // すべてのセッションを取得
  const allSessions = events.flatMap(event => {
    const sessions = getEventSessions(event.id);
    return sessions.map(session => ({
      ...session,
      eventName: event.name,
      eventId: event.id
    }));
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">イベント管理</h1>
          <p className="text-muted-foreground mt-1">採用イベントの管理を行います</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowReservationForm(true)}
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            イベント予約
          </Button>
          <Link to="/events/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新規イベント作成
            </Button>
          </Link>
        </div>
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

      {/* イベント一覧セクション */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">イベント一覧</h2>
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
            />
          ))}
        </div>
        )}
      </div>

      {/* セッション一覧セクション */}
      {allSessions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">セッション一覧</h2>
            <span className="text-sm text-muted-foreground">
              {allSessions.length}件のセッション
            </span>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-3 p-4">
                {allSessions.map((session) => {
                  const participantCount = getParticipantsBySession(session.id).length;
                  return (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-6 flex-1">
                        {/* イベント名 */}
                        <div className="flex items-center space-x-2 min-w-[200px]">
                          <span className="font-medium text-sm">{session.eventName}</span>
                        </div>
                        
                        {/* 日時 */}
                        <div className="flex items-center space-x-2 min-w-[180px]">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatDateTime(session.start)}</span>
                        </div>
                        
                        {/* 時間 */}
                        <div className="flex items-center space-x-2 min-w-[120px]">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formatDateTime(session.end)}
                          </span>
                        </div>
                        
                        {/* 場所 */}
                        <div className="flex items-center space-x-2 min-w-[150px]">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{session.venue}</span>
                        </div>
                        
                        {/* 参加者数 */}
                        <div className="flex items-center space-x-2 min-w-[80px]">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{participantCount}名</span>
                        </div>
                      </div>
                      
                      {/* アクションボタン */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Link to={`/event/${session.eventId}/session/${session.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            詳細
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 予約フォーム */}
      {showReservationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <EventReservationForm
              events={events}
              applicants={applicants}
              getEventSessions={getEventSessions}
              onSubmit={handleReservationSubmit}
              onCancel={handleReservationCancel}
              loading={reservationLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}