# リファクタリングガイド：大きなファイルの分割とディレクトリ構成の改善

## 現状分析

### 長いファイルの特定結果

現在のプロジェクトで特に行数が多いファイル：

1. **ApplicantDetailPage.tsx** (1,565行) - `src/features/applicants/pages/`
2. **SelectionStageAccordion.tsx** (914行) - `src/features/selection-stages/components/`
3. **mockData.ts** (797行) - `src/shared/data/`
4. **ReportPage.tsx** (797行) - `src/features/reports/pages/`
5. **taskTemplates.ts** (528行) - `src/features/tasks/data/`

### 問題点

- **可読性の低下**: 1,000行以上のファイルは理解・保守が困難
- **責任の分散**: 単一のファイルが複数の責任を持っている
- **テストの困難さ**: 大きなファイルは単体テストが書きにくい
- **チーム開発での競合**: 複数人が同じファイルを編集する際の競合リスク

## リファクタリング提案

### 1. ApplicantDetailPage.tsx の分割

**現状**: 1,565行の巨大なページコンポーネント

**分割案**:
```
src/features/applicants/pages/ApplicantDetailPage/
├── index.tsx                      # メインページコンポーネント（100-150行）
├── components/
│   ├── ApplicantDetailTabs.tsx    # タブコンポーネント
│   ├── SelectionHistoryTab.tsx    # 選考履歴タブ
│   ├── EvaluationTab.tsx          # 評定表タブ
│   ├── TaskHistoryTab.tsx         # タスク履歴タブ
│   ├── PDFStorageTab.tsx          # PDF保存タブ
│   └── EmailHistoryTab.tsx        # メール履歴タブ
├── hooks/
│   ├── useEvaluationForms.ts      # 評定表フォーム管理
│   ├── usePDFStorage.ts           # PDF管理
│   └── useEmailHistory.ts         # メール履歴管理
└── types/
    └── applicantDetail.ts         # ページ固有の型定義
```

### 2. SelectionStageAccordion.tsx の分割

**現状**: 914行の複雑なコンポーネント

**分割案**:
```
src/features/selection-stages/components/SelectionStageAccordion/
├── index.tsx                      # メインアコーディオンコンポーネント
├── components/
│   ├── StageCard.tsx              # 個別ステージカード
│   ├── TaskManagementSection.tsx  # タスク管理セクション
│   ├── SessionBookingForm.tsx     # セッション予約フォーム
│   └── StageResultForm.tsx        # ステージ結果フォーム
├── hooks/
│   ├── useStageAccordion.ts       # アコーディオン状態管理
│   └── useStageOperations.ts      # ステージ操作
└── utils/
    └── stageHelpers.ts            # ステージ関連のユーティリティ
```

### 3. mockData.ts の分割

**現状**: 797行のモックデータファイル

**分割案**:
```
src/shared/data/mock/
├── index.ts                       # 全データのエクスポート
├── applicants.ts                  # 応募者データ
├── selectionHistory.ts            # 選考履歴データ
├── evaluationForms.ts             # 評定表データ
├── tasks.ts                       # タスクデータ
└── events.ts                      # イベントデータ
```

### 4. ReportPage.tsx の分割

**現状**: 797行のレポートページ

**分割案**:
```
src/features/reports/pages/ReportPage/
├── index.tsx                      # メインレポートページ
├── components/
│   ├── RecruitmentMetrics.tsx     # 採用指標表示
│   ├── StageAnalysis.tsx          # ステージ分析
│   ├── ApplicantAnalysis.tsx      # 応募者分析
│   └── ExportSection.tsx          # エクスポート機能
├── hooks/
│   ├── useReportData.ts           # レポートデータ取得
│   └── useReportExport.ts         # エクスポート機能
└── utils/
    └── reportCalculations.ts      # レポート計算ロジック
```

### 5. taskTemplates.ts の分割

**現状**: 528行のタスクテンプレートファイル

**分割案**:
```
src/features/tasks/data/templates/
├── index.ts                       # 全テンプレートのエクスポート
├── documentScreening.ts          # 書類選考テンプレート
├── interviews.ts                  # 面接関連テンプレート
├── tests.ts                       # 試験関連テンプレート
└── events.ts                      # イベント関連テンプレート
```

## ディレクトリ構成の改善提案

### 現在の問題点

- 一部のフィーチャーディレクトリが不完全（evaluationsが削除済み）
- 共通コンポーネントの組織化が不十分
- 型定義の重複

### 改善案

#### 1. 共通コンポーネントの整理

```
src/components/
├── ui/                           # 基本UIコンポーネント（現状維持）
├── common/                       # 共通ビジネスコンポーネント
│   ├── DataTable/                # 汎用データテーブル
│   ├── FormWrappers/             # 汎用フォームラッパー
│   ├── StatusIndicators/         # ステータス表示コンポーネント
│   └── Charts/                   # チャートコンポーネント
└── layout/                       # レイアウト関連
    ├── PageHeader/
    ├── Sidebar/
    └── Footer/
```

#### 2. 型定義の統一

```
src/types/
├── api/                          # API関連の型
├── common/                       # 共通型
├── features/                     # フィーチャー固有の型
│   ├── applicants.ts
│   ├── events.ts
│   ├── tasks.ts
│   └── reports.ts
└── ui/                          # UI関連の型
```

#### 3. ユーティリティの整理

```
src/utils/
├── api/                          # API関連ユーティリティ
├── date/                         # 日付関連
├── validation/                   # バリデーション
├── formatting/                   # フォーマット
└── constants/                    # 定数
```

## 実装手順

### フェーズ1: 準備作業

1. **型定義の整理**
   - 共通型を`src/types/`に移動
   - フィーチャー固有型の整理

2. **ユーティリティの整理**
   - 共通ユーティリティの抽出
   - 定数の統一

### フェーズ2: モックデータの分割

1. `mockData.ts`を分割
2. インポートパスの更新
3. テストの実行・確認

### フェーズ3: 大きなコンポーネントの分割

1. `ApplicantDetailPage.tsx`の分割
2. `SelectionStageAccordion.tsx`の分割
3. `ReportPage.tsx`の分割

### フェーズ4: テンプレートデータの分割

1. `taskTemplates.ts`の分割
2. 関連するフックの更新

### フェーズ5: 最終確認

1. 全体的なテスト実行
2. インポートパスの確認
3. パフォーマンステスト

## 期待される効果

- **保守性の向上**: ファイルサイズの縮小により、理解・修正が容易に
- **再利用性の向上**: 分割されたコンポーネントの他ページでの再利用
- **テストの改善**: 小さなコンポーネント単位でのテストが可能
- **チーム開発の効率化**: 競合の減少、並行開発の促進
- **パフォーマンス向上**: コード分割による初回読み込み時間の短縮

## 注意点

- **段階的な実装**: 一度にすべてを変更せず、段階的に進める
- **テストの実行**: 各フェーズ後に必ずテストを実行
- **インポートパスの管理**: 相対パスとエイリアスパスの一貫した使用
- **型安全性の維持**: 分割後も型安全性を保つ
- **チーム内共有**: 変更内容をチームメンバーと共有