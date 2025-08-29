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
 * 選考履歴とセッション詳細ページのデータ不整合を調査
 */
export async function investigateParticipationDataMismatch(applicantId: string, stageName: string, sessionId?: string) {
  console.log('=== 参加状況データ不整合調査 ===');
  console.log('調査条件:', { applicantId, stageName, sessionId });

  try {
    // UnifiedParticipationDataAccessを使用したデータ取得
    const { UnifiedParticipationDataAccess } = await import('@/lib/dataAccess/unifiedParticipationDataAccess');
    
    // 1. 選考履歴で使用されるデータアクセス方法
    console.log('\n1. 選考履歴のデータアクセス方法:');
    console.log('UnifiedParticipationDataAccess.getApplicantParticipationByStage()');
    
    const stageParticipation = await UnifiedParticipationDataAccess.getApplicantParticipationByStage(applicantId, stageName);
    console.log('段階別参加状況:', stageParticipation);
    
    // 2. セッション詳細で使用されるデータアクセス方法
    if (sessionId) {
      console.log('\n2. セッション詳細のデータアクセス方法:');
      console.log('UnifiedParticipationDataAccess.getSessionParticipants()');
      
      const sessionParticipants = await UnifiedParticipationDataAccess.getSessionParticipants(sessionId);
      console.log('セッション参加者一覧:', sessionParticipants);
      
      // 特定の応募者のセッション参加状況を抽出
      const applicantSessionParticipation = sessionParticipants.find(p => p.applicantId === applicantId);
      console.log('応募者のセッション参加状況:', applicantSessionParticipation);
      
      // 3. データの比較
      console.log('\n3. データ比較:');
      console.log('段階別参加状況のステータス:', stageParticipation?.status);
      console.log('セッション参加状況のステータス:', applicantSessionParticipation?.status);
      console.log('ステータス一致:', stageParticipation?.status === applicantSessionParticipation?.status);
      
      if (stageParticipation?.status !== applicantSessionParticipation?.status) {
        console.log('❌ データ不整合を検出しました！');
        console.log('選考履歴:', stageParticipation?.status);
        console.log('セッション詳細:', applicantSessionParticipation?.status);
      } else {
        console.log('✅ データは一致しています');
      }
    }
    
    // 4. データベースの生データを確認
    console.log('\n4. データベースの生データ確認:');
    const { supabase } = await import('@/lib/supabase');
    
    // event_participantsテーブルの全データを確認
    const { data: allParticipants, error: allError } = await supabase
      .from('event_participants')
      .select('*')
      .eq('applicant_id', applicantId);
    
    if (allError) {
      console.error('データベースエラー:', allError);
    } else {
      console.log('応募者の全参加データ:', allParticipants);
      
      // 特定段階のデータを抽出
      const stageData = allParticipants?.filter(p => p.stage_name === stageName);
      console.log('特定段階のデータ:', stageData);
      
      // 特定セッションのデータを抽出
      if (sessionId) {
        const sessionData = allParticipants?.filter(p => p.session_id === sessionId);
        console.log('特定セッションのデータ:', sessionData);
      }
    }
    
  } catch (error) {
    console.error('調査中にエラーが発生しました:', error);
  }
}

/**
 * 特定の応募者の詳細データを調査
 */
export async function investigateApplicantData(applicantId: string) {
  console.log('=== 応募者データ詳細調査 ===');
  console.log('応募者ID:', applicantId);

  try {
    const { supabase } = await import('@/lib/supabase');
    
    // 1. 応募者基本情報
    const { data: applicant, error: applicantError } = await supabase
      .from('applicants')
      .select('*')
      .eq('id', applicantId)
      .single();
    
    if (applicantError) {
      console.error('応募者データ取得エラー:', applicantError);
    } else {
      console.log('応募者基本情報:', applicant);
    }
    
    // 2. 選考履歴
    const { data: selectionHistory, error: historyError } = await supabase
      .from('selection_histories')
      .select('*')
      .eq('applicant_id', applicantId)
      .order('created_at', { ascending: true });
    
    if (historyError) {
      console.error('選考履歴取得エラー:', historyError);
    } else {
      console.log('選考履歴:', selectionHistory);
    }
    
    // 3. イベント参加状況
    const { data: eventParticipants, error: participantsError } = await supabase
      .from('event_participants')
      .select('*')
      .eq('applicant_id', applicantId)
      .order('created_at', { ascending: true });
    
    if (participantsError) {
      console.error('イベント参加状況取得エラー:', participantsError);
    } else {
      console.log('イベント参加状況:', eventParticipants);
    }
    
  } catch (error) {
    console.error('調査中にエラーが発生しました:', error);
  }
}

/**
 * 画像の応募者「馮」のデータを調査（簡単版）
 */
