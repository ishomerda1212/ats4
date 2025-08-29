# 既存データと新設定システムの連携分析

## 概要

スクリーンショットと既存コードから、現在のシステムは `events` テーブルで選考段階を管理していることが判明しました。新しく実装した設定システムと既存データの連携方法を分析し、統合案を提示します。

## 既存データ構造の分析

### 1. Events テーブル（選考段階）
```typescript
interface RawEvent {
  id: string;
  name: string;           // 段階名（例：エントリー、書類選考）
  description: string;    // 説明
  stage: string;          // 段階識別子
  venue: string;          // 会場
  max_participants: number;
  status: string;
  created_at: string;
  updated_at: string;
  sort_order: number;     // 表示順序
  stage_config: any;      // JSONB - 段階設定情報
}
```

**既存データ例（スクリーンショットより）:**
- エントリー、会社説明会、CEOセミナー、適性検査体験、仕事体験
- 職場見学、書類選考、集団面接、人事面接、最終選考、内定面談、不採用、適性検査

### 2. Task_Instances テーブル（タスク管理）
```typescript
interface RawTaskInstance {
  id: string;
  applicant_id: string;
  task_id: string;        // fixed_tasks への参照
  status: string;         // 未着手、完了、提出待ち、返信待ち
  due_date: string;
  completed_at: string;
  notes: string;
  created_at: string;
  updated_at: string;
}
```

### 3. Fixed_Tasks テーブル（固定タスク定義）
```typescript
interface RawFixedTask {
  id: string;
  stage: string;          // events.stage への参照
  title: string;
  description: string;
  type: string;           // email, document, general等
  order_num: number;      // 順序
  created_at: string;
  updated_at: string;
}
```

### 4. SelectionStage 型定義（既存）
```typescript
export type SelectionStage = 
  | 'エントリー' | '書類選考' | '会社説明会' | '適性検査' | '適性検査体験'
  | '職場見学' | '仕事体験' | '個別面接' | '人事面接' | '集団面接'
  | '最終選考' | 'CEOセミナー' | '内定面談' | '不採用';
```

## 新設定システムとの比較

### 新設定システムの構造
```sql
-- 新システム（実装済み）
CREATE TABLE selection_stage_definitions (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    stage_group VARCHAR(50) NOT NULL DEFAULT 'その他',
    sort_order INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    color_scheme VARCHAR(20) DEFAULT 'blue',
    icon VARCHAR(50),
    estimated_duration_minutes INTEGER DEFAULT 60,
    requires_session BOOLEAN DEFAULT false,
    session_types JSONB DEFAULT '[]'::jsonb,
    -- ...
);
```

## 統合方針の検討

### ❌ 課題：データ構造の重複
1. **選考段階の重複管理**
   - 既存：`events` テーブルで段階を表現
   - 新規：`selection_stage_definitions` テーブルで段階定義

2. **タスク定義の分離**
   - 既存：`fixed_tasks` テーブル 
   - 新規：`fixed_task_definitions` テーブル

3. **型定義の不整合**
   - 既存：`SelectionStage` ユニオン型
   - 新規：データベース駆動の動的型

### ✅ 推奨統合方法

## 案1: 既存システム拡張方式（推奨）

既存の `events` テーブルを活用し、`stage_config` JSONB フィールドを拡張して新設定機能を統合する。

### 実装手順

#### 1. Events テーブルの stage_config 拡張
```sql
-- events テーブルの stage_config フィールド構造例
{
  "display_name": "書類選考",
  "stage_group": "選考",
  "is_active": true,
  "color_scheme": "purple",
  "icon": "file-text",
  "estimated_duration_minutes": 60,
  "requires_session": false,
  "session_types": [],
  "created_by_system": true,  -- 新設定システムで管理されているかの判別
  "config_version": 1         -- 設定バージョン
}
```

