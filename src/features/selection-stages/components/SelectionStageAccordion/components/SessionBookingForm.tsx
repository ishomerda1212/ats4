import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { formatDateTime } from '@/shared/utils/date';
import { STAGES_WITH_SESSION } from '@/shared/utils/constants';
import { Event, EventSession } from '@/features/events/types/event';
import { Link } from 'react-router-dom';

interface SessionInfo {
  event: Event;
  session: EventSession;
}

interface SessionBookingFormProps {
  stage: string;
  sessionInfo: SessionInfo | null;
  onOpenSessionDialog: (stage: string) => void;
  applicantId?: string; // 応募者IDを追加
}

export function SessionBookingForm({ 
  stage, 
  sessionInfo, 
  onOpenSessionDialog,
  applicantId
}: SessionBookingFormProps) {
  if (sessionInfo) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            セッション情報
          </h4>
          <div className="flex items-center space-x-2">
            <Link to={`/event/${sessionInfo.event.id}/session/${sessionInfo.session.id}${applicantId ? `?fromApplicant=${applicantId}` : ''}`}>
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                詳細
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenSessionDialog(stage)}
            >
              <Calendar className="h-3 w-3 mr-1" />
              編集
            </Button>
          </div>
        </div>
        <div className="p-3 border rounded-lg bg-gray-50">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-base text-blue-600">
                {formatDateTime(sessionInfo.session.start)} - {formatDateTime(sessionInfo.session.end)}
              </h5>
              <Badge className="text-xs">
                {sessionInfo.session.format}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{sessionInfo.session.venue}</span>
              </div>
              {sessionInfo.session.maxParticipants && (
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>
                    {sessionInfo.session.currentParticipants || 0}/{sessionInfo.session.maxParticipants}名
                  </span>
                </div>
              )}
            </div>
            {sessionInfo.session.recruiter && (
              <div className="text-xs text-muted-foreground">
                担当者: {sessionInfo.session.recruiter}
              </div>
            )}
            {sessionInfo.session.notes && (
              <div className="text-xs text-muted-foreground">
                備考: {sessionInfo.session.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          セッション情報
        </h4>
        {(STAGES_WITH_SESSION as readonly string[]).includes(stage) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenSessionDialog(stage)}
          >
            <Calendar className="h-3 w-3 mr-1" />
            セッション情報登録
          </Button>
        )}
      </div>
      {(STAGES_WITH_SESSION as readonly string[]).includes(stage) && (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center">
          <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">セッション情報が登録されていません</p>
          <p className="text-xs text-gray-400 mt-1">
            セッション情報を登録して詳細を管理できます
          </p>
        </div>
      )}
    </div>
  );
}
