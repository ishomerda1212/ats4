import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Applicant } from '@/features/applicants/types/applicant';
import { SelectionStage } from '@/features/applicants/types/applicant';
import { STAGE_TASKS } from '@/shared/utils/constants';
import { ParticipationStatus } from '@/features/events/types/event';

interface ApplicantTaskTableProps {
  applicants: Applicant[];
  stageName: SelectionStage;
  applicantTasks: Record<string, any[]>;
  title?: string;
  showParticipationStatus?: boolean;
  onStatusChange?: (participantId: string, status: ParticipationStatus) => void;
  participants?: Array<{
    id: string;
    applicantId: string;
    status: ParticipationStatus;
  }>;
  sessionId?: string;
  eventId?: string;
}

export function ApplicantTaskTable({
  applicants,
  stageName,
  applicantTasks,
  title = "応募者一覧",
  showParticipationStatus = false,
  onStatusChange,
  participants,
  sessionId,
  eventId
}: ApplicantTaskTableProps) {
  // タスクステータスの色を取得する関数
  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case '完了':
        return 'bg-green-100 text-green-800';
      case '返信待ち':
        return 'bg-yellow-100 text-yellow-800';
      case '提出待ち':
        return 'bg-orange-100 text-orange-800';
      case '未着手':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 表示する応募者リストを決定
  const displayApplicants = showParticipationStatus && participants 
    ? participants.map(p => {
        const applicant = applicants.find(a => a.id === p.applicantId);
        return applicant ? { ...applicant, participantId: p.id, participationStatus: p.status } : null;
      }).filter(Boolean)
    : applicants;

  const stageTaskTypes = STAGE_TASKS[stageName] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title} ({displayApplicants.length}名)</CardTitle>
      </CardHeader>
      <CardContent>
        {displayApplicants.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {showParticipationStatus ? '参加者がいません' : 'この選考段階にいる応募者は現在いません。'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">
                    {showParticipationStatus ? '参加者名' : '応募者名'}
                  </TableHead>
                  {showParticipationStatus && (
                    <TableHead className="min-w-[80px]">参加状況</TableHead>
                  )}
                  {stageTaskTypes.map((taskType) => (
                    <TableHead key={taskType} className="min-w-[100px] text-center">
                      {taskType}
                    </TableHead>
                  ))}
                  <TableHead className="min-w-[80px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayApplicants.map((applicant) => {
                  const applicantTaskData = applicantTasks[applicant.id] || [];
                  const participantId = (applicant as any).participantId;
                  const participationStatus = (applicant as any).participationStatus;

                  return (
                    <TableRow key={applicant.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{applicant.name}</div>
                          <div className="text-sm text-muted-foreground">{applicant.email}</div>
                        </div>
                      </TableCell>
                      {showParticipationStatus && (
                        <TableCell>
                          <Select
                            value={participationStatus}
                            onValueChange={(value: ParticipationStatus) => 
                              onStatusChange?.(participantId, value)
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="申込">申込</SelectItem>
                              <SelectItem value="参加">参加</SelectItem>
                              <SelectItem value="欠席">欠席</SelectItem>
                              <SelectItem value="不参加">不参加</SelectItem>
                              <SelectItem value="未定">未定</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}
                      {stageTaskTypes.map((taskType) => {
                        const task = applicantTaskData.find(t => t.title.includes(taskType) || t.type === taskType);
                        const status = task?.status || '未着手';
                        
                        return (
                          <TableCell key={taskType} className="text-center">
                            <Badge className={`text-xs ${getTaskStatusColor(status)}`}>
                              {status}
                            </Badge>
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        {showParticipationStatus && sessionId && eventId ? (
                          <Link to={`/applicants/${applicant.id}?fromEvent=${eventId}&fromSession=${sessionId}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              詳細
                            </Button>
                          </Link>
                        ) : (
                          <Link to={`/applicants/${applicant.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              詳細
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
