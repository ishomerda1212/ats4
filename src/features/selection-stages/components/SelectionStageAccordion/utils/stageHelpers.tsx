import { Event } from '@/features/events/types/event';
import { 
  getStageGroupFromEvent, 
  requiresSessionFromEvent, 
  getEventColor,
  getEventDuration,
  getEventSessionTypes,
  getStageGroupDisplayName as getStageGroupDisplayNameFromConstants
} from '@/shared/utils/constants';
import { TaskStatus } from '@/features/tasks/types/task';
import { CheckCircle, Clock } from 'lucide-react';

// 段階の順序（後方互換性のため保持）
export const stageOrder = [
  'エントリー',
  '書類選考',
  '会社説明会',
  '適性検査',
  '適性検査体験',
  '職場見学',
  '仕事体験',
  '個別面接',
  '人事面接',
  '集団面接',
  '最終選考',
  'CEOセミナー',
  '内定面談',
  '不採用'
] as const;

/**
 * イベントから段階のセッション情報を取得
 */
export const getStageSessionInfo = (event: Event) => {
  const requiresSession = requiresSessionFromEvent(event);
  const sessionTypes = getEventSessionTypes(event);
  const estimatedDuration = getEventDuration(event);
  
  return {
    requiresSession,
    sessionTypes,
    estimatedDuration,
    hasMultipleSessionTypes: sessionTypes.length > 1
  };
};

/**
 * 段階グループ別にイベントを分類
 */
export const groupEventsByStageGroup = (events: Event[]): Record<string, Event[]> => {
  const groups: Record<string, Event[]> = {};
  
  events.forEach(event => {
    const stageGroup = getStageGroupFromEvent(event);
    if (!groups[stageGroup]) {
      groups[stageGroup] = [];
    }
    groups[stageGroup].push(event);
  });
  
  return groups;
};

/**
 * 段階グループの順序を取得
 */
export const getStageGroupOrder = (stageGroup: string): number => {
  const order: Record<string, number> = {
    'エントリー': 1,
    'インターンシップ': 2,
    '選考': 3,
    'その他': 4
  };
  
  return order[stageGroup] || 999;
};

/**
 * 段階グループでソート
 */
export const sortByStageGroup = (events: Event[]): Event[] => {
  return events.sort((a, b) => {
    const aGroup = getStageGroupFromEvent(a);
    const bGroup = getStageGroupFromEvent(b);
    const aOrder = getStageGroupOrder(aGroup);
    const bOrder = getStageGroupOrder(bGroup);
    
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    
    return a.sortOrder - b.sortOrder;
  });
};

/**
 * 段階グループの色を取得
 */
export const getStageGroupColor = (stageGroup: string): string => {
  const colors: Record<string, string> = {
    'エントリー': 'blue',
    'インターンシップ': 'green',
    '選考': 'purple',
    'その他': 'gray'
  };
  
  return colors[stageGroup] || 'blue';
};

/**
 * 段階グループの表示名を取得
 */
export const getStageGroupDisplayName = (stageGroup: string): string => {
  return getStageGroupDisplayNameFromConstants(stageGroup);
};

/**
 * イベントがアクティブかチェック
 */
export const isEventActive = (event: Event): boolean => {
  return event.stageConfig?.is_active !== false;
};

/**
 * アクティブなイベントのみを取得
 */
export const getActiveEvents = (events: Event[]): Event[] => {
  return events.filter(isEventActive);
};

/**
 * セッションが必要なイベントを取得
 */
export const getEventsRequiringSession = (events: Event[]): Event[] => {
  return events.filter(requiresSessionFromEvent);
};

/**
 * イベントの色クラスを取得
 */
export const getEventColorClass = (event: Event): string => {
  return getEventColor(event);
};

/**
 * タスクステータスの色クラスを取得
 */
export const getTaskStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case '完了':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case '返信待ち':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case '提出待ち':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    case '未着手':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

/**
 * タスクステータスのアイコンを取得
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
