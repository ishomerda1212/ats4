import { Event } from '@/features/events/types/event';

/**
 * 段階グループ別にイベントを分類
 */
export const groupEventsByStageGroup = (events: Event[]): Record<string, Event[]> => {
  const groups: Record<string, Event[]> = {};
  
  events.forEach(event => {
    const stageGroup = event.stageConfig?.stage_group || 'その他';
    if (!groups[stageGroup]) {
      groups[stageGroup] = [];
    }
    groups[stageGroup].push(event);
  });
  
  return groups;
};

/**
 * セッションが必要なイベントを取得
 */
export const getEventsRequiringSession = (events: Event[]): Event[] => {
  return events.filter(event => event.stageConfig?.requires_session === true);
};

/**
 * アクティブなイベントを取得
 */
export const getActiveEvents = (events: Event[]): Event[] => {
  return events.filter(event => event.stageConfig?.is_active !== false);
};

/**
 * 段階グループ一覧を取得
 */
export const getStageGroups = (events: Event[]): string[] => {
  const stageGroups = events
    .filter(event => event.stageConfig?.is_active !== false)
    .map(event => event.stageConfig?.stage_group)
    .filter((group): group is string => !!group);
  
  return [...new Set(stageGroups)];
};

/**
 * イベントの色スキームを取得
 */
export const getEventColorScheme = (event: Event): string => {
  return event.stageConfig?.color_scheme || 'blue';
};

/**
 * イベントの推定所要時間を取得
 */
export const getEventEstimatedDuration = (event: Event): number => {
  return event.stageConfig?.estimated_duration || 60;
};

/**
 * イベントのセッションタイプを取得
 */
export const getEventSessionTypes = (event: Event): string[] => {
  return event.stageConfig?.session_types || [];
};

/**
 * 段階グループの表示名を取得
 */
export const getStageGroupDisplayName = (stageGroup: string): string => {
  const displayNames: Record<string, string> = {
    'エントリー': 'エントリー',
    'インターンシップ': 'インターンシップ',
    '選考': '選考',
    'その他': 'その他'
  };
  
  return displayNames[stageGroup] || stageGroup;
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
 * イベントがセッションを必要とするかチェック
 */
export const requiresSession = (event: Event): boolean => {
  return event.stageConfig?.requires_session === true;
};

/**
 * イベントがアクティブかチェック
 */
export const isEventActive = (event: Event): boolean => {
  return event.stageConfig?.is_active !== false;
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
    const aGroup = a.stageConfig?.stage_group || 'その他';
    const bGroup = b.stageConfig?.stage_group || 'その他';
    const aOrder = getStageGroupOrder(aGroup);
    const bOrder = getStageGroupOrder(bGroup);
    
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    
    return a.sortOrder - b.sortOrder;
  });
};
