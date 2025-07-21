import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Clock, MapPin, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { useApplicants } from '@/features/applicants/hooks/useApplicants';
import { ApplicantInfoPanel } from '@/features/evaluations/components/ApplicantInfoPanel';
import { formatDateTime } from '@/shared/utils/date';
import { Applicant } from '@/features/applicants/types/applicant';
import { EvaluationForm } from '@/features/evaluations/components/EvaluationForm';

export function EventSessionParticipantsPage() {
  const { eventId, sessionId } = useParams<{ eventId: string; sessionId: string }>();
  
  const { events, eventSessions, getSessionParticipants, loading } = useEvents();
  const { applicants } = useApplicants();
  
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());
  const [autoSave, setAutoSave] = useState(true);

  const event = events.find(e => e.id === eventId);
  const session = eventSessions.find(s => s.id === sessionId);
  const participants = session ? getSessionParticipants(session.id) : [];

  // 応募者情報を取得
  const participantApplicants = participants.map(p => {
    const applicant = applicants.find(a => a.id === p.applicantId);
    return { participant: p, applicant };
  }).filter(item => item.applicant);

  // 評定表の完了状況を確認
  const getEvaluationStatus = (applicantId: string) => {
    // 簡易的な実装 - 実際はevaluationsから確認
    return false;
  };

  const handleParticipantSelect = (applicant: Applicant, checked: boolean) => {
    const newSelected = new Set(selectedParticipants);
    if (checked) {
      newSelected.add(applicant.id);
    } else {
      newSelected.delete(applicant.id);
    }
    setSelectedParticipants(newSelected);
  };

  const handleApplicantClick = (applicant: Applicant) => {
    setCurrentApplicant(applicant);
    // 選択状態も更新
    const newSelected = new Set([applicant.id]);
    setSelectedParticipants(newSelected);
  };

  const handleBatchEvaluation = () => {
    if (selectedParticipants.size === 0) {
      alert('評価対象の応募者を選択してください');
      return;
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

  if (!event || !session) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">イベントまたはセッションが見つかりませんでした。</p>
        <Link to="/events">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            イベント一覧に戻る
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center space-x-4">
        <Link to={`/events/${eventId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            イベント詳細に戻る
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">参加者評定表管理</h1>
          <p className="text-muted-foreground mt-1">{event.name}</p>
        </div>
      </div>

      {/* イベント情報 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{formatDateTime(session.startDateTime)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{session.venue}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Badge className="bg-gray-100 text-gray-800">{participants.length}名</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-save"
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
                <Label htmlFor="auto-save">自動保存</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
        {/* 参加者一覧 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>参加者一覧</span>
              </CardTitle>
              <Badge variant="outline">{participants.length}名</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 overflow-y-auto max-h-[400px]">
            <div className="space-y-2 mb-4">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleBatchEvaluation}
                disabled={selectedParticipants.size === 0}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                選択者の一括評定表作成 ({selectedParticipants.size})
              </Button>
            </div>
            
            {participantApplicants.map(({ participant, applicant }) => {
              const hasEvaluation = getEvaluationStatus(applicant.id);
              const isSelected = currentApplicant?.id === applicant?.id;
              
              return (
                <div
                  key={participant.id}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-accent'
                  }`}
                  onClick={() => handleApplicantClick(applicant)}
                >
                  <Checkbox
                    checked={selectedParticipants.has(applicant?.id || '')}
                    onCheckedChange={(checked) => 
                      handleParticipantSelect(applicant, checked as boolean)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium truncate">{applicant?.name}</h4>
                      {hasEvaluation && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {applicant?.schoolName}
                    </p>
                    <Badge 
                      className={participant.status === '参加' ? 'bg-blue-100 text-blue-800 text-xs' : 'bg-gray-100 text-gray-800 text-xs'}
                    >
                      {participant.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* 応募者詳細情報 */}
        <Card className="lg:col-span-1 overflow-y-auto">
          {currentApplicant ? (
            <ApplicantInfoPanel applicant={currentApplicant} />
          ) : (
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">応募者を選択してください</p>
            </CardContent>
          )}
        </Card>

        {/* 評定表入力エリア */}
        <Card className="lg:col-span-1 overflow-y-auto">
          {currentApplicant ? (
            <EvaluationForm
              applicantId={currentApplicant.id}
              selectionHistoryId={sessionId!}
            />
          ) : (
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">応募者を選択して評定表を入力してください</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}