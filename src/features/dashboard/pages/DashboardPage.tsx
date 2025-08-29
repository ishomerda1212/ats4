import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Video, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '@/features/events/hooks/useEvents';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { SessionListCard } from '@/shared/components/common/SessionListCard';

type SessionStatus = 'upcoming' | 'ongoing' | 'completed';

interface TodaySession {
  id: string;
  name: string;
  eventName: string;
  eventId: string;
  start: Date;
  end: Date;
  venue: string;
  format: string;
  maxParticipants?: number;
  currentParticipants: number;
  recruiter?: string;
  status: SessionStatus;
}

export function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | '対面' | 'オンライン'>('all');
  const { events, eventSessions, loading } = useEvents();

  const todaySessions = useMemo((): TodaySession[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return eventSessions
      .filter(session => {
        const sessionDate = new Date(session.start);
        return sessionDate >= today && sessionDate < tomorrow;
      })
      .map(session => {
        const event = events.find(e => e.id === session.eventId);
        const now = new Date();
        const startTime = new Date(session.start);
        const endTime = new Date(session.end);
        
        let status: SessionStatus = 'upcoming';
        if (now >= startTime && now <= endTime) {
          status = 'ongoing';
        } else if (now > endTime) {
          status = 'completed';
        }

        return {
          id: session.id,
          name: session.name,
          eventName: event?.name || '不明なイベント',
          eventId: session.eventId,
          start: startTime,
          end: endTime,
          venue: session.venue,
          format: session.format,
          maxParticipants: session.maxParticipants,
          currentParticipants: session.participants?.length || 0,
          recruiter: session.recruiter,
          status
        };
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [events, eventSessions]);

  // 共通コンポーネント用のセッションデータ
  const sessionListData = useMemo(() => {
    return todaySessions.map(session => ({
      id: session.id,
      name: session.name,
      eventName: session.eventName,
      eventId: session.eventId,
      start: session.start,
      venue: session.venue,
      format: session.format,
      currentParticipants: session.currentParticipants,
      maxParticipants: session.maxParticipants
    }));
  }, [todaySessions]);

  const filteredSessions = useMemo(() => {
    return todaySessions.filter(session => {
      const hour = session.start.getHours();
      
      // 時間フィルター
      if (timeFilter === 'morning' && (hour < 6 || hour >= 12)) return false;
      if (timeFilter === 'afternoon' && (hour < 12 || hour >= 18)) return false;
      if (timeFilter === 'evening' && (hour < 18 || hour >= 6)) return false;
      
      // 形式フィルター
      if (formatFilter !== 'all' && session.format !== formatFilter) return false;
      
      return true;
    });
  }, [todaySessions, timeFilter, formatFilter]);

  const getStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case 'upcoming':
        return <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">開始前</span>;
      case 'ongoing':
        return <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">進行中</span>;
      case 'completed':
        return <span className="inline-flex items-center rounded-md border border-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-500">終了</span>;
      default:
        return <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">開始前</span>;
    }
  };





  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">今日のセッション</h1>
            <p className="text-muted-foreground">
              {format(new Date(), 'yyyy年M月d日 (EEEE)', { locale: ja })}
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">今日のセッション</h1>
          <p className="text-muted-foreground">
            {format(new Date(), 'yyyy年M月d日 (EEEE)', { locale: ja })}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link to="/events/create">
              <Calendar className="h-4 w-4 mr-2" />
              セッション作成
            </Link>
          </Button>
        </div>
      </div>

      

      {/* フィルター */}
      <div className="flex flex-wrap gap-2">
        <div className="flex space-x-1">
          <Button
            variant={timeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('all')}
          >
            全て
          </Button>
          <Button
            variant={timeFilter === 'morning' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('morning')}
          >
            午前
          </Button>
          <Button
            variant={timeFilter === 'afternoon' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('afternoon')}
          >
            午後
          </Button>
          <Button
            variant={timeFilter === 'evening' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('evening')}
          >
            夜間
          </Button>
        </div>
        
        <div className="flex space-x-1">
          <Button
            variant={formatFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFormatFilter('all')}
          >
            全て
          </Button>
          <Button
            variant={formatFilter === '対面' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFormatFilter('対面')}
          >
            対面
          </Button>
          <Button
            variant={formatFilter === 'オンライン' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFormatFilter('オンライン')}
          >
            オンライン
          </Button>
        </div>
      </div>

      {/* セッション一覧 */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">今日のセッションはありません</p>
                <p className="text-muted-foreground">新しいセッションを作成してください</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <SessionListCard 
            sessions={sessionListData}
            layout="card"
            showEndTime={true}
          />
        )}
      </div>
    </div>
  );
}
