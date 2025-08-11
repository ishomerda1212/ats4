import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event } from '../types/event';
import { StatusBadge } from '@/shared/components/common/StatusBadge';
import { formatDate } from '@/shared/utils/date';

interface EventCardProps {
  event: Event;
  participantCount: number;
  sessionCount: number;
}

export function EventCard({ event, participantCount, sessionCount }: EventCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{event.name}</CardTitle>
            <StatusBadge stage={event.stage} />
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-gray-100 text-gray-800 flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{sessionCount}回</span>
            </Badge>
            <Badge className="bg-gray-100 text-gray-800 flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{participantCount}名</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            作成日: {formatDate(event.createdAt)}
          </div>
          
          <div className="flex items-center space-x-2">
            <Link to={`/event/${event.id}`}>
              <Button size="sm" variant="outline">
                <Eye className="h-3 w-3 mr-1" />
                詳細
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}