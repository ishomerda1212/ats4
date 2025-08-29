-- 参加状況データの完全一元化マイグレーション
-- このスクリプトは、event_participantsテーブルを拡張して参加状況を完全に一元管理します

-- 1. event_participantsテーブルに必要なカラムを追加
DO $$ 
BEGIN
    -- stage_nameカラムが存在しない場合のみ追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_participants' 
        AND column_name = 'stage_name'
    ) THEN
        ALTER TABLE event_participants ADD COLUMN stage_name VARCHAR(255);
    END IF;
    
    -- resultカラムが存在しない場合のみ追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_participants' 
        AND column_name = 'result'
    ) THEN
        ALTER TABLE event_participants ADD COLUMN result VARCHAR(50);
    END IF;
    
    -- notesカラムが存在しない場合のみ追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_participants' 
        AND column_name = 'notes'
    ) THEN
        ALTER TABLE event_participants ADD COLUMN notes TEXT;
    END IF;
    
    -- event_idカラムが存在しない場合のみ追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_participants' 
        AND column_name = 'event_id'
    ) THEN
        ALTER TABLE event_participants ADD COLUMN event_id UUID;
    END IF;
END $$;

-- 2. 既存のevent_participantsレコードにstage_nameを設定
-- eventsテーブルからstage情報を取得して設定
UPDATE event_participants 
SET stage_name = (
  SELECT e.name 
  FROM events e 
  INNER JOIN event_sessions es ON e.id = es.event_id 
  WHERE es.id = event_participants.session_id
)
WHERE stage_name IS NULL;

-- 3. インデックスを追加してパフォーマンスを向上
CREATE INDEX IF NOT EXISTS idx_event_participants_applicant_stage 
ON event_participants(applicant_id, stage_name);

CREATE INDEX IF NOT EXISTS idx_event_participants_session_stage 
ON event_participants(session_id, stage_name);

-- 4. ユニーク制約を追加（応募者と段階の組み合わせで一意）
-- 既存の制約がある場合は削除してから追加
DO $$ 
BEGIN
    -- 既存の制約があるかチェック
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_applicant_stage' 
        AND table_name = 'event_participants'
    ) THEN
        -- 既存の制約を削除
        ALTER TABLE event_participants DROP CONSTRAINT unique_applicant_stage;
    END IF;
    
    -- 新しい制約を追加
    ALTER TABLE event_participants ADD CONSTRAINT unique_applicant_stage 
    UNIQUE (applicant_id, stage_name);
END $$;

-- 5. 既存のselection_historyテーブルから参加状況データを移行
-- （必要に応じて実行）
INSERT INTO event_participants (applicant_id, session_id, event_id, stage_name, status, created_at, updated_at)
SELECT 
  sh.applicant_id,
  es.id as session_id,
  e.id as event_id,
  sh.stage as stage_name,
  COALESCE(sh.status, '未定') as status,
  sh.created_at,
  sh.updated_at
FROM selection_history sh
INNER JOIN events e ON e.name = sh.stage
INNER JOIN event_sessions es ON es.event_id = e.id
WHERE sh.session_id IS NOT NULL
ON CONFLICT (applicant_id, stage_name) DO NOTHING;

-- 6. データ整合性チェック
-- 参加状況データが正しく設定されているか確認
SELECT 
  COUNT(*) as total_participants,
  COUNT(CASE WHEN stage_name IS NOT NULL THEN 1 END) as with_stage_name,
  COUNT(CASE WHEN stage_name IS NULL THEN 1 END) as without_stage_name
FROM event_participants;

-- 7. サンプルデータの確認
SELECT 
  ep.applicant_id,
  ep.stage_name,
  ep.status,
  a.name as applicant_name,
  e.name as event_name
FROM event_participants ep
INNER JOIN applicants a ON a.id = ep.applicant_id
INNER JOIN events e ON e.id = ep.event_id
LIMIT 10;

-- 8. 参加状況の初期データを設定（テスト用）
-- 既存の参加者にデフォルトの参加状況を設定
UPDATE event_participants 
SET status = '参加予定'
WHERE status IS NULL OR status = '';

-- 9. 最終確認
SELECT 
  'event_participants' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT applicant_id) as unique_applicants,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT stage_name) as unique_stages
FROM event_participants;