export async function investigateFengData() {
  console.log('=== 馮さんのデータ調査 ===');
  
  try {
    const { supabase } = await import('@/lib/supabase');
    
    // 1. 応募者「馮」を検索
    const { data: applicants, error: applicantError } = await supabase
      .from('applicants')
      .select('*')
      .ilike('name', '%馮%');
    
    if (applicantError) {
      console.error('応募者検索エラー:', applicantError);
      return;
    }
    
    console.log('馮さんが見つかった応募者:', applicants);
    
    if (applicants && applicants.length > 0) {
      const feng = applicants[0];
      console.log('調査対象の応募者:', feng);
      
      // 2. 会社説明会の参加状況を調査
      const { data: companyInfoParticipation, error: participationError } = await supabase
        .from('event_participants')
        .select('*')
        .eq('applicant_id', feng.id)
        .eq('stage_name', '会社説明会');
      
      if (participationError) {
        console.error('参加状況取得エラー:', participationError);
      } else {
        console.log('会社説明会の参加状況:', companyInfoParticipation);
      }
      
      // 3. 選考履歴を確認
      const { data: selectionHistory, error: historyError } = await supabase
        .from('selection_histories')
        .select('*')
        .eq('applicant_id', feng.id)
        .eq('stage', '会社説明会');
      
      if (historyError) {
        console.error('選考履歴取得エラー:', historyError);
      } else {
        console.log('会社説明会の選考履歴:', selectionHistory);
      }
      
      // 4. セッション情報を確認
      if (companyInfoParticipation && companyInfoParticipation.length > 0) {
        const sessionId = companyInfoParticipation[0].session_id;
        console.log('セッションID:', sessionId);
        
        const { data: sessionParticipants, error: sessionError } = await supabase
          .from('event_participants')
          .select('*')
          .eq('session_id', sessionId);
        
        if (sessionError) {
          console.error('セッション参加者取得エラー:', sessionError);
        } else {
          console.log('セッション参加者一覧:', sessionParticipants);
          
          // 馮さんのセッション参加状況を抽出
          const fengSessionParticipation = sessionParticipants.find(p => p.applicant_id === feng.id);
          console.log('馮さんのセッション参加状況:', fengSessionParticipation);
        }
      }
    } else {
      console.log('馮さんが見つかりませんでした');
    }
    
  } catch (error) {
    console.error('調査中にエラーが発生しました:', error);
  }
}

/**
 * データ比較ツール - 選考履歴とセッション詳細のデータを比較
 */
export async function compareParticipationData(applicantId: string, stageName: string) {
  console.log('=== データ比較ツール ===');
  console.log('比較条件:', { applicantId, stageName });

  try {
    const { UnifiedParticipationDataAccess } = await import('@/lib/dataAccess/unifiedParticipationDataAccess');
    const { supabase } = await import('@/lib/supabase');

    // 1. 選考履歴のデータアクセス方法で取得
    console.log('\n1. 選考履歴のデータアクセス方法:');
    const stageParticipation = await UnifiedParticipationDataAccess.getApplicantParticipationByStage(applicantId, stageName);
    console.log('段階別参加状況:', stageParticipation);

    // 2. セッション詳細のデータアクセス方法で取得
    console.log('\n2. セッション詳細のデータアクセス方法:');
    let sessionParticipants: any[] = [];
    if (stageParticipation?.sessionId) {
      sessionParticipants = await UnifiedParticipationDataAccess.getSessionParticipants(stageParticipation.sessionId);
      const applicantSessionParticipation = sessionParticipants.find(p => p.applicantId === applicantId);
      console.log('セッション参加状況:', applicantSessionParticipation);
    } else {
      console.log('セッションIDが見つかりません');
    }

    // 3. データベースの生データを確認
    console.log('\n3. データベースの生データ:');
    const { data: allParticipants, error } = await supabase
      .from('event_participants')
      .select('*')
      .eq('applicant_id', applicantId)
      .eq('stage_name', stageName);

    if (error) {
      console.error('データベースエラー:', error);
    } else {
      console.log('生データ:', allParticipants);
    }

    // 4. 比較結果
    console.log('\n4. 比較結果:');
    const stageStatus = stageParticipation?.status;
    const sessionStatus = sessionParticipants.find(p => p.applicantId === applicantId)?.status;
    
    console.log('選考履歴のステータス:', stageStatus);
    console.log('セッション詳細のステータス:', sessionStatus);
    console.log('一致:', stageStatus === sessionStatus);

    if (stageStatus !== sessionStatus) {
      console.log('❌ データ不整合を検出しました！');
      console.log('選考履歴:', stageStatus);
      console.log('セッション詳細:', sessionStatus);
    } else {
      console.log('✅ データは一致しています');
    }

  } catch (error) {
    console.error('比較中にエラーが発生しました:', error);
  }
}

/**
 * リアルタイムデータ監視ツール
 */
export function startDataMonitoring(applicantId: string, stageName: string, intervalMs: number = 5000) {
  console.log('=== リアルタイムデータ監視開始 ===');
  console.log('監視条件:', { applicantId, stageName, intervalMs });

  const intervalId = setInterval(async () => {
    try {
      await compareParticipationData(applicantId, stageName);
      console.log('--- 監視更新 ---');
    } catch (error) {
      console.error('監視中にエラーが発生しました:', error);
    }
  }, intervalMs);

  // 監視停止用の関数を返す
  return () => {
    clearInterval(intervalId);
    console.log('=== リアルタイムデータ監視停止 ===');
  };
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
      forceLoadMockData,
      investigateParticipationDataMismatch,
      investigateApplicantData,
      investigateFengData,
      compareParticipationData,
      startDataMonitoring
    };

    console.log('デバッグヘルパーが利用可能です:');
    console.log('- window.debugUtils.resetLocalStorageData()');
    console.log('- window.debugUtils.logLocalStorageState()');
    console.log('- window.debugUtils.checkEventSessionData(eventId, sessionId)');
    console.log('- window.debugUtils.forceLoadMockData()');
    console.log('- window.debugUtils.investigateParticipationDataMismatch(applicantId, stageName, sessionId?)');
    console.log('- window.debugUtils.investigateApplicantData(applicantId)');
    console.log('- window.debugUtils.investigateFengData()');
    console.log('- window.debugUtils.compareParticipationData(applicantId, stageName)');
    console.log('- window.debugUtils.startDataMonitoring(applicantId, stageName, intervalMs)');
  }
}

export const logWithTimestamp = (message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data);
};
