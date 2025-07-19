import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventSession } from '../types/event';
import { formatDateTime } from '@/shared/utils/date';

interface EventSessionCardProps {
  session: EventSession;
  participantCount: number;
  onEdit?: (session: EventSession) => void;
  onDelete?: (session: EventSession) => void;
  onViewParticipants?: (session: EventSession) => void;
}

export function EventSessionCard({ 
  session, 
  participantCount, 
  onEdit, 
  onDelete, 
  onViewParticipants 
}: EventSessionCardProps) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatDateTime(session.startDateTime)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formatDateTime(session.endDateTime)}まで
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{session.venue}</span>
            </div>
          </div>
          
          <Badge variant="outline" className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{participantCount}名</span>
          </Badge>
        </div>
        
        {session.notes && (
          <div className="mb-3">
            <p className="text-sm text-muted-foreground">{session.notes}</p>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          {onViewParticipants && (
            <Button size="sm" variant="outline" onClick={() => onViewParticipants(session)}>
              <Users className="h-3 w-3 mr-1" />
              参加者
            </Button>
          )}
          {onEdit && (
            <Button size="sm" variant="outline" onClick={() => onEdit(session)}>
              <Edit className="h-3 w-3 mr-1" />
              編集
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="outline" onClick={() => onDelete(session)}>
              <Trash2 className="h-3 w-3 mr-1" />
              削除
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}