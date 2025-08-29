import { TaskStatus } from '@/features/tasks/types/task';
import { Clock, CheckCircle } from 'lucide-react';

// 選考段階とイベントの対応関係
export const stageEventMapping: Record<string, string> = {
  'エントリー': 'event-entry',
  '書類選考': 'event-document-screening',
  '会社説明会': 'event-company-info',
  '適性検査体験': 'event-aptitude-test',
  '職場見学': 'event-workplace-tour',
  '仕事体験': 'event-job-experience',
  '人事面接': 'event-individual-interview',
  '集団面接': 'event-group-interview',
  'CEOセミナー': 'event-ceo-seminar',
  '最終選考': 'event-final-selection',
  '内定面談': 'event-offer'
};

// 選考段階の順序を定義
export const stageOrder = [
  'エントリー',
  '書類選考', 
  '会社説明会',
  '適性検査体験',
  '職場見学',
  '仕事体験',
  '人事面接',
  '集団面接',
  'CEOセミナー',
  '最終選考',
  '内定面談'
];

/**
 * 次の選考段階を取得する
 */
export const getNextStage = (currentStage: string): string | null => {
  const currentIndex = stageOrder.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex === stageOrder.length - 1) {
    return null;
  }
  return stageOrder[currentIndex + 1];
};

/**
 * タスクステータスのアイコンを取得する
 */
export const getTaskStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case '完了':
      return <CheckCircle className="h-3 w-3 text-green-600" />;
    case '返信待ち':
      return <Clock className="h-3 w-3 text-yellow-600" />;
    case '提出待ち':
      return <Clock className="h-3 w-3 text-orange-600" />;
    case '未着手':
      return <Clock className="h-3 w-3 text-gray-400" />;
    default:
      return <Clock className="h-3 w-3 text-gray-400" />;
  }
};

/**
 * タスクステータスの色クラスを取得する
 */
export const getTaskStatusColor = (status: TaskStatus) => {
  switch (status) {
    case '完了':
      return 'bg-green-100 text-green-800';
    case '返信待ち':
      return 'bg-yellow-100 text-yellow-800';
    case '提出待ち':
      return 'bg-orange-100 text-orange-800';
    case '未着手':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

import { Event, EventSession } from '@/features/events/types/event';

/**
 * 選考段階に対応するイベントとセッションを取得する
 */
export const getStageSessionInfo = (
  stage: string, 
  events: Event[], 
  eventSessions: EventSession[]
) => {
  // 選考段階名でイベントを検索（安全なマッチング）
  const event = events.find(e => {
    // 完全一致を優先
    if (e.name === stage) return true;
    // 大文字小文字を無視した比較
    if (e.name.toLowerCase() === stage.toLowerCase()) return true;
    // 空白を除去した比較
    if (e.name.replace(/\s+/g, '') === stage.replace(/\s+/g, '')) return true;
    return false;
  });
  
  if (!event) {
    console.warn(`イベントが見つかりません: ${stage}`);
    return null;
  }

  // 該当するセッションを取得
  const sessions = eventSessions.filter(session => session.eventId === event.id);
  if (sessions.length === 0) return null;

  // 最新のセッションを返す（実際の実装では、応募者の参加予定セッションを特定する必要がある）
  return {
    event,
    session: sessions[0]
  };
};

/**
 * 選考段階に対応するイベントのセッション一覧を取得する
 */
export const getAvailableSessionsForStage = (
  stage: string, 
  events: Event[], 
  eventSessions: EventSession[]
) => {
  // 選考段階名でイベントを検索（安全なマッチング）
  const event = events.find(e => {
    // 完全一致を優先
    if (e.name === stage) return true;
    // 大文字小文字を無視した比較
    if (e.name.toLowerCase() === stage.toLowerCase()) return true;
    // 空白を除去した比較
    if (e.name.replace(/\s+/g, '') === stage.replace(/\s+/g, '')) return true;
    return false;
  });
  
  if (!event) {
    console.warn(`イベントが見つかりません: ${stage}`);
    return [];
  }

  // 該当するセッションを取得
  const sessions = eventSessions.filter(session => session.eventId === event.id);
  
  return sessions;
};
