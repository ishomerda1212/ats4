import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { Event, EventSession, EventParticipant } from '@/features/events/types/event';
import { Applicant } from '@/features/applicants/types/applicant';
import { ApplicantEventResponse, SessionResponse, EventFormData, SessionFormData } from '../types/applicantForm';
import { generateId } from '@/shared/utils/date';

export const useApplicantForm = (applicantId: string, eventId: string) => {
  const [events] = useLocalStorage<Event[]>('events', []);
  const [eventSessions] = useLocalStorage<EventSession[]>('eventSessions', []);
  const [eventParticipants, setEventParticipants] = useLocalStorage<EventParticipant[]>('eventParticipants', []);
  const [applicants] = useLocalStorage<Applicant[]>('applicants', []);
  const [applicantResponses, setApplicantResponses] = useLocalStorage<ApplicantEventResponse[]>('applicantResponses', []);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventData, setEventData] = useState<EventFormData | null>(null);
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [responses, setResponses] = useState<Record<string, 'participate' | 'not_participate' | 'pending'>>({});

  useEffect(() => {
    loadEventAndApplicantData();
  }, [applicantId, eventId]);

  const loadEventAndApplicantData = () => {
    try {
      setLoading(true);
      
      // サンプルモードかどうかを判定
      const isSampleMode = applicantId === 'sample';
      
      // 応募者データを取得
      let foundApplicant: Applicant | null = null;
      
      if (isSampleMode) {
        // サンプルモードの場合は仮の応募者データを作成
        foundApplicant = {
          id: 'sample',
          source: 'その他',
          name: 'サンプル応募者',
          nameKana: 'サンプル オウボシャ',
          gender: '男性',
          schoolName: 'サンプル大学',
          faculty: 'サンプル学部',
          department: 'サンプル学科',
          graduationYear: 2025,
          address: 'サンプル県サンプル市',
          phone: '090-0000-0000',
          email: 'sample@example.com',
          currentStage: 'エントリー',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      } else {
        foundApplicant = applicants.find(a => a.id === applicantId) || null;
      }
      
      if (!foundApplicant) {
        setError('応募者が見つかりません');
        return;
      }
      setApplicant(foundApplicant);

      // イベントデータを取得
      let event = events.find(e => e.id === eventId);
      
      if (!event) {
        if (isSampleMode) {
          // サンプルモードの場合は仮のイベントデータを作成
          event = {
            id: eventId,
            name: 'サンプルイベント',
            description: 'これはサンプルイベントです。実際のイベントデータが存在しない場合に表示されます。',
            stage: '会社説明会',
            createdAt: new Date(),
            updatedAt: new Date()
          };
        } else {
          setError('イベントが見つかりません');
          return;
        }
      }

      // イベントセッションを取得
      let sessions = eventSessions.filter(s => s.eventId === eventId);
      
      // サンプルモードでセッションが存在しない場合は仮のセッションを作成
      if (isSampleMode && sessions.length === 0) {
        sessions = [
          {
            id: 'sample-session-1',
            eventId: eventId,
            name: 'サンプルセッション 第1回',
            start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1週間後
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2時間後
            venue: 'サンプル会場A',
            maxParticipants: 20,
            participants: [],
            recruiter: 'サンプル担当者',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'sample-session-2',
            eventId: eventId,
            name: 'サンプルセッション 第2回',
            start: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2週間後
            end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2時間後
            venue: 'サンプル会場B',
            maxParticipants: 15,
            participants: [],
            recruiter: 'サンプル担当者',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
      }
      
      // 各セッションの現在の参加者数を計算
      const sessionFormData: SessionFormData[] = sessions.map(session => {
        const participantCount = eventParticipants.filter(
          p => p.eventId === session.id && (p.status === '参加' || p.status === '申込')
        ).length;

        return {
          sessionId: session.id,
          sessionName: session.name,
          startDate: session.start,
          endDate: session.end,
          venue: session.venue,
          maxParticipants: session.maxParticipants,
          currentParticipants: participantCount,
          recruiter: session.recruiter
        };
      });

      setEventData({
        eventName: event.name,
        eventDescription: event.description,
        stage: event.stage,
        sessions: sessionFormData
      });

      // 既存の回答を読み込み
      const existingResponse = applicantResponses.find(
        r => r.applicantId === applicantId && r.eventId === eventId
      );
      
      if (existingResponse) {
        const responseMap: Record<string, 'participate' | 'not_participate' | 'pending'> = {};
        existingResponse.sessionResponses.forEach(sr => {
          responseMap[sr.sessionId] = sr.status;
        });
        setResponses(responseMap);
      } else {
        // デフォルトは保留状態
        const defaultResponses: Record<string, 'participate' | 'not_participate' | 'pending'> = {};
        sessions.forEach(session => {
          defaultResponses[session.id] = 'pending';
        });
        setResponses(defaultResponses);
      }

    } catch (err) {
      setError('データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const updateResponse = (sessionId: string, status: 'participate' | 'not_participate' | 'pending') => {
    setResponses(prev => ({
      ...prev,
      [sessionId]: status
    }));
  };

  const submitResponse = async () => {
    try {
      if (!eventData || !applicant) {
        throw new Error('必要なデータが不足しています');
      }

      // サンプルモードの場合は送信を無効化
      if (applicantId === 'sample') {
        return { success: true, message: 'サンプルモードです。実際の送信は行われません。' };
      }

      // セッション回答を作成
      const sessionResponses: SessionResponse[] = Object.entries(responses).map(([sessionId, status]) => ({
        sessionId,
        status
      }));

      // 応募者の回答を保存
      const newResponse: ApplicantEventResponse = {
        applicantId,
        eventId,
        sessionResponses,
        submittedAt: new Date()
      };

      // 既存の回答を更新または新規追加
      const updatedResponses = applicantResponses.filter(
        r => !(r.applicantId === applicantId && r.eventId === eventId)
      );
      updatedResponses.push(newResponse);
      setApplicantResponses(updatedResponses);

      // EventParticipantを更新
      const updatedParticipants = [...eventParticipants];
      
      sessionResponses.forEach(sessionResponse => {
        // 既存の参加情報を削除
        const existingIndex = updatedParticipants.findIndex(
          p => p.applicantId === applicantId && p.eventId === sessionResponse.sessionId
        );
        
        if (existingIndex >= 0) {
          updatedParticipants.splice(existingIndex, 1);
        }

        // 新しい参加情報を追加（参加の場合のみ）
        if (sessionResponse.status === 'participate') {
          const newParticipant: EventParticipant = {
            id: generateId(),
            eventId: sessionResponse.sessionId,
            applicantId,
            status: '申込',
            joinedAt: new Date(),
            updatedAt: new Date(),
            createdAt: new Date()
          };
          updatedParticipants.push(newParticipant);
        }
      });

      setEventParticipants(updatedParticipants);
      
      return { success: true, message: '回答を送信しました' };
    } catch (err) {
      return { success: false, message: '送信に失敗しました' };
    }
  };

  const canParticipate = (sessionId: string): boolean => {
    if (!eventData) return false;
    
    const session = eventData.sessions.find(s => s.sessionId === sessionId);
    if (!session) return false;
    
    // 上限が設定されていない場合は参加可能
    if (!session.maxParticipants) return true;
    
    // 現在の参加者数が上限未満の場合は参加可能
    return session.currentParticipants < session.maxParticipants;
  };

  return {
    loading,
    error,
    eventData,
    applicant,
    responses,
    updateResponse,
    submitResponse,
    canParticipate,
    reload: loadEventAndApplicantData
  };
};