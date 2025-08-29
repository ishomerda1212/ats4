import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Plus, Calendar, Clock, MapPin, Users, Eye, CalendarPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { EventReservationForm, ReservationFormData } from '../components/EventReservationForm';
import { useEvents } from '../hooks/useEvents';
import { formatDateTime } from '@/shared/utils/date';
import { useApplicants } from '@/features/applicants/hooks/useApplicants';
import { SessionListCard } from '@/shared/components/common/SessionListCard';

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
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [sessionTab, setSessionTab] = useState('upcoming');

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

  const filteredEvents = events;

  // すべてのセッションを取得（開始日時でソート）
  const allSessions = events.flatMap(event => {
    const sessions = getEventSessions(event.id);
    return sessions.map(session => ({
      ...session,
      eventName: event.name,
      eventId: event.id,
      currentParticipants: getParticipantsBySession(session.id).length
    }));
  }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  // セッションを分類
  const { upcomingSessions, pastSessions } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const upcoming = allSessions.filter(session => new Date(session.start) >= today);
    const past = allSessions.filter(session => new Date(session.start) < today);
    
    return { upcomingSessions: upcoming, pastSessions: past };
  }, [allSessions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">選考段階管理</h1>
          <p className="text-muted-foreground mt-1">採用選考段階の管理を行います</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowReservationForm(true)}
          >
            <CalendarPlus className="h-4 w-4 mr-2" />
            選考段階予約
          </Button>
        </div>
      </div>



      {/* イベント一覧セクション */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">選考段階一覧</h2>
          <span className="text-sm text-muted-foreground">
            {filteredEvents.length}件の選考段階
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
                選考段階がありません。
              </p>
            </CardContent>
          </Card>
        ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

          <Tabs value={sessionTab} onValueChange={setSessionTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">
                今後のセッション ({upcomingSessions.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                過去のセッション ({pastSessions.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                すべて ({allSessions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-4">
              {upcomingSessions.length > 0 ? (
                <SessionListCard 
                  sessions={upcomingSessions}
                  layout="list"
                />
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">今後のセッションはありません</p>
                  <p className="text-muted-foreground">新しいセッションを作成してください</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-4">
              {pastSessions.length > 0 ? (
                <SessionListCard 
                  sessions={pastSessions}
                  layout="list"
                />
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">過去のセッションはありません</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-4">
              <SessionListCard 
                sessions={allSessions}
                layout="list"
              />
            </TabsContent>
          </Tabs>
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