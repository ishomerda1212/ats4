# システム設定による選考段階・タスク管理　要件定義・実装計画

## 概要

現在ハードコードされている選考段階、固定タスク、タスクステータス項目を、システムの設定機能として管理できるようにするための要件定義と実装計画。

## 現状の問題点

### 1. ハードコード化された設定項目

```typescript
// src/shared/utils/constants.ts
export const SELECTION_STAGES = [
  'エントリー', '書類選考', '会社説明会', // ... 固定値
] as const;

export const STAGE_TASKS: Record<SelectionStage, string[]> = {
  'エントリー': ['アプローチ1', 'アプローチ2', // ... 固定値
} as const;
```

### 2. 運用上の課題

- 選考プロセスの変更時にコード修正が必要
- システム部門への依存
- 環境別設定の困難性
- A/Bテストや段階的展開の制約

## 要件定義

### 1. 機能要件

#### 1.1 選考段階管理
- ✅ 選考段階の追加・削除・編集
- ✅ 段階の順序変更
- ✅ 段階の有効/無効切り替え
- ✅ 段階のグループ分類設定
- ✅ 段階の色・アイコン設定

#### 1.2 固定タスク管理
- ✅ 段階ごとのタスク定義
- ✅ タスクの追加・削除・編集
- ✅ タスクの順序設定
- ✅ タスクの必須/任意フラグ
- ✅ タスクの期限設定（相対日数）

#### 1.3 ステータス項目管理
- ✅ 段階ごとのステータス選択肢設定
- ✅ ステータスの追加・削除・編集
- ✅ ステータスの色・表示名設定
- ✅ ステータスの結果分類（合格/不合格/保留等）

#### 1.4 権限管理
- ✅ 設定変更権限の制御
- ✅ 設定履歴の記録
- ✅ 変更承認ワークフロー（オプション）

### 2. 非機能要件

#### 2.1 パフォーマンス
- 設定変更時の即座反映
- キャッシュ機能による高速アクセス
- 大量データでの安定動作

#### 2.2 可用性
- 設定変更中のサービス継続
- ロールバック機能
- バックアップ・復元機能

#### 2.3 セキュリティ
- 不正な設定変更の防止
- 設定データの暗号化
- 監査ログの記録

## データベース設計

### 1. 新規テーブル構造

```sql
-- 選考段階定義テーブル
CREATE TABLE selection_stage_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    stage_group VARCHAR(50) NOT NULL DEFAULT 'その他',
    sort_order INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    color_scheme VARCHAR(20) DEFAULT 'blue',
    icon VARCHAR(50),
    estimated_duration_minutes INTEGER DEFAULT 60,
    requires_session BOOLEAN DEFAULT false,
    session_types JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- 固定タスク定義テーブル
CREATE TABLE fixed_task_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_id UUID NOT NULL REFERENCES selection_stage_definitions(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) NOT NULL, -- 'email', 'document', 'general', etc.
    sort_order INTEGER NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    due_offset_days INTEGER, -- 相対期限（日数）
    email_template_id UUID, -- メールテンプレートとの関連
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    UNIQUE(stage_id, name)
);

-- ステータス選択肢定義テーブル
CREATE TABLE stage_status_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_id UUID NOT NULL REFERENCES selection_stage_definitions(id) ON DELETE CASCADE,
    status_value VARCHAR(50) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    status_category VARCHAR(20) NOT NULL, -- 'passed', 'failed', 'pending', 'declined', 'cancelled'
    color_scheme VARCHAR(20) DEFAULT 'gray',
    sort_order INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_final BOOLEAN NOT NULL DEFAULT false, -- 最終ステータスかどうか
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    UNIQUE(stage_id, status_value)
);

-- 設定変更履歴テーブル
CREATE TABLE configuration_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action_type VARCHAR(20) NOT NULL, -- 'create', 'update', 'delete'
    old_data JSONB,
    new_data JSONB,
    changed_fields JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reason TEXT
);
```

