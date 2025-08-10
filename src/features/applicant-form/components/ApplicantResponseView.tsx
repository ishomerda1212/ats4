import React from 'react';
import { ApplicantEventResponse } from '../types/applicantForm';
import { EventFormData } from '../types/applicantForm';
import { Applicant } from '@/features/applicants/types/applicant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import { formatTime } from '@/shared/utils/date';

interface ApplicantResponseViewProps {
  applicant: Applicant;
  eventData: EventFormData;
  response: ApplicantEventResponse;
  onBack?: () => void;
}

export const ApplicantResponseView: React.FC<ApplicantResponseViewProps> = ({
  applicant,
  eventData,
  response,
  onBack
}) => {
  const getStatusIcon = (status: 'participate' | 'not_participate' | 'pending') => {
    switch (status) {
      case 'participate':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'not_participate':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: 'participate' | 'not_participate' | 'pending') => {
    switch (status) {
      case 'participate':
        return '参加';
      case 'not_participate':
        return '不参加';
      case 'pending':
        return '保留';
      default:
        return '未回答';
    }
  };

  const getStatusBadgeColor = (status: 'participate' | 'not_participate' | 'pending') => {
    switch (status) {
      case 'participate':
        return 'bg-green-100 text-green-800';
      case 'not_participate':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-700 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-slate-900 truncate">回答確認</h1>
                <p className="text-sm text-slate-600">{applicant.name}様</p>
              </div>
            </div>
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                戻る
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-4 space-y-4">
        {/* イベント情報 */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-bold text-slate-900">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              イベント情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold text-slate-900">{eventData.eventName}</h3>
              <p className="text-sm text-slate-600">{eventData.stage}</p>
            </div>
            {eventData.eventDescription && (
              <p className="text-slate-700 text-sm leading-relaxed">{eventData.eventDescription}</p>
            )}
          </CardContent>
        </Card>

        {/* 回答内容 */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-bold text-slate-900">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              回答内容
            </CardTitle>
            <p className="text-sm text-slate-600">
              送信日時: {response.submittedAt.toLocaleString('ja-JP')}
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-3">
              {response.sessionResponses.map((sessionResponse) => {
                const session = eventData.sessions.find(s => s.sessionId === sessionResponse.sessionId);
                if (!session) return null;

                return (
                  <div key={sessionResponse.sessionId} className="p-4 border-b border-slate-100 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* 日時情報 */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="font-semibold text-slate-900">
                              {formatSimpleDate(session.startDate)}
                            </span>
                          </div>
                          
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
                      </div>
                      
                      {/* 回答ステータス */}
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(sessionResponse.status)}
                        <Badge className={getStatusBadgeColor(sessionResponse.status)}>
                          {getStatusText(sessionResponse.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 応募者情報 */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-slate-900">応募者情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-600">氏名:</span>
                <span className="ml-2 font-medium">{applicant.name}</span>
              </div>
              <div>
                <span className="text-slate-600">フリガナ:</span>
                <span className="ml-2 font-medium">{applicant.nameKana}</span>
              </div>
              <div>
                <span className="text-slate-600">学校名:</span>
                <span className="ml-2 font-medium">{applicant.schoolName}</span>
              </div>
              <div>
                <span className="text-slate-600">学部・学科:</span>
                <span className="ml-2 font-medium">{applicant.faculty} {applicant.department}</span>
              </div>
              <div>
                <span className="text-slate-600">メールアドレス:</span>
                <span className="ml-2 font-medium">{applicant.email}</span>
              </div>
              <div>
                <span className="text-slate-600">電話番号:</span>
                <span className="ml-2 font-medium">{applicant.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 完了メッセージ */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">回答を送信しました</h3>
            <p className="text-green-700 text-sm">
              ご回答ありがとうございました。後日、詳細なご案内をお送りいたします。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};