#### 2. 新設定システムのデータアクセス修正
```typescript
// 新しい統合データアクセス層
export class IntegratedStageDataAccess {
  // events テーブルから選考段階を取得し、新設定システム形式で返す
  static async getAllSelectionStages(): Promise<SelectionStageDefinition[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('sort_order', { ascending: true });

    return data.map(event => ({
      id: event.id,
      name: event.stage,  // events.stage を name として使用
      displayName: event.stage_config?.display_name || event.name,
      stageGroup: event.stage_config?.stage_group || 'その他',
      sortOrder: event.sort_order || 0,
      isActive: event.stage_config?.is_active ?? true,
      colorScheme: event.stage_config?.color_scheme || 'blue',
      // ... その他のマッピング
    }));
  }

  // 新設定システムからの更新を events テーブルに反映
  static async updateSelectionStage(stage: UpdateSelectionStageInput): Promise<void> {
    const { error } = await supabase
      .from('events')
      .update({
        stage_config: {
          ...currentStageConfig,
          display_name: stage.displayName,
          stage_group: stage.stageGroup,
          color_scheme: stage.colorScheme,
          // ...
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', stage.id);
  }
}
```

#### 3. 既存システムとの互換性維持
```typescript
// 既存の EventDataAccess を拡張
export class EventDataAccess {
  // 既存メソッドはそのまま維持
  static async getAllEvents(): Promise<Event[]> {
    // 既存の実装
  }

  // 新設定システム連携用メソッド追加  
  static async updateStageConfig(eventId: string, config: StageConfig): Promise<void> {
    const { error } = await supabase
      .from('events')
      .update({
        stage_config: {
          ...config,
          config_version: 1,
          updated_by_system: true
        }
      })
      .eq('id', eventId);
  }
}
```

## 案2: マイグレーション方式

既存データを新テーブル構造に移行する。

### メリット・デメリット比較

| 項目 | 案1（拡張方式） | 案2（マイグレーション方式） |
|------|----------------|---------------------------|
| **開発コスト** | 低 | 高 |
| **既存機能への影響** | 最小限 | 大きい |
| **データ整合性** | 中 | 高 |
| **将来の拡張性** | 中 | 高 |
| **移行リスク** | 低 | 高 |

## 推奨実装計画

### フェーズ1: 統合データアクセス層の実装
1. `IntegratedStageDataAccess` クラスの作成
2. 既存 `events` テーブルと新設定システムのブリッジ機能
3. 既存 `EventDataAccess` との共存

### フェーズ2: 新設定UIの既存データ連携
1. 新設定画面で既存 `events` データを表示
2. 編集機能で `events.stage_config` を更新
3. 既存システムへの影響なし

### フェーズ3: 段階的な機能統合
1. 新設定システムの段階作成 → `events` テーブルに反映
2. 色やアイコン設定の既存UI への反映
3. ステータス管理の統合

## 実装上の注意点

### 1. データ整合性の確保
```typescript
// バリデーション機能
export class StageValidationService {
  static validateStageIntegrity(stages: Event[]): ValidationResult {
    // 既存の SelectionStage 型との整合性チェック
    // 重複チェック
    // 参照整合性チェック
  }
}
```

### 2. 既存型定義の段階的更新
```typescript
// 既存型を維持しつつ、動的型への移行を準備
export type SelectionStage = string; // ユニオン型から string に変更予定

// 型安全性を保つためのユーティリティ
export const isValidSelectionStage = (stage: string): stage is SelectionStage => {
  // 動的バリデーション
};
```

### 3. 既存機能への影響最小化
```typescript
// 既存の useEvents フック等は無変更で維持
// 新しい useIntegratedStages フックを追加
export const useIntegratedStages = () => {
  // events テーブルから新設定システム形式でデータを取得
};
```

## 実装優先度

### 🔴 高優先度
1. **統合データアクセス層の実装** - 既存データの活用
2. **新設定UIでの既存データ表示** - 即座に価値提供

### 🟡 中優先度  
3. **段階編集機能の統合** - 既存システムとの整合性
4. **タスク管理との連携** - fixed_tasks テーブルとの統合

### 🟢 低優先度
5. **完全なマイグレーション** - 将来的な最適化

## 結論

**推奨アプローチ：案1（既存システム拡張方式）**

- 既存の `events` テーブルを活用
- `stage_config` JSONB フィールドで新機能を実装
- 段階的な統合により既存機能への影響を最小化
- 低リスク・低コストで新機能を提供

この方針により、既存データを活用しながら新しい設定管理機能を実現できます。