### 2. インデックス設計

```sql
-- パフォーマンス向上のためのインデックス
CREATE INDEX idx_stage_definitions_active_order ON selection_stage_definitions(is_active, sort_order);
CREATE INDEX idx_fixed_task_stage_order ON fixed_task_definitions(stage_id, sort_order);
CREATE INDEX idx_stage_status_stage_order ON stage_status_definitions(stage_id, sort_order);
CREATE INDEX idx_config_history_table_record ON configuration_history(table_name, record_id);
```

## 実装計画

### Phase 1: データベース基盤構築（1週間）

#### 1.1 スキーマ作成
- [ ] マイグレーションファイル作成
- [ ] テーブル・インデックス作成
- [ ] 初期データ投入スクリプト作成

#### 1.2 データアクセス層
```typescript
// src/lib/dataAccess/configurationDataAccess.ts
export class ConfigurationDataAccess {
  static async getActiveSelectionStages(): Promise<SelectionStageDefinition[]>
  static async createSelectionStage(data: CreateSelectionStageInput): Promise<SelectionStageDefinition>
  static async updateSelectionStage(id: string, data: UpdateSelectionStageInput): Promise<void>
  static async deleteSelectionStage(id: string): Promise<void>
  
  static async getFixedTasksForStage(stageId: string): Promise<FixedTaskDefinition[]>
  static async createFixedTask(data: CreateFixedTaskInput): Promise<FixedTaskDefinition>
  // ...
}
```

### Phase 2: 設定管理機能開発（2週間）

#### 2.1 設定管理画面
```typescript
// src/features/system-config/
├── pages/
│   ├── SystemConfigPage.tsx
│   ├── SelectionStageConfigPage.tsx
│   └── TaskConfigPage.tsx
├── components/
│   ├── StageConfigForm.tsx
│   ├── TaskConfigForm.tsx
│   └── StatusConfigForm.tsx
└── hooks/
    ├── useStageConfig.ts
    └── useTaskConfig.ts
```

#### 2.2 設定API
```typescript
// src/features/system-config/api/configApi.ts
export const configApi = {
  // 選考段階
  getSelectionStages: () => Promise<SelectionStageDefinition[]>,
  createSelectionStage: (data: CreateSelectionStageInput) => Promise<SelectionStageDefinition>,
  updateSelectionStage: (id: string, data: UpdateSelectionStageInput) => Promise<void>,
  deleteSelectionStage: (id: string) => Promise<void>,
  
  // 固定タスク
  getFixedTasks: (stageId: string) => Promise<FixedTaskDefinition[]>,
  createFixedTask: (data: CreateFixedTaskInput) => Promise<FixedTaskDefinition>,
  updateFixedTask: (id: string, data: UpdateFixedTaskInput) => Promise<void>,
  deleteFixedTask: (id: string) => Promise<void>,
  
  // ステータス定義
  getStageStatuses: (stageId: string) => Promise<StageStatusDefinition[]>,
  createStageStatus: (data: CreateStageStatusInput) => Promise<StageStatusDefinition>,
  updateStageStatus: (id: string, data: UpdateStageStatusInput) => Promise<void>,
  deleteStageStatus: (id: string) => Promise<void>
};
```

### Phase 3: 既存機能の移行（1.5週間）

#### 3.1 定数ファイルの動的化
```typescript
// src/shared/utils/dynamicConstants.ts
import { ConfigurationDataAccess } from '@/lib/dataAccess/configurationDataAccess';

class DynamicConstants {
  private static stageCache: SelectionStageDefinition[] | null = null;
  private static taskCache: Map<string, FixedTaskDefinition[]> = new Map();
  
  static async getSelectionStages(): Promise<SelectionStageDefinition[]> {
    if (!this.stageCache) {
      this.stageCache = await ConfigurationDataAccess.getActiveSelectionStages();
    }
    return this.stageCache;
  }
  
  static async getFixedTasksForStage(stageId: string): Promise<FixedTaskDefinition[]> {
    if (!this.taskCache.has(stageId)) {
      const tasks = await ConfigurationDataAccess.getFixedTasksForStage(stageId);
      this.taskCache.set(stageId, tasks);
    }
    return this.taskCache.get(stageId)!;
  }
  
  static clearCache(): void {
    this.stageCache = null;
    this.taskCache.clear();
  }
}
```

