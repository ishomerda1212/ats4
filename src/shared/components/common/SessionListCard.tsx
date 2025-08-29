import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users, Video, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDateTime } from '@/shared/utils/date';
import { EventSession } from '@/features/events/types/event';

interface SessionListCardProps {
  sessions: Array<{
    id: string;
    name: string;
    eventName: string;
    eventId: string;
    start: Date;
    venue: string;
    format: string;
    currentParticipants: number;
    maxParticipants?: number;
  }>;
  layout?: 'list' | 'card';
  showEndTime?: boolean;
  end?: Date;
}

export function SessionListCard({ 
  sessions, 
  layout = 'list',
  showEndTime = false,
  end
}: SessionListCardProps) {
  if (layout === 'list') {
    return (
      <div className="space-y-3">
        {sessions.map((session) => (
          <Link 
            key={session.id} 
            to={`/selection-stage/${session.eventId}/session/${session.id}`}
            className="block"
          >
            <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer hover:bg-gray-50">
              <div className="flex items-center space-x-6 flex-1">
                {/* 選考段階名 */}
                <div className="flex items-center space-x-2 min-w-[200px]">
                  <span className="font-medium text-sm">{session.eventName}</span>
                </div>
                
                {/* セッション名 */}
                <div className="flex items-center space-x-2 min-w-[150px]">
                  <span className="text-sm">{session.name}</span>
                </div>
                
                {/* 開始日時 */}
                <div className="flex items-center space-x-2 min-w-[180px]">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatDateTime(session.start)}</span>
                </div>
                
                {/* 場所 */}
                <div className="flex items-center space-x-2 min-w-[150px]">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{session.venue || '未設定'}</span>
                </div>
                
                {/* 開催形式 */}
                <div className="flex items-center space-x-2 min-w-[100px]">
                  {session.format === 'オンライン' ? (
                    <Video className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground">{session.format}</span>
                </div>
                
                {/* 予約者数 */}
                <div className="flex items-center space-x-2 min-w-[80px]">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {session.currentParticipants}
                    {session.maxParticipants && `/${session.maxParticipants}`}
                    名
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  // card layout
  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Link 
          key={session.id} 
          to={`/selection-stage/${session.eventId}/session/${session.id}`}
          className="block"
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatDateTime(session.start)}
                        {showEndTime && end && ` - ${formatDateTime(end)}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4 mb-1 sm:mb-0">
                      <span className="font-medium text-foreground">{session.name}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{session.eventName}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{session.venue || '未設定'}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center space-x-1">
                        {session.format === 'オンライン' ? (
                          <Video className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        <span>{session.format}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>
                          {session.currentParticipants}
                          {session.maxParticipants && `/${session.maxParticipants}`}
                          名
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
