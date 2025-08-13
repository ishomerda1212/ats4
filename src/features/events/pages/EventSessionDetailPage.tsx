import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, MapPin, Users, UserCheck, ClipboardList, Monitor, Video, ExternalLink } from 'lucide-react';
import { EventSessionForm } from '../components/EventSessionForm';
import { ParticipantList } from '../components/ParticipantList';
import { useEvents } from '../hooks/useEvents';
import { useApplicants } from '@/features/applicants/hooks/useApplicants';
import { formatDateTime, formatDate } from '@/shared/utils/date';
import { EventSession, ParticipationStatus } from '../types/event';

export function EventSessionDetailPage() {
  const params = useParams<{ id: string; sessionId: string }>();
  const [searchParams] = useSearchParams();
  const eventId = params.id; // URLパラメータは 'id' として定義されている
  const sessionId = params.sessionId;
  
  // URLパラメータから応募者情報を取得
  const fromApplicant = searchParams.get('fromApplicant');
  
  const {
    events,
    getEventSessions,
    getParticipantsBySession,
    updateParticipantStatus,
    deleteEventSession,
    updateEventSession,
    loading
  } = useEvents();
  
  const { applicants } = useApplicants();
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState<EventSession | null>(null);

  // URLパラメータのデバッグ
  console.log('URL Params Debug:', {
    params,
    eventId,
    sessionId,
    eventsFromHook: events.length
  });

  const event = events.find(e => e.id === eventId);
  const sessions = event ? getEventSessions(event.id) : [];
  const session = sessions.find(s => s.id === sessionId);
  const participants = session ? getParticipantsBySession(session.id) : [];

  // デバッグ情報
  console.log('EventSessionDetailPage Debug:', {
    eventId,
    sessionId,
    eventsCount: events.length,
    event,
    sessionsCount: sessions.length,
    session,
    participantsCount: participants.length,
    allSessions: sessions.map(s => ({ id: s.id, name: s.name })),
    allEvents: events.map(e => ({ id: e.id, name: e.name }))
  });

  // 参加者数のカウント
  const registrationCount = participants.filter(p => p.status === '申込').length;
  const participationCount = participants.filter(p => p.status === '参加').length;

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
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left max-w-md mx-auto">
          <h3 className="font-medium mb-2">デバッグ情報:</h3>
          <p className="text-sm">eventId: {eventId || '(空)'}</p>
          <p className="text-sm">sessionId: {sessionId || '(空)'}</p>
          <p className="text-sm">イベント数: {events.length}</p>
          <p className="text-sm">イベント: {event ? '見つかりました' : '見つかりません'}</p>
          <p className="text-sm">セッション数: {sessions.length}</p>
          <p className="text-sm">セッション: {session ? '見つかりました' : '見つかりません'}</p>
          <div className="mt-2 p-2 bg-white rounded text-xs">
            <p className="font-medium">解決方法:</p>
            <p>1. ブラウザのコンソールで以下を実行:</p>
            <code className="block bg-gray-200 p-1 rounded mt-1">window.debugUtils.forceLoadMockData()</code>
            <p className="mt-1">2. ページを再読み込み</p>
          </div>
        </div>
        <Link to={`/event/${eventId}`}>
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
              window.location.href = `/event/${eventId}`;
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

  const handleStatusChange = (participantId: string, status: ParticipationStatus) => {
    updateParticipantStatus(participantId, status);
  };

  const handleReportReminderChange = (checked: boolean) => {
    if (checked && !session.reportReminderDate) {
      updateEventSession(session.id, {
        reportReminderDate: new Date().toISOString()
      });
    }
  };

  const handleParticipantReportChange = (checked: boolean) => {
    if (checked && !session.participantReportDate) {
      updateEventSession(session.id, {
        participantReportDate: new Date().toISOString()
      });
    }
  };

  const handleRecruiterChange = (value: string) => {
    updateEventSession(session.id, {
      recruiter: value
    });
  };

  // Googleカレンダー登録用URLを生成
  const generateGoogleCalendarUrl = () => {
    // session.startとsession.endが文字列の場合はDateオブジェクトに変換
    const startDate = (session.start instanceof Date ? session.start : new Date(session.start)).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = (session.end instanceof Date ? session.end : new Date(session.end)).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: session.name,
      dates: `${startDate}/${endDate}`,
      details: `${session.notes || ''}\n\n会場: ${session.venue}\n開催形式: ${session.format}${session.zoomUrl ? `\nZOOM URL: ${session.zoomUrl}` : ''}`,
      location: session.venue,
    });

    return `https://www.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center space-x-4">
        {fromApplicant ? (
          <Link to={`/applicants/${fromApplicant}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              応募者詳細に戻る
            </Button>
          </Link>
        ) : (
          <Link to={`/event/${eventId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              イベント詳細に戻る
            </Button>
          </Link>
        )}
        <div>
          <h1 className="text-3xl font-bold">セッション詳細</h1>
          <p className="text-muted-foreground mt-1">{event.name}</p>
        </div>
      </div>

      {/* セッション情報と管理情報を横並びで表示 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* セッション情報 - 左側 */}
        <div className="lg:col-span-2">
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">開始日時</p>
                      <p className="text-sm text-muted-foreground">{formatDateTime(session.start)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">終了日時</p>
                      <p className="text-sm text-muted-foreground">{formatDateTime(session.end)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">開催場所</p>
                      <p className="text-sm text-muted-foreground">{session.venue}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">開催形式</p>
                      <p className="text-sm text-muted-foreground">{session.format || '未設定'}</p>
                    </div>
                  </div>
                  
                  {session.zoomUrl && (
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">ZOOM URL</p>
                        <a 
                          href={session.zoomUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center"
                        >
                          ZOOM参加
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">参加者数</p>
                      <p className="text-sm text-muted-foreground">{participants.length}名</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Googleカレンダー登録ボタン */}
              <div className="pt-4 mt-4 border-t">
                <a 
                  href={generateGoogleCalendarUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Googleカレンダーに登録
                  </Button>
                </a>
              </div>
              
              {session.notes && (
                <div className="pt-4 mt-4 border-t">
                  <p className="text-sm font-medium mb-1">備考</p>
                  <p className="text-sm text-muted-foreground">{session.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 管理情報 - 右側 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="h-4 w-4" />
                管理情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* リクルーター */}
              <div className="space-y-2">
                <Label htmlFor="recruiter" className="text-sm">リクルーター</Label>
                <Input
                  id="recruiter"
                  value={session.recruiter || ''}
                  onChange={(e) => handleRecruiterChange(e.target.value)}
                  placeholder="リクルーター名を入力"
                  className="text-sm"
                />
              </div>

              {/* チェックボックス */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reportReminder"
                    checked={!!session.reportReminderDate}
                    onCheckedChange={handleReportReminderChange}
                  />
                  <div className="flex-1">
                    <Label htmlFor="reportReminder" className="text-sm font-medium">
                      開催報告とリマインド
                    </Label>
                    {session.reportReminderDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        完了: {formatDate(session.reportReminderDate)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="participantReport"
                    checked={!!session.participantReportDate}
                    onCheckedChange={handleParticipantReportChange}
                  />
                  <div className="flex-1">
                    <Label htmlFor="participantReport" className="text-sm font-medium">
                      人数報告
                    </Label>
                    {session.participantReportDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        完了: {formatDate(session.participantReportDate)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 参加者数統計 */}
              <div className="pt-3 border-t">
                <p className="text-sm font-medium mb-2">参加者数統計</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-muted-foreground">予約数</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{registrationCount}名</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-muted-foreground">参加数</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">{participationCount}名</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 参加者一覧 */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">参加者一覧 ({participants.length}名)</h2>
      </div>
      
      <ParticipantList
        participants={participants}
        applicants={applicants}
        session={session}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
} 