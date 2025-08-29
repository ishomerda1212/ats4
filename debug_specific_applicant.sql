-- 特定の応募者の参加状況詳細調査

-- 1. 馮さんの全参加状況
SELECT 
  '馮さんの参加状況' as info,
  a.name as applicant_name,
  ep.stage_name,
  ep.status,
  ep.session_id,
  es.name as session_name,
  e.name as event_name,
  ep.created_at,
  ep.updated_at
FROM event_participants ep
INNER JOIN applicants a ON a.id = ep.applicant_id
LEFT JOIN event_sessions es ON es.id = ep.session_id
LEFT JOIN events e ON e.id = ep.event_id
WHERE a.name LIKE '%馮%'
ORDER BY ep.stage_name;

-- 2. test2さんの全参加状況
SELECT 
  'test2さんの参加状況' as info,
  a.name as applicant_name,
  ep.stage_name,
  ep.status,
  ep.session_id,
  es.name as session_name,
  e.name as event_name,
  ep.created_at,
  ep.updated_at
FROM event_participants ep
INNER JOIN applicants a ON a.id = ep.applicant_id
LEFT JOIN event_sessions es ON es.id = ep.session_id
LEFT JOIN events e ON e.id = ep.event_id
WHERE a.name LIKE '%test2%'
ORDER BY ep.stage_name;

-- 3. 特定のセッションの参加者詳細
SELECT 
  'セッション参加者詳細' as info,
  es.name as session_name,
  e.name as event_name,
  a.name as applicant_name,
  ep.stage_name,
  ep.status,
  ep.session_id,
  ep.applicant_id
FROM event_participants ep
INNER JOIN event_sessions es ON es.id = ep.session_id
INNER JOIN events e ON e.id = ep.event_id
INNER JOIN applicants a ON a.id = ep.applicant_id
WHERE es.id = '0db8405e-a191-45bf-a628-4542777267b7'  -- 会社説明会セッション
ORDER BY a.name;

-- 4. 応募者IDと段階名での検索テスト
SELECT 
  '応募者ID+段階名検索テスト' as info,
  ep.*,
  a.name as applicant_name,
  e.name as event_name
FROM event_participants ep
INNER JOIN applicants a ON a.id = ep.applicant_id
LEFT JOIN events e ON e.id = ep.event_id
WHERE ep.applicant_id = (
  SELECT id FROM applicants WHERE name LIKE '%馮%' LIMIT 1
)
AND ep.stage_name = '会社説明会';

-- 5. セッションIDでの検索テスト
SELECT 
  'セッションID検索テスト' as info,
  ep.*,
  a.name as applicant_name,
  e.name as event_name
FROM event_participants ep
INNER JOIN applicants a ON a.id = ep.applicant_id
LEFT JOIN events e ON e.id = ep.event_id
WHERE ep.session_id = '0db8405e-a191-45bf-a628-4542777267b7';
