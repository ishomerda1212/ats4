import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Eye, Video, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventSession } from '../types/event';
import { formatDateTime } from '@/shared/utils/date';
import { Badge } from '@/components/ui/badge';

interface EventSessionCardProps {
  session: EventSession;
  participantCount: number;
}

export function EventSessionCard({ 
  session, 
  participantCount
}: EventSessionCardProps) {
  // Googleカレンダー登録用URLを生成
  const generateGoogleCalendarUrl = () => {
    try {
      // console.log('Generating Google Calendar URL for session:', {
      //   sessionDate: session.sessionDate,
      //   startTime: session.startTime,
      //   endTime: session.endTime,
      //   name: session.name
      // });

      // sessionDateがDateオブジェクトでない場合は変換
      const sessionDate = session.sessionDate instanceof Date 
        ? session.sessionDate 
        : new Date(session.sessionDate);
      
      // 無効な日時の場合はエラーを返す
      if (isNaN(sessionDate.getTime())) {
        console.error('Invalid sessionDate:', session.sessionDate);
        return '#';
      }

      // startTimeとendTimeが文字列でない場合はエラーを返す
      if (typeof session.startTime !== 'string' || typeof session.endTime !== 'string') {
        console.error('Invalid time format:', { startTime: session.startTime, endTime: session.endTime });
        return '#';
      }
      
      // 時刻を解析
      const [startHour, startMinute] = session.startTime.split(':').map(Number);
      const [endHour, endMinute] = session.endTime.split(':').map(Number);
      
      if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
        console.error('Invalid time values:', { startTime: session.startTime, endTime: session.endTime });
        return '#';
      }
      
      // 開始日時と終了日時を構築
      const startDateTime = new Date(sessionDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);
      
      const endDateTime = new Date(sessionDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);
      
      console.log('Calculated date times:', {
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString()
      });
      
      // Googleカレンダー用のフォーマットに変換
      const startDate = startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endDate = endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: session.name,
        dates: `${startDate}/${endDate}`,
        details: `${session.notes || ''}\n\n会場: ${session.venue}\n開催形式: ${session.format}${session.zoomUrl ? `\nZOOM URL: ${session.zoomUrl}` : ''}`,
        location: session.venue,
      });

      const url = `https://www.google.com/calendar/render?${params.toString()}`;
      // console.log('Generated Google Calendar URL:', url);
      
      return url;
    } catch (error) {
      console.error('Error generating Google Calendar URL:', error, {
        session: session
      });
      return '#';
    }
  };

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 flex-1">
            {/* 日時 */}
            <div className="flex items-center space-x-2 min-w-[180px]">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatDateTime(session.sessionDate)}</span>
            </div>
            
            {/* 時間 */}
            <div className="flex items-center space-x-2 min-w-[120px]">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {session.startTime} - {session.endTime}
              </span>
            </div>
            
            {/* 開催形式 */}
            <div className="flex items-center space-x-2 min-w-[100px]">
              <Badge className={session.format === 'オンライン' ? 'bg-blue-100 text-blue-800' : session.format === 'ハイブリッド' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}>
                {session.format}
              </Badge>
            </div>
            
            {/* 場所 */}
            <div className="flex items-center space-x-2 min-w-[150px]">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{session.venue}</span>
            </div>
            
            {/* ZOOM URL */}
            {session.zoomUrl && (
              <div className="flex items-center space-x-2 min-w-[120px]">
                <Video className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={session.zoomUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center"
                >
                  ZOOM参加
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
            
            {/* 参加者数 */}
            <div className="flex items-center space-x-2 min-w-[80px]">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{participantCount}名</span>
            </div>
          </div>
          
          {/* アクションボタン */}
          <div className="flex items-center space-x-2 ml-4">
            <a 
              href={generateGoogleCalendarUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                カレンダー登録
              </Button>
            </a>
            <Link to={`/selection-stage/${session.eventId}/session/${session.id}`}>
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