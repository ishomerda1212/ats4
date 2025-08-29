# システム設定機能 データベース接続手順書

## 概要

この文書では、システム設定機能（選考段階管理、タスク管理、ステータス管理）をデータベースと接続するための手順を説明します。

## 前提条件

- Supabase プロジェクトが作成済み
- 必要な環境変数が設定済み（.env ファイル）
- アプリケーションが起動可能な状態

## 1. データベースマイグレーションの実行

### 1.1 マイグレーションファイルの確認

実装済みのマイグレーションファイル：
```
database/migrations/001_create_system_config_tables.sql
```

このファイルには以下のテーブル作成が含まれています：
- `selection_stage_definitions` - 選考段階定義
- `fixed_task_definitions` - 固定タスク定義  
- `stage_status_definitions` - ステージステータス定義

### 1.2 Supabaseでのマイグレーション実行

#### 方法1: Supabase Dashboard使用
1. Supabase Dashboard にログイン
2. 対象プロジェクトを選択
3. SQL Editor に移動
4. `database/migrations/001_create_system_config_tables.sql` の内容をコピー&ペースト
5. 「Run」ボタンをクリックして実行

#### 方法2: Supabase CLI使用（推奨）
```bash
# Supabase CLIがインストールされていない場合
npm install -g supabase

# プロジェクトの初期化（初回のみ）
supabase init

# Supabaseにログイン
supabase login

# プロジェクトをリンク
supabase link --project-ref YOUR_PROJECT_REF

# マイグレーションファイルを移動
cp database/migrations/001_create_system_config_tables.sql supabase/migrations/

# マイグレーションを実行
supabase db push
```

## 2. 環境変数の設定

### 2.1 必要な環境変数

`.env` ファイルに以下の変数が設定されていることを確認：

```env
# Supabase設定
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Database Direct Connection（オプション）
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### 2.2 設定値の取得方法

1. Supabase Dashboard → Settings → API
2. Project URL と anon key をコピー
3. `.env` ファイルに設定

## 3. データベース接続の確認

### 3.1 接続テスト

アプリケーションを起動して以下を確認：

```bash
npm run dev
```

1. ブラウザで `http://localhost:5173/system-config` にアクセス
2. エラーが表示されないことを確認
3. システム設定ダッシュボードが表示されることを確認

### 3.2 データ取得の確認

ブラウザの開発者ツールで以下を確認：
1. Console タブでエラーがないことを確認
2. Network タブで Supabase へのAPIリクエストが正常に動作していることを確認

## 4. 初期データの確認

### 4.1 マイグレーションで投入されるデータ

マイグレーション実行により、以下の初期データが投入されます：

#### 選考段階（selection_stage_definitions）
- エントリー、書類選考、会社説明会、適性検査体験、職場見学、仕事体験
- 人事面接、集団面接、CEOセミナー、最終選考、内定面談、不採用

#### 固定タスク（fixed_task_definitions）
- エントリー段階：アプローチ1-5
- 書類選考段階：詳細連絡、提出書類、結果連絡
- 会社説明会：詳細連絡、リマインド
- 人事面接：詳細連絡、日程調整連絡、リマインド、結果連絡

#### ステータス定義（stage_status_definitions）  
- 各段階に適切なステータス（合格、不合格、保留、辞退、キャンセル等）

### 4.2 データ確認方法

#### Supabase Dashboard使用
1. Supabase Dashboard → Table Editor
2. 各テーブル（selection_stage_definitions, fixed_task_definitions, stage_status_definitions）を確認
3. データが正しく投入されていることを確認

#### アプリケーション上での確認
1. `/system-config` にアクセス
2. ダッシュボードに統計情報が表示されることを確認
3. `/system-config/stages` にアクセス
4. 選考段階一覧が表示されることを確認

## 5. 動作確認手順

### 5.1 段階管理機能の確認

1. **段階一覧表示**
   - `/system-config/stages` にアクセス
   - 初期データの段階が表示されることを確認

2. **段階編集**
   - 任意の段階の「編集」ボタンをクリック  
   - 編集ダイアログが表示されることを確認
   - 内容を変更して保存できることを確認

