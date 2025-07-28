import React from 'react';
import { SessionFormData } from '../types/applicantForm';
import { formatTime } from '@/shared/utils/date';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface SessionCardProps {
  session: SessionFormData;
  response: 'participate' | 'not_participate' | 'pending';
  onResponseChange: (sessionId: string, status: 'participate' | 'not_participate' | 'pending') => void;
  canParticipate: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  response,
  onResponseChange,
  canParticipate
}) => {
  const isFullyBooked = session.maxParticipants && session.currentParticipants >= session.maxParticipants;
  
  const getParticipantStatusText = () => {
    if (!session.maxParticipants) {
      return `${session.currentParticipants}名`;
    }
    return `${session.currentParticipants}/${session.maxParticipants}名`;
  };

  const getParticipantStatusColor = () => {
    if (!session.maxParticipants) return 'bg-blue-100 text-blue-800';
    
    const ratio = session.currentParticipants / session.maxParticipants;
    if (ratio >= 1) return 'bg-red-100 text-red-800';
    if (ratio >= 0.8) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getDayOfWeek = (date: Date) => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[date.getDay()];
  };

  const formatSimpleDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayOfWeek = getDayOfWeek(date);
    return `${month}.${day}(${dayOfWeek})`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
      {/* 日時情報 */}
      <div className="space-y-3">
        {/* 日付 */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <span className="text-lg font-bold text-slate-900">
            {formatSimpleDate(session.startDate)}
          </span>
        </div>
        
        {/* 時間と会場 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-slate-600">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">
              {formatTime(session.startDate)} 〜 {formatTime(session.endDate)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-slate-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{session.venue}</span>
          </div>
        </div>
        
        {/* 予約人数 */}
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <Badge className={getParticipantStatusColor()}>
            {getParticipantStatusText()}
          </Badge>
          {isFullyBooked && (
            <Badge className="bg-red-100 text-red-800">満席</Badge>
          )}
        </div>
      </div>

      {/* ○✕ボタン */}
      <div className="flex items-center justify-center space-x-6 pt-2">
        {/* ○ボタン（参加） */}
        <button
          onClick={() => onResponseChange(session.sessionId, 'participate')}
          disabled={!canParticipate}
          className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-200 active:scale-95 ${
            response === 'participate'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg'
              : !canParticipate
              ? 'border-slate-300 text-slate-300 cursor-not-allowed'
              : 'border-green-500 text-green-500 hover:bg-green-50 active:bg-green-100'
          }`}
        >
          <span className="text-2xl font-bold">○</span>
        </button>

        {/* ✕ボタン（不参加） */}
        <button
          onClick={() => onResponseChange(session.sessionId, 'not_participate')}
          className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-200 active:scale-95 ${
            response === 'not_participate'
              ? 'bg-gradient-to-r from-red-500 to-pink-500 border-red-500 text-white shadow-lg'
              : 'border-red-500 text-red-500 hover:bg-red-50 active:bg-red-100'
          }`}
        >
          <span className="text-2xl font-bold">✕</span>
        </button>
      </div>
    </div>
  );
};