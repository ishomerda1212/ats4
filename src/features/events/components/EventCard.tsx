import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event } from '../types/event';
import { StatusBadge } from '@/shared/components/common/StatusBadge';

interface EventCardProps {
  event: Event;
  participantCount: number;
  sessionCount: number;
}

export function EventCard({ event, participantCount, sessionCount }: EventCardProps) {
  return (
    <Link to={`/selection-stage/${event.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base">{event.name}</CardTitle>
              <StatusBadge stage={event.stage} />
            </div>
            <div className="flex items-center space-x-1">
              <Badge className="bg-gray-100 text-gray-800 flex items-center space-x-1 text-xs">
                <Calendar className="h-3 w-3" />
                <span>{sessionCount}回</span>
              </Badge>
              <Badge className="bg-gray-100 text-gray-800 flex items-center space-x-1 text-xs">
                <Users className="h-3 w-3" />
                <span>{participantCount}名</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}