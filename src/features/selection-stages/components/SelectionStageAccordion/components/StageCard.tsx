import { Badge } from '@/components/ui/badge';
import { AccordionTrigger } from '@/components/ui/accordion';
import { formatDateTime } from '@/shared/utils/date';
import { getTaskStatusColor } from '../utils/stageHelpers';
import { SelectionHistory } from '@/features/applicants/types/applicant';
import { TaskStatus } from '@/features/tasks/types/task';
import { Event, EventSession } from '@/features/events/types/event';

interface SessionInfo {
  event: Event;
  session: EventSession;
}

interface StageCardProps {
  item: SelectionHistory;
  sessionInfo: SessionInfo | null;
}

export function StageCard({ item, sessionInfo }: StageCardProps) {
  return (
    <AccordionTrigger className="hover:no-underline">
      <div className="flex items-center justify-between w-full pr-4">
        <div className="text-left">
          <h3 className="font-medium">{item.stage}</h3>
          <p className="text-sm text-muted-foreground">
            {(() => {
              if (sessionInfo) {
                return formatDateTime(sessionInfo.session.start);
              }
              return item.createdAt ? formatDateTime(item.createdAt) : '未設定';
            })()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getTaskStatusColor(item.status as TaskStatus)}>
            {item.status}
          </Badge>
        </div>
      </div>
    </AccordionTrigger>
  );
}
