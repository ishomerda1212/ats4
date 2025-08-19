# Supabase設定とUUID管理

## 概要
このプロジェクトではSupabaseを使用してデータベース管理を行っています。UUIDの生成と管理について説明します。

## UUID生成方法

### 1. ブラウザ環境でのUUID生成
```typescript
// 推奨方法
const id = crypto.randomUUID();

// 使用例
const newEvent = {
  id: crypto.randomUUID(),
  name: "イベント名",
  // ... その他のフィールド
};
```

### 2. Node.js環境でのUUID生成
```typescript
import { randomUUID } from 'crypto';

const id = randomUUID();
```

## データベーステーブルのUUID設定

### 1. テーブル作成時のUUID設定
```sql
-- 自動UUID生成
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 手動UUID挿入時
INSERT INTO events (id, name) VALUES (gen_random_uuid(), 'イベント名');
```

### 2. 外部キー制約
```sql
CREATE TABLE event_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  venue VARCHAR(255),
  format VARCHAR(50) CHECK (format IN ('対面', 'オンライン', 'ハイブリッド')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## よくあるエラーと解決方法

### 1. "invalid input syntax for type uuid"
**原因**: 文字列をUUIDとして渡している
**解決方法**: 
```typescript
// ❌ 間違い
eventId: `event-${stageName}`

// ✅ 正しい
eventId: crypto.randomUUID()
```

### 2. UUID形式エラー
**原因**: 不正なUUID形式
**解決方法**: 常に`crypto.randomUUID()`を使用

## セッション作成フロー

### 1. イベント作成
```typescript
const createEvent = async (eventData) => {
  const { data, error } = await supabase
    .from('events')
    .insert({
      id: crypto.randomUUID(),
      name: eventData.name,
      // ... その他のフィールド
    });
};
```

### 2. セッション作成
```typescript
const createSession = async (sessionData) => {
  const { data, error } = await supabase
    .from('event_sessions')
    .insert({
      id: crypto.randomUUID(),
      event_id: sessionData.eventId, // 既存のイベントID
      name: sessionData.name,
      start_time: sessionData.start,
      end_time: sessionData.end,
      // ... その他のフィールド
    });
};
```

## 環境変数設定

### .env.local
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Supabaseクライアント初期化
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## 注意事項

1. **UUIDの一意性**: `crypto.randomUUID()`は十分に一意性が保証されています
2. **パフォーマンス**: UUIDは文字列より大きいため、インデックスを適切に設定してください
3. **セキュリティ**: UUIDは予測可能ではないため、セキュリティ上の利点があります
4. **データベース制約**: UUIDカラムには適切な制約を設定してください

## トラブルシューティング

### 1. UUID生成エラー
```typescript
// ブラウザサポート確認
if (typeof crypto !== 'undefined' && crypto.randomUUID) {
  const id = crypto.randomUUID();
} else {
  // フォールバック
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
}
```

### 2. データベース接続エラー
- 環境変数が正しく設定されているか確認
- Supabaseプロジェクトの設定を確認
- RLSポリシーが適切に設定されているか確認
