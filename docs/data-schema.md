# 採用管理システム データスキーマ

## 概要

このドキュメントは採用管理システム（ATS4）のデータスキーマを定義します。システムは応募者管理、選考プロセス管理、タスク管理、イベント管理の機能を提供します。

## データモデル

### 1. 応募者（Applicant）

応募者の基本情報と選考状況を管理します。

```typescript
interface Applicant extends BaseEntity {
  id: string;
  name: string;                    // 氏名
  nameKana: string;                // フリガナ
  email: string;                   // メールアドレス
  phone?: string;                  // 電話番号
  address?: string;                // 住所
  education: string;               // 学歴
  graduationYear: string;          // 卒業予定年
  source: string;                  // 応募元（マイナビ、リクナビ等）
  gender: '男性' | '女性' | 'その他';
  currentStage: SelectionStage;    // 現在の選考段階
  status: '応募中' | '内定' | '不採用' | '辞退';
  notes?: string;                  // 備考
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. 選考履歴（SelectionHistory）

応募者の選考段階ごとの履歴を管理します。

```typescript
interface SelectionHistory extends BaseEntity {
  id: string;
  applicantId: string;             // 応募者ID
  stage: SelectionStage;           // 選考段階
  startDate: Date;                 // 開始日
  endDate?: Date;                  // 終了日（完了時のみ）
  status: '進行中' | '完了' | '不採用';
  result?: '合格' | '不合格' | '保留';
  notes?: string;                  // 備考
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. 選考段階（SelectionStage）

選考プロセスの段階を定義します。

```typescript
type SelectionStage = 
  | 'エントリー'
  | '書類選考'
  | '会社説明会'
  | '適性検査体験'
  | '職場見学'
  | '仕事体験'
  | '個別面接'
  | '集団面接'
  | 'CEOセミナー'
  | '人事面接'
  | '最終選考'
  | '内定面談'
  | '不採用';
```

### 4. タスク管理

#### 4.1 固定タスク（FixedTask）

選考段階ごとに定義される標準的なタスクテンプレートです。

```typescript
interface FixedTask {
  id: string;
  stage: SelectionStage;           // 対象選考段階
  title: string;                   // タスク名
  description: string;             // タスク説明
  type: TaskType;                  // タスクタイプ
  isRequired: boolean;             // 必須タスクかどうか
  estimatedDuration: number;       // 推定所要時間（分）
  order: number;                   // 段階内での順序
}
```

#### 4.2 タスクインスタンス（TaskInstance）

応募者固有のタスク実行状況を管理します。

```typescript
interface TaskInstance extends BaseEntity {
  id: string;
  applicantId: string;             // 応募者ID
  taskId: string;                  // FixedTaskのID
  status: TaskStatus;              // タスクステータス
  contactStatus?: ContactStatus;   // 連絡系タスク用
  dueDate?: Date;                  // 期限
  startedAt?: Date;                // 開始日時
  completedAt?: Date;              // 完了日時
  notes?: string;                  // メモ
  createdAt: Date;
  updatedAt: Date;
}
```

#### 4.3 タスクタイプ（TaskType）

```typescript
type TaskType = 
  | 'アプローチ1'
  | 'アプローチ1の実施'
  | '詳細連絡'
  | '日程調整連絡'
  | '提出書類'
  | '結果連絡'
  | 'リマインド';
```

#### 4.4 タスクステータス（TaskStatus）

```typescript
type TaskStatus = '未着手' | '完了' | '提出待ち' | '返信待ち';
```

#### 4.5 連絡ステータス（ContactStatus）

```typescript
type ContactStatus = '未' | '済' | '返信待ち';
```

### 5. イベント管理

#### 5.1 イベント（Event）

会社説明会やセミナーなどのイベントを管理します。

```typescript
interface Event extends BaseEntity {
  id: string;
  title: string;                   // イベント名
  description: string;             // イベント説明
  type: '会社説明会' | 'セミナー' | '面接' | 'その他';
  startDate: Date;                 // 開始日
  endDate: Date;                   // 終了日
  venue: string;                   // 開催場所
  maxParticipants: number;         // 最大参加者数
  status: '予定' | '開催中' | '終了' | 'キャンセル';
  createdAt: Date;
  updatedAt: Date;
}
```

#### 5.2 イベントセッション（EventSession）

イベントの具体的なセッションを管理します。

```typescript
interface EventSession extends BaseEntity {
  id: string;
  eventId: string;                 // イベントID
  title: string;                   // セッション名
  description: string;             // セッション説明
  start: Date;                     // 開始時刻
  end: Date;                       // 終了時刻
  venue: string;                   // 開催場所
  format: '対面' | 'オンライン';   // 開催形式
  participants: EventParticipant[]; // 参加者リスト
}
```

#### 5.3 イベント参加者（EventParticipant）

イベントセッションへの参加者を管理します。

```typescript
interface EventParticipant extends BaseEntity {
  id: string;
  sessionId: string;               // セッションID
  applicantId: string;             // 応募者ID
  status: ParticipationStatus;     // 参加ステータス
  joinedAt?: Date;                 // 参加日時
  updatedAt: Date;
  createdAt: Date;
}
```

#### 5.4 参加ステータス（ParticipationStatus）

```typescript
type ParticipationStatus = '参加' | '不参加' | '未定' | '申込' | '欠席';
```

### 6. メール管理

#### 6.1 メールテンプレート（EmailTemplate）

選考段階ごとのメールテンプレートを管理します。

```typescript
interface EmailTemplate extends BaseEntity {
  id: string;
  name: string;                    // テンプレート名
  subject: string;                 // 件名
  body: string;                    // 本文
  stage: SelectionStage;           // 対象選考段階
  type: '詳細連絡' | '日程調整' | '結果連絡' | 'リマインド';
  isActive: boolean;               // 有効/無効
  createdAt: Date;
  updatedAt: Date;
}
```

#### 6.2 メールログ（EmailLog）

送信されたメールの履歴を管理します。

```typescript
interface EmailLog extends BaseEntity {
  id: string;
  templateId: string;              // テンプレートID
  applicantId: string;             // 応募者ID
  subject: string;                 // 件名
  body: string;                    // 本文
  status: '送信済み' | '送信失敗' | '配信済み';
  sentAt: Date;                    // 送信日時
  deliveredAt?: Date;              // 配信日時
  errorMessage?: string;           // エラーメッセージ
  createdAt: Date;
  updatedAt: Date;
}
```

### 7. 評定表（EvaluationForm）

面接や選考での評価を管理します。

```typescript
interface EvaluationForm extends BaseEntity {
  id: string;
  applicantId: string;             // 応募者ID
  stage: SelectionStage;           // 選考段階
  evaluatorId: string;             // 評価者ID
  evaluatorName: string;           // 評価者名
  evaluationDate: Date;            // 評価日
  criteria: EvaluationCriteria[];  // 評価項目
  overallScore: number;            // 総合評価
  comments: string;                // コメント
  result: '合格' | '不合格' | '保留';
  createdAt: Date;
  updatedAt: Date;
}
```

#### 7.1 評価項目（EvaluationCriteria）

```typescript
interface EvaluationCriteria {
  id: string;
  name: string;                    // 評価項目名
  score: number;                   // 評価点（1-5）
  weight: number;                  // 重み
  comments?: string;               // コメント
}
```

### 8. 基本エンティティ（BaseEntity）

すべてのエンティティの基本となる共通フィールドです。

```typescript
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## データリレーション

### 主要なリレーション

1. **Applicant ↔ SelectionHistory**: 1対多
   - 1つの応募者に対して複数の選考履歴

2. **Applicant ↔ TaskInstance**: 1対多
   - 1つの応募者に対して複数のタスクインスタンス

3. **FixedTask ↔ TaskInstance**: 1対多
   - 1つの固定タスクに対して複数のタスクインスタンス

4. **Event ↔ EventSession**: 1対多
   - 1つのイベントに対して複数のセッション

5. **EventSession ↔ EventParticipant**: 1対多
   - 1つのセッションに対して複数の参加者

6. **Applicant ↔ EventParticipant**: 1対多
   - 1つの応募者が複数のイベントに参加

7. **SelectionStage ↔ FixedTask**: 1対多
   - 1つの選考段階に対して複数の固定タスク

## データフロー

### 1. 応募者登録フロー

1. 応募者情報を登録（Applicant）
2. エントリー段階の選考履歴を作成（SelectionHistory）
3. エントリー段階の固定タスクに基づいてタスクインスタンスを作成（TaskInstance）

### 2. 選考段階進行フロー

1. 現在の段階を完了として更新（SelectionHistory）
2. 次の段階の選考履歴を作成（SelectionHistory）
3. 次の段階の固定タスクに基づいてタスクインスタンスを作成（TaskInstance）

### 3. タスク実行フロー

1. タスクインスタンスのステータスを更新（TaskInstance）
2. 必要に応じてメール送信（EmailLog）
3. タスク完了時に次のタスクを確認

### 4. イベント参加フロー

1. イベントとセッションを作成（Event, EventSession）
2. 応募者をセッションに登録（EventParticipant）
3. 参加状況を更新（EventParticipant）

## データ整合性ルール

### 1. 選考段階の順序

- 選考段階は定義された順序で進行する必要がある
- 前の段階が完了していない場合、次の段階に進めない

### 2. タスクの依存関係

- 必須タスクが完了していない場合、次の段階に進めない
- タスクの順序は定義された順序で実行する

### 3. イベント参加

- 同一時間帯に複数のイベントに参加できない
- 参加者数が上限に達した場合、新規参加を制限

### 4. メール送信

- 同じテンプレートで短時間に複数回送信しない
- 送信失敗時は再送信可能

## パフォーマンス考慮事項

### 1. インデックス

以下のフィールドにインデックスを設定することを推奨：

- `Applicant.email`
- `Applicant.currentStage`
- `SelectionHistory.applicantId`
- `SelectionHistory.stage`
- `TaskInstance.applicantId`
- `TaskInstance.status`
- `EventParticipant.sessionId`
- `EventParticipant.applicantId`

### 2. クエリ最適化

- 応募者一覧取得時は必要なフィールドのみ選択
- 選考履歴は最新のものから取得
- タスク一覧はステータスでフィルタリング

### 3. データ量管理

- 古いメールログは定期的にアーカイブ
- 完了したタスクインスタンスは一定期間後に削除
- イベント参加履歴は長期保存

## セキュリティ考慮事項

### 1. データアクセス制御

- 応募者情報は担当者のみアクセス可能
- 管理者は全データにアクセス可能
- ログイン履歴を記録

### 2. 個人情報保護

- 応募者情報は暗号化して保存
- アクセスログを記録
- データ削除時は完全に削除

### 3. 監査ログ

- 重要なデータ変更は監査ログに記録
- 変更者、変更日時、変更内容を記録

## 将来の拡張性

### 1. 多言語対応

- メッセージやラベルを多言語化
- 地域別の選考プロセス対応

### 2. 外部システム連携

- 求人サイトとの連携
- 人事システムとの連携
- メールシステムとの連携

### 3. 分析機能

- 選考プロセスの分析
- 応募者動向の分析
- 採用効果の測定

---

*このドキュメントは採用管理システムのデータスキーマを定義し、開発チームが一貫したデータ構造を理解・実装できるようにすることを目的としています。*
