# Supabaseセットアップガイド

## 概要
このプロジェクトのSupabase設定とセットアップ手順について説明します。

## 1. Supabaseプロジェクト作成

### 1.1 プロジェクト作成
1. [Supabase](https://supabase.com)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクト名: `ats4` (または任意の名前)
4. データベースパスワードを設定
5. リージョンを選択（推奨: Asia Pacific (Tokyo)）

### 1.2 環境変数の取得
プロジェクト作成後、以下の情報を取得：
- Project URL: `https://your-project-id.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 2. 環境変数設定

### 2.1 .env.localファイル作成
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2.2 環境変数の確認
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## 3. データベーステーブル作成

### 3.1 基本テーブル構造

#### applicants (応募者)
```sql
CREATE TABLE applicants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  current_address TEXT,
  graduation_year VARCHAR(10),
  school_name VARCHAR(255),
  gender VARCHAR(10),
  source VARCHAR(100),
  other_company_status TEXT,
  current_stage VARCHAR(50) DEFAULT 'エントリー',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### events (イベント)
```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### event_sessions (イベントセッション)
```sql
CREATE TABLE event_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  venue VARCHAR(255),
  format VARCHAR(20) CHECK (format IN ('対面', 'オンライン', 'ハイブリッド')),
  zoom_url TEXT,
  notes TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  recruiter VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

-- 既存のCHECK制約を削除して再作成する場合
```sql
-- 既存の制約を削除
ALTER TABLE event_sessions DROP CONSTRAINT IF EXISTS event_sessions_format_check;

-- 新しい制約を追加
ALTER TABLE event_sessions 
ADD CONSTRAINT event_sessions_format_check 
CHECK (format IN ('対面', 'オンライン', 'ハイブリッド'));
```

#### selection_histories (選考履歴)
```sql
CREATE TABLE selection_histories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT '進行中',
  result VARCHAR(50),
  notes TEXT,
  session_id UUID REFERENCES event_sessions(id),
  session_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

-- 既存のテーブルにsession_typeカラムを追加する場合
```sql
ALTER TABLE selection_histories 
ADD COLUMN session_type VARCHAR(50);
```

-- 既存のテーブルにresultカラムを追加する場合
```sql
ALTER TABLE selection_histories 
ADD COLUMN result VARCHAR(50);
```

#### fixed_tasks (固定タスク)
```sql
CREATE TABLE fixed_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stage VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### task_instances (タスクインスタンス)
```sql
CREATE TABLE task_instances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  task_id UUID REFERENCES fixed_tasks(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT '未着手',
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### evaluation_forms (評価フォーム)
```sql
CREATE TABLE evaluation_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  evaluator VARCHAR(255),
  industry_job_reason TEXT,
  company_selection_axis TEXT,
  academic_activities TEXT,
  future_vision TEXT,
  other TEXT,
  impressions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### pdf_documents (PDFドキュメント)
```sql
CREATE TABLE pdf_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.2 インデックス作成
```sql
-- パフォーマンス向上のためのインデックス
CREATE INDEX idx_applicants_current_stage ON applicants(current_stage);
CREATE INDEX idx_selection_histories_applicant_id ON selection_histories(applicant_id);
CREATE INDEX idx_selection_histories_stage ON selection_histories(stage);
CREATE INDEX idx_task_instances_applicant_id ON task_instances(applicant_id);
CREATE INDEX idx_task_instances_status ON task_instances(status);
CREATE INDEX idx_event_sessions_event_id ON event_sessions(event_id);
```

### 3.3 トリガー作成
```sql
-- updated_at自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 各テーブルにトリガーを適用
CREATE TRIGGER update_applicants_updated_at BEFORE UPDATE ON applicants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_sessions_updated_at BEFORE UPDATE ON event_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_selection_histories_updated_at BEFORE UPDATE ON selection_histories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fixed_tasks_updated_at BEFORE UPDATE ON fixed_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_instances_updated_at BEFORE UPDATE ON task_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_evaluation_forms_updated_at BEFORE UPDATE ON evaluation_forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pdf_documents_updated_at BEFORE UPDATE ON pdf_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 4. Supabase Storage設定

### 4.1 バケット作成
1. Supabaseダッシュボード → Storage
2. 新しいバケットを作成: `applicant-documents`
3. 公開バケットとして設定（開発環境）

### 4.2 ストレージポリシー設定
```sql
-- 全ユーザーが読み取り可能
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'applicant-documents');

-- 全ユーザーがアップロード可能
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'applicant-documents');

-- 全ユーザーが更新可能
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'applicant-documents');

-- 全ユーザーが削除可能
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'applicant-documents');
```

## 5. Row Level Security (RLS)設定

### 5.1 RLS有効化
```sql
-- 各テーブルでRLSを有効化
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE selection_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_documents ENABLE ROW LEVEL SECURITY;
```

### 5.2 開発環境用ポリシー（全アクセス許可）
```sql
-- 開発環境では全アクセスを許可
CREATE POLICY "Enable all access for all users" ON applicants FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON events FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON event_sessions FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON selection_histories FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON fixed_tasks FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON task_instances FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON evaluation_forms FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON pdf_documents FOR ALL USING (true);
```

## 6. 初期データ挿入

### 6.1 イベントデータ
```sql
INSERT INTO events (name, description) VALUES
('エントリー', '応募エントリー'),
('書類選考', '書類選考'),
('適性検査', '適性検査'),
('面接', '面接'),
('最終面接', '最終面接'),
('内定面談', '内定面談'),
('会社説明会', '会社説明会');
```

### 6.2 固定タスクデータ
```sql
-- エントリー段階のタスク
INSERT INTO fixed_tasks (stage, title, description, type, order_num) VALUES
('エントリー', 'エントリー確認', 'エントリー内容を確認する', '確認', 1),
('エントリー', 'アプローチ1', '1回目のアプローチ', 'アプローチ', 2),
('エントリー', 'アプローチ2', '2回目のアプローチ', 'アプローチ', 3),
('エントリー', 'アプローチ3', '3回目のアプローチ', 'アプローチ', 4);

-- 書類選考段階のタスク
INSERT INTO fixed_tasks (stage, title, description, type, order_num) VALUES
('書類選考', '書類確認', '提出書類を確認する', '確認', 1),
('書類選考', '書類評価', '書類を評価する', '評価', 2);

-- その他の段階も同様に追加
```

## 7. トラブルシューティング

### 7.1 よくあるエラー
1. **UUID形式エラー**: `crypto.randomUUID()`を使用
2. **接続エラー**: 環境変数を確認
3. **権限エラー**: RLSポリシーを確認
4. **ストレージエラー**: バケットとポリシーを確認

### 7.2 デバッグ方法
```typescript
// クライアント側でのデバッグ
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

// データベース接続テスト
const { data, error } = await supabase.from('applicants').select('count');
console.log('Connection test:', { data, error });
```

## 8. 本番環境での注意事項

1. **RLSポリシー**: 適切な認証・認可を設定
2. **ストレージポリシー**: セキュリティを強化
3. **環境変数**: 本番用のキーを使用
4. **バックアップ**: 定期的なバックアップを設定
