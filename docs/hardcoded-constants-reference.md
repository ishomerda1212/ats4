# ハードコーディング固定変数リファレンス

システム設定機能で使用されているハードコーディング固定変数の定義場所と使用箇所をまとめたドキュメントです。

## 概要

システム設定機能では、タスクタイプ、ステータスカテゴリ、段階グループなどの基本設定を定数として定義しています。これらの定数は複数のファイルに散在しており、一部重複定義が発生しています。

## 1. タスクタイプ関連定数

### 定義場所

#### 主定義: src/lib/dataAccess/integratedTaskDataAccess.ts

```typescript
// 行50: TaskType型定義
export type TaskType = 'email' | 'document' | 'general' | 'interview' | 'evaluation';

// 行357-363: TASK_TYPES配列
export const TASK_TYPES: { value: TaskType; label: string; description: string; icon: string }[] = [
  { value: 'general', label: '一般タスク', description: '汎用的な作業タスク', icon: '📋' },
  { value: 'email', label: 'メール送信', description: 'メール送信タスク', icon: '📧' },
  { value: 'document', label: '書類確認', description: '書類の確認・処理', icon: '📄' },
  { value: 'interview', label: '面接関連', description: '面接の設定・実施', icon: '👥' },
  { value: 'evaluation', label: '評価入力', description: '評価・採点の入力', icon: '⭐' }
];
```

### 使用場所（重複定義あり）

#### 1. src/features/system-config/pages/TaskConfigPage.tsx (行15-36)

```typescript
const TASK_TYPE_ICONS: Record<TaskType, React.ComponentType<any>> = {
  email: Mail,
  document: FileText, 
  general: CheckSquare,
  interview: Users,
  evaluation: Star
};

const TASK_TYPE_LABELS: Record<TaskType, string> = {
  email: 'メール',
  document: '書類',
  general: '一般',
  interview: '面接',
  evaluation: '評価'
};

const TASK_TYPE_COLORS: Record<TaskType, string> = {
  email: 'bg-blue-100 text-blue-800',
  document: 'bg-green-100 text-green-800',
  general: 'bg-gray-100 text-gray-800',
  interview: 'bg-purple-100 text-purple-800',
  evaluation: 'bg-yellow-100 text-yellow-800'
};
```

#### 2. src/features/system-config/pages/AllTasksConfigPage.tsx (行15-36)

**⚠️ 問題:** TaskConfigPage.tsxと同一の定数を重複定義

```typescript
// 同じ定数がTaskConfigPage.tsxと重複定義されている
const TASK_TYPE_ICONS: Record<TaskType, React.ComponentType<any>> = { ... };
const TASK_TYPE_LABELS: Record<TaskType, string> = { ... };
const TASK_TYPE_COLORS: Record<TaskType, string> = { ... };
```

## 2. ステータスカテゴリ関連定数

### 定義場所: src/lib/dataAccess/integratedStatusDataAccess.ts

```typescript
// 行44: StatusCategory型定義
export type StatusCategory = 'passed' | 'failed' | 'pending' | 'declined' | 'cancelled';

// 行336-342: STATUS_CATEGORIES配列
export const STATUS_CATEGORIES: { value: StatusCategory; label: string; description: string; icon: string; defaultColor: ColorScheme }[] = [
  { value: 'passed', label: '通過', description: '選考を通過・成功した状態', icon: '✅', defaultColor: 'green' },
  { value: 'failed', label: '不通過', description: '選考で不合格・失敗した状態', icon: '❌', defaultColor: 'red' },
  { value: 'pending', label: '保留', description: '結果待ち・検討中の状態', icon: '⏳', defaultColor: 'yellow' },
  { value: 'declined', label: '辞退', description: '応募者が辞退した状態', icon: '🚫', defaultColor: 'gray' },
  { value: 'cancelled', label: 'キャンセル', description: 'キャンセル・中止された状態', icon: '⭕', defaultColor: 'gray' }
];

// 行345-372: STATUS_TEMPLATES定義
export const STATUS_TEMPLATES: Record<string, CreateStatusDefinitionInput[]> = {
  'basic': [
    { stageId: '', statusValue: '合格', displayName: '合格', statusCategory: 'passed', sortOrder: 1, colorScheme: 'green' },
    // ... 他のテンプレート
  ],
  'interview': [ ... ],
  'event': [ ... ],
  'final': [ ... ]
};
```

### 使用場所

#### 1. src/features/system-config/pages/StatusConfigPage.tsx

- 行101-109: `getStatusCategoryInfo`関数と`renderStatusItem`関数でステータス情報表示
- 行107: COLOR_SCHEME_DISPLAY使用でステータス色表示

#### 2. src/features/system-config/pages/AllStatusesConfigPage.tsx

- 行248: COLOR_SCHEME_DISPLAY使用でステータス色表示

### ハードコーディングされたデフォルトステータス定義

#### src/lib/dataAccess/integratedStatusDataAccess.ts (行227-262)

