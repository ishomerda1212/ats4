-- 参加状況データの詳細調査クエリ

-- 1. event_participantsテーブルの基本統計
SELECT 
  'event_participants基本統計' as info,
  COUNT(*) as total_records,
  COUNT(DISTINCT applicant_id) as unique_applicants,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT stage_name) as unique_stages,
  COUNT(DISTINCT event_id) as unique_events
FROM event_participants;

-- 2. stage_nameの分布確認
SELECT 
  'stage_name分布' as info,
  stage_name,
  COUNT(*) as count,
  COUNT(DISTINCT applicant_id) as unique_applicants
FROM event_participants 
WHERE stage_name IS NOT NULL
GROUP BY stage_name
ORDER BY count DESC;

-- 3. statusの分布確認
SELECT 
  'status分布' as info,
  status,
  COUNT(*) as count
FROM event_participants 
GROUP BY status
ORDER BY count DESC;

-- 4. 重複データの確認（applicant_id + stage_name）
SELECT 
  '重複データ確認' as info,
  applicant_id,
  stage_name,
  COUNT(*) as duplicate_count
FROM event_participants 
WHERE stage_name IS NOT NULL
GROUP BY applicant_id, stage_name
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- 5. データの整合性チェック（session_id vs stage_name）
SELECT 
  'session_id vs stage_name整合性' as info,
  ep.session_id,
  ep.stage_name,
  es.name as session_name,
  e.name as event_name,
  COUNT(*) as participant_count
FROM event_participants ep
LEFT JOIN event_sessions es ON es.id = ep.session_id
LEFT JOIN events e ON e.id = ep.event_id
WHERE ep.stage_name IS NOT NULL
GROUP BY ep.session_id, ep.stage_name, es.name, e.name
ORDER BY ep.session_id;

-- 6. 応募者別の参加状況サンプル
SELECT 
  '応募者別参加状況サンプル' as info,
  a.name as applicant_name,
  ep.stage_name,
  ep.status,
  ep.session_id,
  es.name as session_name
FROM event_participants ep
INNER JOIN applicants a ON a.id = ep.applicant_id
LEFT JOIN event_sessions es ON es.id = ep.session_id
WHERE ep.stage_name IS NOT NULL
ORDER BY a.name, ep.stage_name
LIMIT 20;

-- 7. 馮さんのデータ詳細確認
SELECT 
  '馮さんのデータ詳細' as info,
  a.name as applicant_name,
  a.email,
  ep.stage_name,
  ep.status,
  ep.session_id,
  ep.event_id,
  ep.created_at,
  ep.updated_at
FROM event_participants ep
INNER JOIN applicants a ON a.id = ep.applicant_id
WHERE a.name LIKE '%馮%'
ORDER BY ep.stage_name, ep.created_at;

-- 8. 会社説明会の参加状況確認
SELECT 
  '会社説明会参加状況' as info,
  a.name as applicant_name,
  ep.status,
  ep.session_id,
  es.name as session_name,
  ep.created_at
FROM event_participants ep
INNER JOIN applicants a ON a.id = ep.applicant_id
LEFT JOIN event_sessions es ON es.id = ep.session_id
WHERE ep.stage_name = '会社説明会'
ORDER BY a.name, ep.created_at;

-- 9. データ不整合の検出（同じ応募者・段階で異なるステータス）
SELECT 
  'データ不整合検出' as info,
  applicant_id,
  stage_name,
  COUNT(DISTINCT status) as different_status_count,
  STRING_AGG(DISTINCT status, ', ') as all_statuses
FROM event_participants 
WHERE stage_name IS NOT NULL
GROUP BY applicant_id, stage_name
HAVING COUNT(DISTINCT status) > 1
ORDER BY different_status_count DESC;

-- 10. 最新の更新データ確認
SELECT 
  '最新更新データ' as info,
  a.name as applicant_name,
  ep.stage_name,
  ep.status,
  ep.updated_at
FROM event_participants ep
INNER JOIN applicants a ON a.id = ep.applicant_id
WHERE ep.updated_at >= NOW() - INTERVAL '1 day'
ORDER BY ep.updated_at DESC
LIMIT 10;
