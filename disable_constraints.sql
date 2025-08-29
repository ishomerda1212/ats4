-- 制約を一時的に無効化するSQL
-- このファイルは制約エラーを回避するために使用します

-- 1. event_participants_status_check制約を削除
ALTER TABLE event_participants 
DROP CONSTRAINT IF EXISTS event_participants_status_check;

-- 2. 他の関連する制約も確認して削除（必要に応じて）
-- 以下の制約が存在する場合は削除してください

-- 参加状況関連の制約
ALTER TABLE event_participants 
DROP CONSTRAINT IF EXISTS event_participants_result_check;

-- ステータス関連の制約
ALTER TABLE event_participants 
DROP CONSTRAINT IF EXISTS event_participants_stage_name_check;

-- 3. 制約が削除されたことを確認
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname LIKE '%event_participants%' 
   OR conname LIKE '%status%' 
   OR conname LIKE '%participation%';

-- 4. 現在のテーブル構造を確認
\d event_participants

-- 注意: この操作により、データの整合性チェックが行われなくなります
-- アプリケーション側で適切なバリデーションを実装してください
