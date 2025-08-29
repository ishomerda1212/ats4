import { useParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit, Calendar, Users, ExternalLink, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventSessionCard } from '../components/EventSessionCard';
import { EventSessionForm } from '../components/EventSessionForm';
import { useEvents } from '../hooks/useEvents';
import { useApplicants } from '@/features/applicants/hooks/useApplicants';
import { useTaskManagement } from '@/features/tasks/hooks/useTaskManagement';
import { StatusBadge } from '@/shared/components/common/StatusBadge';
import { formatDate } from '@/shared/utils/date';
import { EventSession } from '../types/event';
import { STAGES_WITH_SESSION, STAGE_COLORS } from '@/shared/utils/constants';
import { SelectionStage } from '@/features/applicants/types/applicant';
import { TaskInstance, FixedTask } from '@/features/tasks/types/task';
import { ApplicantTaskTable } from '@/shared/components/common/ApplicantTaskTable';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { 
    events, 
    loading,
    getEventSessions,
    getParticipantsBySession
  } = useEvents();
  
  const { applicants } = useApplicants();
  const { getApplicantTasksByStage } = useTaskManagement();
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState<EventSession | null>(null);
  const [applicantTasks, setApplicantTasks] = useState<Record<string, (FixedTask & TaskInstance)[]>>({});

  const event = events.find(e => e.id === id);
  const sessions = event ? getEventSessions(event.id) : [];

  // 選考段階として扱う
  const stageName = event?.name as SelectionStage;
  const hasSession = STAGES_WITH_SESSION.includes(stageName as any);
  const stageColor = stageName ? STAGE_COLORS[stageName] : '';

  // 現在の選考段階にいる応募者をメモ化
  const stageApplicants = useMemo(() => {
    return applicants.filter(a => a.currentStage === stageName);
  }, [applicants, stageName]);

  // セッションが不要な選考段階の場合、各応募者のタスクを取得
  useEffect(() => {
    if (!hasSession && stageName && stageApplicants.length > 0) {
      const fetchApplicantTasks = async () => {
        const tasksMap: Record<string, (FixedTask & TaskInstance)[]> = {};
        
        for (const applicant of stageApplicants) {
          try {
            const tasks = await getApplicantTasksByStage(applicant, stageName);
            tasksMap[applicant.id] = tasks;
          } catch (error) {
            console.error(`Failed to fetch tasks for applicant ${applicant.id}:`, error);
            tasksMap[applicant.id] = [];
          }
        }
        
        setApplicantTasks(tasksMap);
      };

      fetchApplicantTasks();
    }
  }, [hasSession, stageName, stageApplicants.length]); // より安定した依存関係

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

  // 選考段階の説明を取得
  const getStageDescription = (stage: SelectionStage): string => {
    const descriptions: Record<SelectionStage, string> = {
      'エントリー': '応募者のエントリーを受け付けます。基本的な情報を収集し、選考プロセスの開始点となります。',
      '書類選考': '提出された書類を審査し、応募者の適性を評価します。',
      '会社説明会': '会社の概要、事業内容、働く環境について説明します。',
      '適性検査': '適性検査を実施し、応募者の能力を評価します。',
      '適性検査体験': '適性検査の体験版を実施し、応募者の能力を評価します。',
      '職場見学': '実際の職場を見学し、働く環境を理解してもらいます。',
      '仕事体験': '実際の業務を体験し、仕事の内容を理解してもらいます。',
      '個別面接': '応募者と1対1で面接を行い、詳細な評価を行います。',
      '集団面接': '複数の応募者と面接を行い、グループでの評価を行います。',
      'CEOセミナー': 'CEOによる特別セミナーを実施し、会社のビジョンを共有します。',
      '人事面接': '人事担当者による面接を行い、組織への適合性を評価します。',
      '最終選考': '最終的な選考を行い、内定者を決定します。',
      '内定面談': '内定者との面談を行い、入社に向けた詳細を確認します。',
      '不採用': '選考結果を通知し、不採用の手続きを行います。'
    };
    return descriptions[stage] || '選考段階の詳細情報です。';
  };

  // タスクステータスの色を取得


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
          <h1 className="text-3xl font-bold">選考段階詳細</h1>
          <p className="text-muted-foreground mt-1">{event.name}</p>
        </div>
      </div>

      {/* 選考段階基本情報 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>基本情報</CardTitle>
            <Link to={`/selection-stage/${event.id}/edit`}>
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
              {stageColor && (
                <Badge className={stageColor}>
                  {event.name}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {hasSession && (
                <>
                  <Badge className="bg-gray-100 text-gray-800 flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{sessions.length}回開催</span>
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-800 flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>総参加者{totalParticipants}名</span>
                  </Badge>
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">説明</h3>
            <p className="text-muted-foreground">{getStageDescription(stageName)}</p>
          </div>

          {/* 応募者フォームへのリンク（セッション情報がある場合のみ） */}
          {hasSession && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-2">応募者フォーム</h3>
                  <p className="text-sm text-muted-foreground">
                    この選考段階の応募者フォームのサンプルを確認できます
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
          )}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>作成日: {formatDate(event.createdAt)}</span>
              <span>最終更新: {formatDate(event.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* セッション情報がある場合のみ表示 */}
      {hasSession && (
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
                  eventName={event.name}
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
      )}

      {/* セッション情報が不要な選考段階の場合 */}
      {!hasSession && (
        <ApplicantTaskTable
          applicants={stageApplicants}
          stageName={stageName}
          applicantTasks={applicantTasks}
          title="応募者一覧"
        />
      )}
    </div>
  );
}