3. **新規段階作成**
   - 「新規作成」ボタンをクリック
   - 作成ダイアログが表示されることを確認
   - 新しい段階を作成できることを確認

4. **段階並び替え**
   - 段階の上下矢印ボタンで並び替えができることを確認

### 5.2 エラー処理の確認

1. **バリデーション**
   - 必須項目を空にして保存しようとした際のエラー表示
   - 不正な値を入力した際の検証

2. **ネットワークエラー**
   - インターネット接続を一時的に切断
   - 適切なエラーメッセージが表示されることを確認

## 6. トラブルシューティング

### 6.1 よくある問題と解決方法

#### マイグレーション実行エラー
```
ERROR: relation "selection_stage_definitions" already exists
```
**解決方法:** テーブルが既に存在している場合は、DROP文を追加するか、既存データを確認して対応

#### 環境変数エラー  
```
Error: supabaseUrl and supabaseAnonKey are required
```
**解決方法:** `.env` ファイルの設定を確認し、正しい値が設定されているか確認

#### CORS エラー
```
Access to fetch at '...' has been blocked by CORS policy
```
**解決方法:** Supabase の認証設定でオリジンが正しく設定されているか確認

### 6.2 ログの確認方法

#### アプリケーションログ
```bash
# 開発サーバーのログを確認
npm run dev
```

#### Supabase ログ
1. Supabase Dashboard → Logs
2. API Logs でリクエスト状況を確認  

### 6.3 データベース直接確認

```sql
-- 段階データの確認
SELECT id, name, display_name, stage_group, is_active, sort_order 
FROM selection_stage_definitions 
ORDER BY sort_order;

-- タスクデータの確認  
SELECT t.name, s.display_name as stage_name, t.task_type, t.sort_order
FROM fixed_task_definitions t
JOIN selection_stage_definitions s ON t.stage_id = s.id
ORDER BY s.sort_order, t.sort_order;

-- ステータスデータの確認
SELECT st.status_value, s.display_name as stage_name, st.status_category
FROM stage_status_definitions st  
JOIN selection_stage_definitions s ON st.stage_id = s.id
ORDER BY s.sort_order, st.sort_order;
```

## 7. パフォーマンス最適化

### 7.1 インデックスの確認

マイグレーション実行により以下のインデックスが作成されます：
- `idx_stage_definitions_active_order` - 段階の有効状態と順序
- `idx_fixed_task_stage_order` - タスクの段階ID と順序  
- `idx_stage_status_stage_order` - ステータスの段階IDと順序

### 7.2 クエリ最適化

大量データを扱う場合は、以下を検討：
- ページネーション機能の実装
- 不要なカラムの除外
- 適切なフィルタリング条件の設定

## 8. セキュリティ考慮事項

### 8.1 Row Level Security (RLS)

本機能では管理者のみアクセスする想定のため、RLSは未設定ですが、必要に応じて以下を実装：

```sql
-- 例: 管理者のみアクセス可能にする場合
ALTER TABLE selection_stage_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "管理者のみアクセス可能" ON selection_stage_definitions 
FOR ALL USING (auth.role() = 'admin');
```

### 8.2 API キーの管理

- anon key は公開されても問題ないキー
- service_role key は秘匿情報として管理
- 本番環境では環境変数を適切に管理

## 9. 本番デプロイ時の注意事項

### 9.1 環境変数設定

本番環境で以下を設定：
```env
VITE_SUPABASE_URL=https://your-production-project.supabase.co  
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### 9.2 マイグレーション実行

本番環境では慎重にマイグレーションを実行：
1. 事前に本番データのバックアップを取得
2. ステージング環境での十分なテスト
3. メンテナンス時間での実行を検討

### 9.3 モニタリング

- Supabase Dashboard でのリクエスト数監視
- エラーログの定期的な確認
- パフォーマンス指標の監視

## まとめ

この手順書に従ってデータベース接続を行うことで、システム設定機能が正常に動作するようになります。問題が発生した場合は、トラブルシューティング章を参照して対応してください。