#### 3.2 既存コンポーネントの修正
- [ ] `useTaskManagement` の動的取得対応
- [ ] `stageHelpers` の設定ベース化
- [ ] レポート計算の設定対応

### Phase 4: 設定UI/UX改善（1週間）

#### 4.1 設定画面の充実
- [ ] ドラッグ&ドロップによる順序変更
- [ ] 一括編集機能
- [ ] 設定のプレビュー機能
- [ ] インポート/エクスポート機能

#### 4.2 バリデーション強化
- [ ] 設定値の妥当性チェック
- [ ] 循環参照の検出
- [ ] データ整合性の確認

### Phase 5: 運用機能（1週間）

#### 5.1 履歴・監査機能
- [ ] 変更履歴の表示
- [ ] ロールバック機能
- [ ] 変更承認ワークフロー

#### 5.2 バックアップ・復元
- [ ] 設定のバックアップ作成
- [ ] 設定の復元機能
- [ ] 環境間設定同期

## リスク分析と対策

### 1. 技術的リスク

#### リスク: 既存データとの互換性問題
**対策**: 
- 段階的移行計画の策定
- フィーチャーフラグによる切り替え制御
- 旧形式データの自動変換機能

#### リスク: パフォーマンス劣化
**対策**:
- 設定データのキャッシュ機能
- 適切なインデックス設計
- 定期的なパフォーマンステスト

### 2. 運用リスク

#### リスク: 不正な設定による システム停止
**対策**:
- 設定値バリデーション強化
- ロールバック機能の実装
- 設定変更の段階的適用

#### リスク: 設定変更による データ不整合
**対策**:
- 変更前後のデータ整合性チェック
- トランザクション制御
- 変更影響範囲の事前分析

## テスト計画

### 1. 単体テスト
- [ ] データアクセス層のテスト
- [ ] 設定API のテスト
- [ ] バリデーション機能のテスト

### 2. 結合テスト
- [ ] 設定変更の即座反映テスト
- [ ] キャッシュ機能のテスト
- [ ] 既存機能との連携テスト

### 3. 運用テスト
- [ ] 負荷テスト（大量設定データ）
- [ ] 障害復旧テスト
- [ ] セキュリティテスト

## 導入計画

### 1. 段階的導入
1. **Phase 1**: テスト環境での基盤構築
2. **Phase 2**: 開発環境での設定機能導入
3. **Phase 3**: ステージング環境での運用テスト
4. **Phase 4**: 本番環境への段階的適用

### 2. ロールバック計画
- 各Phaseでのロールバックポイント設定
- 緊急時の旧システム復帰手順
- データ整合性の確保

### 3. 運用手順書
- 設定変更の標準手順
- トラブルシューティングガイド
- 定期メンテナンス手順

## 期待効果

### 1. 開発効率の向上
- システム部門への依存削減
- 設定変更の迅速化
- A/Bテスト・段階的展開の実現

### 2. 運用品質の向上
- 設定変更履歴の記録
- 変更影響の可視化
- 設定の標準化

### 3. コスト削減
- 開発コストの削減
- 運用コストの削減
- 障害対応時間の短縮

---

**総工期**: 約6.5週間  
**必要リソース**: フロントエンド開発者1名、バックエンド開発者1名、テスター1名  
**推定コスト**: 中規模（既存システムへの影響を最小化するため段階的実装）