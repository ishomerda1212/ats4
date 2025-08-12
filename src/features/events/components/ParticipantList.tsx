import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Phone, Monitor, Users } from 'lucide-react';
import { EventParticipant, ParticipationStatus, EventSession } from '../types/event';
import { Applicant } from '@/features/applicants/types/applicant';

interface ParticipantListProps {
  participants: EventParticipant[];
  applicants: Applicant[];
  session?: EventSession;
  onStatusChange?: (participantId: string, status: ParticipationStatus) => void;
}

const STATUS_COLORS: Record<ParticipationStatus, string> = {
  '申込': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  '参加': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  '欠席': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  '不参加': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  '未定': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
};

export function ParticipantList({ participants, applicants, session, onStatusChange }: ParticipantListProps) {
  const getApplicant = (applicantId: string) => {
    return applicants.find(a => a.id === applicantId);
  };

  const getFormatBadge = (format?: string) => {
    switch (format) {
      case '対面':
        return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><Users className="w-3 h-3" />対面</Badge>;
      case 'オンライン':
        return <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1"><Monitor className="w-3 h-3" />オンライン</Badge>;

      default:
        return <Badge className="bg-gray-100 text-gray-800">未定</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>参加者一覧 ({participants.length}名)</CardTitle>
      </CardHeader>
      <CardContent>
        {participants.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            参加者がいません
          </p>
        ) : (
          <div className="space-y-4">
            {participants.map((participant) => {
              const applicant = getApplicant(participant.applicantId);
              if (!applicant) return null;

              return (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{applicant.name}</h4>
                        <p className="text-sm text-muted-foreground">{applicant.nameKana}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{applicant.phone}</span>
                      </div>
                      {session?.format && (
                        <div className="flex items-center space-x-1">
                          {getFormatBadge(session.format)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    
                    {onStatusChange ? (
                      <Select
                        value={participant.status}
                        onValueChange={(value: ParticipationStatus) => 
                          onStatusChange(participant.id, value)
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
                    ) : (
                      <Badge className={STATUS_COLORS[participant.status]}>
                        {participant.status}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}