```typescript
private static getDefaultStatusesForStage(stageName: string): any[] {
  const commonStatuses = [
    { statusValue: '合格', displayName: '合格', statusCategory: 'passed', colorScheme: 'green', sortOrder: 1, isFinal: false },
    { statusValue: '不合格', displayName: '不合格', statusCategory: 'failed', colorScheme: 'red', sortOrder: 2, isFinal: true },
    { statusValue: '辞退', displayName: '辞退', statusCategory: 'declined', colorScheme: 'gray', sortOrder: 3, isFinal: true }
  ];

  // 段階固有のステータス定義がハードコーディングされている
  if (['会社説明会', '職場見学', '仕事体験', 'CEOセミナー'].includes(stageName)) {
    return [ ... ];  // イベント系ステータス
  }
  
  if (['人事面接', '集団面接', '最終選考'].includes(stageName)) {
    return [ ... ];  // 面接系ステータス
  }
  
  // ... 他の段階定義
}
```

## 3. 段階グループ・セッション関連定数

### 定義場所: src/features/system-config/types/stageConfig.ts

```typescript
// 行57: STAGE_GROUPS配列
export const STAGE_GROUPS: StageGroup[] = ['エントリー', 'インターンシップ', '選考', 'その他'];

// 行65: SESSION_TYPES配列  
export const SESSION_TYPES: SessionType[] = ['対面', 'オンライン', 'ハイブリッド'];

// 行91-104: AVAILABLE_ICONS配列
export const AVAILABLE_ICONS = [
  { value: 'user-plus', name: 'ユーザー追加', icon: '👤' },
  { value: 'file-text', name: 'ファイル', icon: '📄' },
  { value: 'presentation', name: 'プレゼンテーション', icon: '📊' },
  // ... 他のアイコン定義
];
```

### 使用場所

#### src/features/system-config/components/stages/StageEditDialog.tsx

- 行21: STAGE_GROUPS, SESSION_TYPESのimport
- 行192-194: セレクトオプション作成での使用
- 行268-278: セッションタイプのチェックボックス生成での使用

## 4. カラースキーム関連定数

### 定義場所（重複定義あり）

#### 1. src/features/system-config/types/index.ts (行71-89) - 統合版

```typescript
export const COLOR_SCHEME_DISPLAY: Record<string, { name: string; class: string; preview: string }> = {
  blue: { name: 'ブルー', class: 'bg-blue-100 text-blue-800', preview: 'bg-blue-500' },
  purple: { name: 'パープル', class: 'bg-purple-100 text-purple-800', preview: 'bg-purple-500' },
  // ... 他の色定義
  green: { name: 'グリーン', class: 'bg-green-100 text-green-800', preview: 'bg-green-500' }
};
```

#### 2. src/features/system-config/types/stageConfig.ts (行74-89) - 重複定義

**⚠️ 問題:** types/index.tsと類似の定数を重複定義

```typescript
export const STAGE_COLOR_SCHEME_DISPLAY: Record<ColorScheme, { name: string; class: string; preview: string }> = {
  blue: { name: 'ブルー', class: 'bg-blue-100 text-blue-800', preview: 'bg-blue-500' },
  // ... ほぼ同じ内容の重複定義
};
```

### 使用場所

- AllStatusesConfigPage.tsx:248 - ステータス色表示
- StatusConfigPage.tsx:107 - ステータス色表示

## 問題点と推奨改善策

### 🔴 深刻な問題

1. **タスクタイプ定数の完全重複**
   - TaskConfigPage.tsx と AllTasksConfigPage.tsx で同一定数を重複定義
   - メンテナンス性が低く、変更時の不整合リスクが高い

2. **カラースキーム定数の重複**
   - types/index.ts と types/stageConfig.ts で類似定数を重複定義
   - 微妙な差異があり、使用箇所によって表示が異なる可能性

3. **デフォルトステータス定義のハードコーディング**
   - getDefaultStatusesForStage関数内で段階名とステータスの対応関係をハードコーディング
   - 新しい段階追加時に必ずコード修正が必要

### 🟡 改善が望ましい問題

1. **設定の分散**
   - システム設定に関する定数が複数ファイルに散在
   - 全体像の把握が困難

2. **型安全性の不足**
   - 定数とそれに対応するマッピングの一致性が保証されていない

### 🟢 推奨改善策

#### 1. 定数の統一化

```typescript
// 新しいファイル: src/features/system-config/constants/index.ts
export * from './taskTypeConstants';
export * from './statusConstants';
export * from './stageConstants';
export * from './colorSchemeConstants';
```

#### 2. 設定の外部化

- デフォルトステータス定義をデータベースまたは設定ファイルに移行
- 段階固有の設定をJSONで管理

#### 3. 型安全性の向上

```typescript
// 定数とマッピングの一致性を保証する型定義
type TaskTypeMapping<T extends TaskType> = {
  [K in T]: {
    icon: React.ComponentType;
    label: string;
    color: string;
  }
}
```

#### 4. 設定管理の一元化

- 全ての固定値を一箇所で管理
- 設定変更時の影響範囲を明確化
- バリデーション機能の追加

## 優先順位

1. **高優先**: タスクタイプ定数の重複解消
2. **中優先**: カラースキーム定数の統一
3. **低優先**: デフォルトステータス定義の外部化

この改善により、コードの保守性向上と設定変更の安全性確保が期待できます。