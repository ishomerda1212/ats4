import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, MapPin, Users, UserCheck, Monitor, Video, ExternalLink } from 'lucide-react';
import { EventSessionForm } from '../components/EventSessionForm';
import { useEvents } from '../hooks/useEvents';
import { useApplicants } from '@/features/applicants/hooks/useApplicants';
// import { useTaskManagement } from '@/features/tasks/hooks/useTaskManagement';
import { formatDateTime, formatDate } from '@/shared/utils/date';
import { EventSession, ParticipationStatus } from '../types/event';
import { STAGE_TASKS } from '@/shared/utils/constants';
import { SelectionStage } from '@/features/applicants/types/applicant';
import { TaskInstance, FixedTask } from '@/features/tasks/types/task';
import { ApplicantTaskTable } from '@/shared/components/common/ApplicantTaskTable';
import { UnifiedParticipationDataAccess } from '@/lib/dataAccess/unifiedParticipationDataAccess';

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
    updateParticipantStatus,
    deleteEventSession,
    updateEventSession,
    loading
  } = useEvents();
  
  const { applicants } = useApplicants();
  // const { getApplicantTasksByStage } = useTaskManagement();
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState<EventSession | null>(null);
  // const [participantTasks, setParticipantTasks] = useState<Record<string, any[]>>({});

  // URLパラメータのデバッグ（一時的に無効化）
  // console.log('URL Params Debug:', {
  //   params,
  //   eventId,
  //   sessionId,
  //   eventsFromHook: events.length
  // });

  const event = events.find(e => e.id === eventId);
  const sessions = event ? getEventSessions(event.id) : [];
  const session = sessions.find(s => s.id === sessionId);
  const [participants, setParticipants] = useState<any[]>([]);

  // 選考段階名を取得（event.nameをSelectionStageとして扱う）
  const stageName = event?.name as SelectionStage;

  // 参加者データを取得
  useEffect(() => {
    if (session && session.id) {
      // console.log('🔄 Fetching participants - session ID:', session.id);
      
      const fetchParticipants = async () => {
        try {
          // セッションの参加者を取得（これだけで十分）
          const participantsData = await UnifiedParticipationDataAccess.getSessionParticipants(session.id);
          // console.log('📊 Participants found:', participantsData.length);
          
          // 二重取得を削除 - セッション参加者データをそのまま使用
          setParticipants(participantsData);
        } catch (error) {
          console.error('Failed to fetch participants:', error);
          setParticipants([]);
        }
      };
      
      fetchParticipants();
    }
  }, [session?.id]);

  // 参加者のタスクデータを取得（一時的に無効化）
  // useEffect(() => {
  //   if (participants.length > 0 && stageName) {
  //     const fetchParticipantTasks = async () => {
  //       const tasksData: Record<string, any[]> = {};
  //       
  //       for (const participant of participants) {
  //         const applicant = applicants.find(a => a.id === participant.applicantId);
  //         if (applicant) {
  //           const tasks = await getApplicantTasksByStage(applicant, stageName);
  //           tasksData[participant.applicantId] = tasks;
  //         }
  //       }
  //       
  //       setParticipantTasks(tasksData);
  //     };
  //     
  //     fetchParticipantTasks();
  //   }
  // }, [participants, applicants, stageName, getApplicantTasksByStage]);



  // デバッグ情報（一時的に無効化）
  // console.log('EventSessionDetailPage Debug:', {
  //   eventId,
  //   sessionId,
  //   eventsCount: events.length,
  //   event,
  //   sessionsCount: sessions.length,
  //   session,
  //   participantsCount: participants.length,
  //   allSessions: sessions.map(s => ({ id: s.id, name: s.name })),
  //   allEvents: events.map(e => ({ id: e.id, name: e.name }))
  // });

  // 参加者数のカウント
  const registrationCount = participants.filter(p => p.status === '申込').length;
  const participationCount = participants.filter(p => p.status === '参加').length;

  // デバッグ情報（開発環境でのみ表示）
  const debugInfo = process.env.NODE_ENV === 'development' ? {
    sessionId: session?.id,
    participantsCount: participants.length,
    dataSource: 'UnifiedParticipationDataAccess.getSessionParticipants',
    lastUpdated: new Date().toISOString()
  } : null;

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
        <Link to={`/selection-stage/${eventId}`}>
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            選考段階詳細に戻る
          </Button>
        </Link>
      </div>
    );
  }

  const handleDeleteSession = () => {
    if (window.confirm('このセッションを削除しますか？')) {
      deleteEventSession(session.id);
      // 削除後は選考段階詳細ページに戻る
              window.location.href = `/selection-stage/${eventId}`;
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

  const handleStatusChange = async (participantId: string, status: ParticipationStatus) => {
    try {
      await updateParticipantStatus(participantId, status);
      
      // 参加状況更新後に参加者データを再取得
      if (session && session.id) {
        const updatedParticipants = await UnifiedParticipationDataAccess.getSessionParticipants(session.id);
        setParticipants(updatedParticipants);
      }
    } catch (error) {
      console.error('Failed to update participant status:', error);
    }
  };





  // Googleカレンダー登録用URLを生成
  const generateGoogleCalendarUrl = () => {
    try {
      // デバッグ情報を追加（一時的に無効化）
      // console.log('Session data for Google Calendar:', {
      //   sessionDate: session.sessionDate,
      //   startTime: session.startTime,
      //   endTime: session.endTime,
      //   sessionDateType: typeof session.sessionDate,
      //   startTimeType: typeof session.startTime,
      //   endTimeType: typeof session.endTime
      // });

      // sessionDateがDateオブジェクトでない場合は変換
      const sessionDate = session.sessionDate instanceof Date 
        ? session.sessionDate 
        : new Date(session.sessionDate);
      
      // 無効な日時の場合はエラーを返す
      if (isNaN(sessionDate.getTime())) {
        console.error('Invalid sessionDate:', session.sessionDate);
        return '#';
      }

      // startTimeとendTimeが文字列でない場合はエラーを返す
      if (typeof session.startTime !== 'string' || typeof session.endTime !== 'string') {
        console.error('Invalid time format:', { startTime: session.startTime, endTime: session.endTime });
        return '#';
      }
      
      // 時刻を解析
      const [startHour, startMinute] = session.startTime.split(':').map(Number);
      const [endHour, endMinute] = session.endTime.split(':').map(Number);
      
      if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
        console.error('Invalid time values:', { startTime: session.startTime, endTime: session.endTime });
        return '#';
      }
      
      // 開始日時と終了日時を構築
      const startDateTime = new Date(sessionDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);
      
      const endDateTime = new Date(sessionDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);
      
      // console.log('Calculated date times:', {
      //   startDateTime: startDateTime.toISOString(),
      //   endDateTime: endDateTime.toISOString()
      // });
      
      // Googleカレンダー用のフォーマットに変換
      const startDate = startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endDate = endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: session.name,
        dates: `${startDate}/${endDate}`,
        details: `${session.notes || ''}\n\n会場: ${session.venue}\n開催形式: ${session.format}${session.zoomUrl ? `\nZOOM URL: ${session.zoomUrl}` : ''}`,
        location: session.venue,
      });

      const url = `https://www.google.com/calendar/render?${params.toString()}`;
      // console.log('Generated Google Calendar URL:', url);
      
      return url;
    } catch (error) {
      console.error('Error generating Google Calendar URL:', error, {
        session: session
      });
      return '#';
    }
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
          <Link to={`/selection-stage/${eventId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              選考段階詳細に戻る
            </Button>
          </Link>
        )}
        <div>
          <h1 className="text-3xl font-bold">セッション詳細</h1>
          <p className="text-muted-foreground mt-1">{event.name}</p>
        </div>
      </div>

      {/* セッション情報 */}
      <div className="grid grid-cols-1 gap-6">
        {/* セッション情報 */}
        <div>
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
                    eventName={event.name}
                    session={editingSession || undefined}
                    mode={editingSession ? 'edit' : 'create'}
                    onCancel={handleSessionFormCancel}
                    onSuccess={handleSessionFormSuccess}
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">開始日時</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(session.sessionDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">終了日時</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(session.sessionDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">開催場所</p>
                    <p className="text-sm text-muted-foreground">{session.venue || '未設定'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">開催形式</p>
                    <p className="text-sm text-muted-foreground">{session.format || '未設定'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">ZOOM URL</p>
                    {session.zoomUrl ? (
                      <a 
                        href={session.zoomUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center"
                      >
                        ZOOM参加
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">未設定</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">参加者数</p>
                    <p className="text-sm text-muted-foreground">{participants.length}名</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">予約数</p>
                    <p className="text-sm text-muted-foreground">{registrationCount}名</p>
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
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Googleカレンダーに登録
                  </Button>
                </a>
              </div>

              {/* デバッグ情報（開発環境でのみ表示） */}
              {debugInfo && (
                <div className="pt-4 mt-4 border-t">
                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer">デバッグ情報</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
              
              <div className="pt-4 mt-4 border-t">
                <p className="text-sm font-medium mb-1">備考</p>
                <p className="text-sm text-muted-foreground">{session.notes || '未設定'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 参加者一覧 */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">参加者一覧 ({participants.length}名)</h2>
      </div>
      
      <ApplicantTaskTable
        applicants={applicants}
        stageName={stageName}
        applicantTasks={{}}
        title="参加者一覧"
        showParticipationStatus={true}
        onStatusChange={handleStatusChange}
        participants={participants.map(p => ({
          id: p.id,
          applicantId: p.applicantId,
          status: p.status
        }))}
        sessionId={session?.id}
        eventId={session?.eventId}
      />
    </div>
  );
} 