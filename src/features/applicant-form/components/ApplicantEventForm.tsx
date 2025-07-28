import React, { useState } from 'react';
import { useApplicantForm } from '../hooks/useApplicantForm';
import { SessionCard } from './SessionCard';
import { ApplicantFormProps } from '../types/applicantForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Building2, User, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export const ApplicantEventForm: React.FC<ApplicantFormProps> = ({ 
  applicantId, 
  eventId 
}) => {
  const {
    loading,
    error,
    eventData,
    applicant,
    responses,
    updateResponse,
    submitResponse,
    canParticipate
  } = useApplicantForm(applicantId, eventId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const result = await submitResponse();
      setSubmitMessage({
        type: result.success ? 'success' : 'error',
        text: result.message
      });
    } catch (err) {
      setSubmitMessage({
        type: 'error',
        text: '送信中にエラーが発生しました'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAllResponses = () => {
    if (!eventData) return false;
    return eventData.sessions.every(session => 
      responses[session.sessionId] && responses[session.sessionId] !== 'pending'
    );
  };

  const getParticipatingSessionsCount = () => {
    return Object.values(responses).filter(response => response === 'participate').length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-red-500 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">エラー</h2>
            <p className="text-slate-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!eventData || !applicant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-slate-400 bg-slate-50 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">データが見つかりません</h2>
            <p className="text-slate-600 text-sm">イベントまたは応募者の情報が見つかりませんでした。</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ヘッダー - 固定 */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-slate-900 truncate">{eventData.eventName}</h1>
              <p className="text-sm text-slate-600">{applicant.name}様</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              {eventData.stage}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* イベント概要 */}
        {eventData.eventDescription && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900">イベント概要</h3>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{eventData.eventDescription}</p>
            </CardContent>
          </Card>
        )}

        {/* セッション一覧 */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-bold text-slate-900">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              開催日程
            </CardTitle>
            <p className="text-slate-600 text-sm">ご都合の良い日程をお選びください</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              {eventData.sessions.map((session, index) => (
                <div key={session.sessionId} className="px-4 pb-4 last:pb-0">
                  <SessionCard
                    session={session}
                    response={responses[session.sessionId] || 'pending'}
                    onResponseChange={updateResponse}
                    canParticipate={canParticipate(session.sessionId)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 送信ボタン - 固定 */}
        <div className="sticky bottom-0 z-10 bg-white/90 backdrop-blur-md border-t border-slate-200 -mx-4 px-4 py-4">
          {submitMessage && (
            <div className={`mb-4 p-3 rounded-lg border ${
              submitMessage.type === 'success' 
                ? 'bg-green-50 text-green-800 border-green-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              <div className="flex items-center">
                {submitMessage.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{submitMessage.text}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xs text-slate-600 text-center">
              {applicantId === 'sample' 
                ? 'サンプルモードです。実際の送信は行われません。'
                : hasAllResponses() 
                  ? '全ての日程について回答済みです' 
                  : '保留の日程があります。後で変更することも可能です。'
              }
            </p>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
              className={`w-full h-14 text-base font-semibold rounded-xl ${
                isSubmitting
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : applicantId === 'sample'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  送信中...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  {applicantId === 'sample' ? 'サンプル送信' : '回答を送信'}
                  <CheckCircle className="w-5 h-5 ml-2" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};