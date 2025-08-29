import { Badge } from '@/components/ui/badge';
import { AccordionTrigger } from '@/components/ui/accordion';
import { formatDateTime } from '@/shared/utils/date';
import { getTaskStatusColor } from '../utils/stageHelpers';
import { SelectionHistory } from '@/features/applicants/types/applicant';
import { TaskStatus } from '@/features/tasks/types/task';
import { Event, EventSession } from '@/features/events/types/event';
import { getEventColor } from '@/shared/utils/constants';

interface SessionInfo {
  event: Event;
  session: EventSession | null;
}

interface StageCardProps {
  item: SelectionHistory;
  sessionInfo: SessionInfo | null;
  event?: Event;
}

export function StageCard({ item, sessionInfo, event }: StageCardProps) {
  // イベントの色を取得
  const eventColor = event ? getEventColor(event) : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  
  return (
    <AccordionTrigger className="hover:no-underline">
      <div className="flex items-center justify-between w-full pr-4">
        <div className="text-left">
          <h3 className="font-medium">{item.stage}</h3>
          <p className="text-sm text-muted-foreground">
            {(() => {
              if (sessionInfo && sessionInfo.session) {
                return formatDateTime(sessionInfo.session.sessionDate);
              }
              return item.createdAt ? formatDateTime(item.createdAt) : '未設定';
            })()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getTaskStatusColor(item.status as TaskStatus)}>
            {item.status}
          </Badge>
          {event && (
            <Badge className={eventColor}>
              {event.stageConfig?.stage_group || 'その他'}
            </Badge>
          )}
        </div>
      </div>
    </AccordionTrigger>
  );
}
