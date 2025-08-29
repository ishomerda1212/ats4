-- 選考段階管理のためのstage_configカラム更新
-- 実行日時: 2025-01-XX

-- 既存データにstage_configを設定
UPDATE events SET 
  stage_config = jsonb_build_object(
    'stage_group', CASE 
      WHEN name IN ('エントリー') THEN 'エントリー'
      WHEN name IN ('CEOセミナー', '仕事体験', '適性検査体験', '会社説明会', '職場見学') THEN 'インターンシップ'
      WHEN name IN ('書類選考', '適性検査', '集団面接', '人事面接', '最終選考', '内定面談') THEN '選考'
      WHEN name IN ('不採用') THEN 'その他'
      ELSE 'その他'
    END,
    'is_active', true,
    'requires_session', CASE 
      WHEN name IN ('会社説明会', '適性検査体験', '職場見学', '仕事体験', '個別面接', '人事面接', '集団面接', '最終選考', 'CEOセミナー', '内定面談') THEN true
      ELSE false
    END,
    'session_types', CASE 
      WHEN name IN ('会社説明会', '適性検査体験', '職場見学', '仕事体験', '個別面接', '人事面接', '集団面接', '最終選考', 'CEOセミナー', '内定面談') THEN '["対面", "オンライン"]'::jsonb
      ELSE '[]'::jsonb
    END,
    'estimated_duration', CASE 
      WHEN name IN ('エントリー', '書類選考', '適性検査') THEN 30
      WHEN name IN ('会社説明会', 'CEOセミナー') THEN 120
      WHEN name IN ('適性検査体験', '職場見学') THEN 180
      WHEN name IN ('仕事体験') THEN 480
      WHEN name IN ('個別面接', '人事面接', '集団面接', '最終選考') THEN 60
      WHEN name IN ('内定面談') THEN 90
      WHEN name IN ('不採用') THEN 15
      ELSE 60
    END,
    'color_scheme', CASE 
      WHEN name = 'エントリー' THEN 'blue'
      WHEN name = '書類選考' THEN 'purple'
      WHEN name = '会社説明会' THEN 'indigo'
      WHEN name = '適性検査' THEN 'lime'
      WHEN name = '適性検査体験' THEN 'yellow'
      WHEN name = '職場見学' THEN 'orange'
      WHEN name = '仕事体験' THEN 'red'
      WHEN name = '個別面接' THEN 'amber'
      WHEN name = '人事面接' THEN 'teal'
      WHEN name = '集団面接' THEN 'cyan'
      WHEN name = 'CEOセミナー' THEN 'pink'
      WHEN name = '最終選考' THEN 'violet'
      WHEN name = '内定面談' THEN 'emerald'
      WHEN name = '不採用' THEN 'gray'
      ELSE 'blue'
    END,
    'description', description
  );

-- インデックスを追加（パフォーマンス向上のため）
-- JSONBカラム全体のインデックス
CREATE INDEX IF NOT EXISTS idx_events_stage_config ON events USING GIN (stage_config);

-- 段階グループのインデックス（通常のB-treeインデックス）
CREATE INDEX IF NOT EXISTS idx_events_stage_group ON events ((stage_config->>'stage_group'));

-- アクティブ状態のインデックス（通常のB-treeインデックス）
CREATE INDEX IF NOT EXISTS idx_events_stage_active ON events ((stage_config->>'is_active'));

-- 確認用クエリ（実行後に確認）
-- SELECT name, stage_config FROM events ORDER BY sort_order;

-- 段階グループ別の確認クエリ
-- SELECT 
--   stage_config->>'stage_group' as stage_group,
--   array_agg(name ORDER BY sort_order) as stages
-- FROM events 
-- WHERE stage_config->>'is_active' = 'true'
-- GROUP BY stage_config->>'stage_group'
-- ORDER BY stage_group;
