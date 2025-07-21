import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, CheckCircle } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { useApplicants } from '@/features/applicants/hooks/useApplicants';
import { StatusBadge } from '@/shared/components/common/StatusBadge';
import { formatDateTime } from '@/shared/utils/date';
import { EventSession } from '../types/event';
import { toast } from '@/hooks/use-toast';

export function EventRegistrationPage() {
  const { applicantId } = useParams<{ applicantId: string }>();
  const { 
    events, 
    loading,
    getParticipantsBySession,
    getEventSessions
  } = useEvents();
  
  const { applicants } = useApplicants();
  const [registeredSessions] = useState<Set<string>>(new Set());

  const applicant = applicants.find(a => a.id === applicantId);

  // 応募者の現在の選考段階に適したイベントを取得
  const availableEvents = events.filter(event => {
    if (!applicant) return false;
    // 現在の段階以降のイベントを表示
    const stageOrder = ['エントリー', '会社説明会', '適性検査', '職場見学', '社長セミナー', '人事面接', 'グループ面接', '最終選考'];
    const currentStageIndex = stageOrder.indexOf(applicant.currentStage);
    const eventStageIndex = stageOrder.indexOf(event.stage);
    return eventStageIndex >= currentStageIndex;
  });

  const handleRegister = (session: EventSession) => {
    if (!applicantId) return;

    try {
      // 参加登録処理（実装予定）
      console.log('参加登録:', { sessionId: session.id, applicantId });
      toast({
        title: "参加登録完了",
        description: "イベントへの参加登録が完了しました。",
      });
    } catch {
      toast({
        title: "エラーが発生しました",
        description: "参加申し込みに失敗しました。",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">応募者が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">イベント参加申し込み</h1>
        <p className="text-muted-foreground mt-2">
          {applicant.name}さん向けの参加可能イベント
        </p>
      </div>

      {/* 応募者情報 */}
      <Card>
        <CardHeader>
          <CardTitle>応募者情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{applicant.name}</h3>
              <p className="text-sm text-muted-foreground">{applicant.nameKana}</p>
              <p className="text-sm text-muted-foreground">
                {applicant.schoolName} {applicant.faculty} {applicant.department}
              </p>
            </div>
            <StatusBadge stage={applicant.currentStage} />
          </div>
        </CardContent>
      </Card>

      {/* 参加可能イベント */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">参加可能イベント</h2>
        
        {availableEvents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                現在参加可能なイベントはありません。
              </p>
            </CardContent>
          </Card>
        ) : (
          availableEvents.map((event) => {
            const sessions = getEventSessions(event.id);
            
            return (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{event.name}</CardTitle>
                      <p className="text-muted-foreground mt-1">{event.description}</p>
                    </div>
                    <StatusBadge stage={event.stage} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h4 className="font-medium">開催日時</h4>
                    {sessions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        開催日時が未定です
                      </p>
                    ) : (
                      <div className="grid gap-4">
                        {sessions.map((session) => {
                          const participants = getParticipantsBySession(session.id);
                          const isRegistered = registeredSessions.has(session.id) ||
                            participants.some(p => p.applicantId === applicantId);

                          return (
                            <div
                              key={session.id}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                      {formatDateTime(session.start)}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      {formatDateTime(session.end)}まで
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{session.venue}</span>
                                  </div>
                                  <Badge className="bg-gray-100 text-gray-800 flex items-center space-x-1">
                                    <Users className="h-3 w-3" />
                                    <span>{participants.length}名参加予定</span>
                                  </Badge>
                                </div>
                              </div>
                              
                              <div>
                                {isRegistered ? (
                                  <Button disabled className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>申し込み済み</span>
                                  </Button>
                                ) : (
                                  <Button onClick={() => handleRegister(session)}>
                                    参加申し込み
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}