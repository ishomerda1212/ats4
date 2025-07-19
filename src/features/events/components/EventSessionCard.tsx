import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventSession } from '../types/event';
import { formatDateTime } from '@/shared/utils/date';

interface EventSessionCardProps {
  session: EventSession;
  participantCount: number;
}

export function EventSessionCard({ 
  session, 
  participantCount
}: EventSessionCardProps) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 flex-1">
            {/* 日時 */}
            <div className="flex items-center space-x-2 min-w-[180px]">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatDateTime(session.startDateTime)}</span>
            </div>
            
            {/* 時間 */}
            <div className="flex items-center space-x-2 min-w-[120px]">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formatDateTime(session.endDateTime)}
              </span>
            </div>
            
            {/* 場所 */}
            <div className="flex items-center space-x-2 min-w-[150px]">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{session.venue}</span>
            </div>
            
            {/* 参加者数 */}
            <div className="flex items-center space-x-2 min-w-[80px]">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{participantCount}名</span>
            </div>
            
            {/* 備考 */}
            {session.notes && (
              <div className="flex-1">
                <span className="text-sm text-muted-foreground">{session.notes}</span>
              </div>
            )}
          </div>
          
          {/* アクションボタン */}
          <div className="flex items-center space-x-2 ml-4">
            <Link to={`/events/${session.eventId}/sessions/${session.id}`}>
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