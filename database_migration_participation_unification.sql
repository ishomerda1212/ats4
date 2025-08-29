-- 参加状況データの一元化マイグレーション
-- このスクリプトは、event_participantsテーブルを拡張して参加状況を一元管理します

-- 1. event_participantsテーブルに必要なカラムを追加
ALTER TABLE event_participants 
ADD COLUMN IF NOT EXISTS stage_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS result VARCHAR(50),
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. 既存のevent_participantsレコードにstage_nameを設定
-- eventsテーブルからstage情報を取得して設定
UPDATE event_participants 
SET stage_name = (
  SELECT e.stage 
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
ALTER TABLE event_participants 
ADD CONSTRAINT IF NOT EXISTS unique_applicant_stage 
UNIQUE (applicant_id, stage_name);

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
INNER JOIN events e ON e.stage = sh.stage
INNER JOIN event_sessions es ON es.event_id = e.id
WHERE sh.session_id IS NOT NULL
ON CONFLICT (applicant_id, stage_name) DO NOTHING;

-- 6. selection_historyテーブルから参加状況関連のカラムを削除
-- （データ移行後に実行）
-- ALTER TABLE selection_history 
-- DROP COLUMN IF EXISTS participation_status,
-- DROP COLUMN IF EXISTS session_id;

-- 7. データ整合性チェック
-- 参加状況データが正しく設定されているか確認
SELECT 
  COUNT(*) as total_participants,
  COUNT(CASE WHEN stage_name IS NOT NULL THEN 1 END) as with_stage_name,
  COUNT(CASE WHEN stage_name IS NULL THEN 1 END) as without_stage_name
FROM event_participants;

-- 8. サンプルデータの確認
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
