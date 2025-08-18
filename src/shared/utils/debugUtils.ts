// デバッグ用ユーティリティ関数

/**
 * ローカルストレージのデータをリセットしてモックデータを再読み込み
 */
export function resetLocalStorageData() {
  const keysToReset = [
    'events',
    'eventSessions', 
    'eventParticipants',
    'applicants',
    'applicantResponses'
  ];

  keysToReset.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log('ローカルストレージをリセットしました。ページを再読み込みしてください。');
}

/**
 * 現在のローカルストレージの状態をログ出力
 */
export function logLocalStorageState() {
  const keys = [
    'events',
    'eventSessions', 
    'eventParticipants',
    'applicants',
    'applicantResponses'
  ];

  console.log('=== ローカルストレージ状態 ===');
  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log(`${key}:`, parsed.length || 'データあり');
      } catch {
        console.log(`${key}: パースエラー`);
      }
    } else {
      console.log(`${key}: なし`);
    }
  });
}

/**
 * 特定のイベントとセッションのデータを確認
 */
export function checkEventSessionData(eventId: string, sessionId: string) {
  console.log('=== イベント・セッションデータ確認 ===');
  console.log('検索条件:', { eventId, sessionId });
  
  // イベントデータ確認
  const eventsData = localStorage.getItem('events');
  if (eventsData) {
    const events = JSON.parse(eventsData) as Array<{ id: string; name: string }>;
    console.log('全イベント:', events.map((e) => ({ id: e.id, name: e.name })));
    const event = events.find((e) => e.id === eventId);
    console.log('イベント:', event ? '見つかりました' : '見つかりません', event);
  } else {
    console.log('イベントデータ: ローカルストレージに存在しません');
  }

  // セッションデータ確認
  const sessionsData = localStorage.getItem('eventSessions');
  if (sessionsData) {
    const sessions = JSON.parse(sessionsData) as Array<{ id: string; eventId: string; name: string; start: unknown; end: unknown }>;
    console.log('全セッション:', sessions.map((s) => ({ id: s.id, eventId: s.eventId, name: s.name })));
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      console.log('セッション:', '見つかりました', session);
      console.log('start type:', typeof session.start, session.start);
      console.log('end type:', typeof session.end, session.end);
      console.log('start is Date:', session.start instanceof Date);
      console.log('end is Date:', session.end instanceof Date);
    } else {
      console.log('セッション:', '見つかりません');
    }
  } else {
    console.log('セッションデータ: ローカルストレージに存在しません');
  }

  // 参加者データ確認
  const participantsData = localStorage.getItem('eventParticipants');
  if (participantsData) {
    const participants = JSON.parse(participantsData) as Array<{ sessionId: string }>;
    const sessionParticipants = participants.filter((p) => p.sessionId === sessionId);
    console.log('参加者数:', sessionParticipants.length);
    console.log('参加者詳細:', sessionParticipants);
  } else {
    console.log('参加者データ: ローカルストレージに存在しません');
  }
}

/**
 * モックデータを強制的にローカルストレージに設定
 */
export function forceLoadMockData() {
  console.log('モックデータの強制読み込みは無効化されました。データベースから直接データを取得します。');
}

/**
 * 開発環境でのデバッグヘルパー
 */
export function setupDebugHelpers() {
  if (process.env.NODE_ENV === 'development') {
    // グローバルオブジェクトにデバッグ関数を追加
    (window as typeof window & { debugUtils: Record<string, unknown> }).debugUtils = {
      resetLocalStorageData,
      logLocalStorageState,
      checkEventSessionData,
      forceLoadMockData
    };

    console.log('デバッグヘルパーが利用可能です:');
    console.log('- window.debugUtils.resetLocalStorageData()');
    console.log('- window.debugUtils.logLocalStorageState()');
    console.log('- window.debugUtils.checkEventSessionData(eventId, sessionId)');
    console.log('- window.debugUtils.forceLoadMockData()');
  }
}

export const logWithTimestamp = (message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data);
};
