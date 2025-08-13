# 採用管理システム データベース構造図

## データベース全体構造

```mermaid
graph TB
    subgraph "応募者管理"
        A[applicants<br/>応募者]
        B[selection_histories<br/>選考履歴]
    end
    
    subgraph "タスク管理"
        C[fixed_tasks<br/>固定タスク]
        D[task_instances<br/>タスクインスタンス]
    end
    
    subgraph "イベント管理"
        E[events<br/>イベント]
        F[event_sessions<br/>イベントセッション]
        G[event_participants<br/>イベント参加者]
    end
    
    subgraph "メール管理"
        H[email_templates<br/>メールテンプレート]
        I[email_logs<br/>メールログ]
    end
    
    subgraph "評価管理"
        J[evaluation_forms<br/>評価フォーム]
    end
    
    %% リレーションシップ
    A --> B
    A --> D
    A --> G
    A --> I
    A --> J
    
    C --> D
    E --> F
    F --> G
    H --> I
```

## テーブル詳細構造

### 1. 応募者テーブル（applicants）

```
┌─────────────────────────────────────────────────────────────┐
│                        applicants                          │
├─────────────────────────────────────────────────────────────┤
│ PK  id                    VARCHAR(36)    NOT NULL          │ -- 応募者ID
│     name                  VARCHAR(100)   NOT NULL          │ -- 氏名
│     name_kana             VARCHAR(100)   NOT NULL          │ -- 氏名（カナ）
│     email                 VARCHAR(255)   NOT NULL UNIQUE   │ -- メールアドレス
│     phone                 VARCHAR(20)                      │ -- 電話番号
│     current_address       TEXT                             │ -- 現住所
│     hometown_address      TEXT                             │ -- 帰省先住所
│     school_name           VARCHAR(100)   NOT NULL          │ -- 学校名
│     faculty               VARCHAR(100)                      │ -- 学部
│     department            VARCHAR(100)                      │ -- 学科・コース
│     graduation_year       VARCHAR(4)     NOT NULL          │ -- 卒業年
│     source                VARCHAR(50)    NOT NULL          │ -- 応募経路
│     gender                ENUM           NOT NULL          │ -- 性別
│     current_stage         ENUM           NOT NULL          │ -- 現在の選考段階
│     status                ENUM           NOT NULL          │ -- 応募状況
│     notes                 TEXT                             │ -- 備考
│     created_at            TIMESTAMP      NOT NULL          │ -- 作成日時
│     updated_at            TIMESTAMP      NOT NULL          │ -- 更新日時
└─────────────────────────────────────────────────────────────┘
```

**インデックス:**
- `PRIMARY KEY (id)`
- `UNIQUE KEY (email)`
- `INDEX idx_current_stage (current_stage)`
- `INDEX idx_status (status)`

### 2. 選考履歴テーブル（selection_histories）

```
┌─────────────────────────────────────────────────────────────┐
│                   selection_histories                      │
├─────────────────────────────────────────────────────────────┤
│ PK  id                    VARCHAR(36)    NOT NULL          │ -- 選考履歴ID
│ FK  applicant_id          VARCHAR(36)    NOT NULL          │ -- 応募者ID
│     stage                 ENUM           NOT NULL          │ -- 選考段階
│     end_date              TIMESTAMP                        │ -- 終了日時
│     status                ENUM           NOT NULL          │ -- 選考状況・結果
│     notes                 TEXT                             │ -- 備考
│     created_at            TIMESTAMP      NOT NULL          │ -- 作成日時
│     updated_at            TIMESTAMP      NOT NULL          │ -- 更新日時
└─────────────────────────────────────────────────────────────┘
```

**インデックス:**
- `PRIMARY KEY (id)`
- `INDEX idx_applicant_id (applicant_id)`
- `INDEX idx_stage (stage)`

### 3. 固定タスクテーブル（fixed_tasks）

```
┌─────────────────────────────────────────────────────────────┐
│                      fixed_tasks                           │
├─────────────────────────────────────────────────────────────┤
│ PK  id                    VARCHAR(36)    NOT NULL          │ -- タスクID
│     stage                 ENUM           NOT NULL          │ -- 対象選考段階
│     title                 VARCHAR(200)   NOT NULL          │ -- タスクタイトル
│     description           TEXT           NOT NULL          │ -- タスク説明
│     type                  ENUM           NOT NULL          │ -- タスクタイプ
│     order                 INT            NOT NULL          │ -- 表示順序
└─────────────────────────────────────────────────────────────┘
```

**インデックス:**
- `PRIMARY KEY (id)`
- `INDEX idx_stage (stage)`
- `INDEX idx_order (order)`

### 4. タスクインスタンステーブル（task_instances）

```
┌─────────────────────────────────────────────────────────────┐
│                    task_instances                          │
├─────────────────────────────────────────────────────────────┤
│ PK  id                    VARCHAR(36)    NOT NULL          │ -- タスクインスタンスID
│ FK  applicant_id          VARCHAR(36)    NOT NULL          │ -- 応募者ID
│ FK  task_id               VARCHAR(36)    NOT NULL          │ -- 固定タスクID
│     status                ENUM           NOT NULL          │ -- タスク状況
│     due_date              TIMESTAMP                        │ -- 期限日時
│     completed_at          TIMESTAMP                        │ -- 完了日時
│     notes                 TEXT                             │ -- 備考
│     created_at            TIMESTAMP      NOT NULL          │ -- 作成日時
│     updated_at            TIMESTAMP      NOT NULL          │ -- 更新日時
└─────────────────────────────────────────────────────────────┘
```

**インデックス:**
- `PRIMARY KEY (id)`
- `INDEX idx_applicant_id (applicant_id)`
- `INDEX idx_task_id (task_id)`
- `INDEX idx_status (status)`
- `INDEX idx_due_date (due_date)`

### 5. イベントテーブル（events）

```
┌─────────────────────────────────────────────────────────────┐
│                         events                             │
├─────────────────────────────────────────────────────────────┤
│ PK  id                    VARCHAR(36)    NOT NULL          │ -- イベントID
│     title                 VARCHAR(200)   NOT NULL          │ -- イベントタイトル
│     description           TEXT           NOT NULL          │ -- イベント説明
│     type                  ENUM           NOT NULL          │ -- イベントタイプ
│     venue                 VARCHAR(200)   NOT NULL          │ -- 開催場所
│     max_participants      INT            NOT NULL          │ -- 最大参加者数
│     status                ENUM           NOT NULL          │ -- イベント状況
│     created_at            TIMESTAMP      NOT NULL          │ -- 作成日時
│     updated_at            TIMESTAMP      NOT NULL          │ -- 更新日時
└─────────────────────────────────────────────────────────────┘
```

**インデックス:**
- `PRIMARY KEY (id)`
- `INDEX idx_status (status)`

### 6. イベントセッションテーブル（event_sessions）

```
┌─────────────────────────────────────────────────────────────┐
│                   event_sessions                           │
├─────────────────────────────────────────────────────────────┤
│ PK  id                    VARCHAR(36)    NOT NULL          │ -- セッションID
│ FK  event_id              VARCHAR(36)    NOT NULL          │ -- イベントID
│     title                 VARCHAR(200)   NOT NULL          │ -- セッションタイトル
│     description           TEXT           NOT NULL          │ -- セッション説明
│     start                 TIMESTAMP      NOT NULL          │ -- 開始時刻
│     end                   TIMESTAMP      NOT NULL          │ -- 終了時刻
│     venue                 VARCHAR(200)   NOT NULL          │ -- 開催場所
│     format                ENUM           NOT NULL          │ -- 開催形式
│     zoom_url              VARCHAR(500)                     │ -- ZOOM URL
│     notes                 TEXT                             │ -- 備考
└─────────────────────────────────────────────────────────────┘
```

**インデックス:**
- `PRIMARY KEY (id)`
- `INDEX idx_event_id (event_id)`
- `INDEX idx_start (start)`

### 7. イベント参加者テーブル（event_participants）

```
┌─────────────────────────────────────────────────────────────┐
│                 event_participants                         │
├─────────────────────────────────────────────────────────────┤
│ PK  id                    VARCHAR(36)    NOT NULL          │ -- 参加者ID
│ FK  session_id            VARCHAR(36)    NOT NULL          │ -- セッションID
│ FK  applicant_id          VARCHAR(36)    NOT NULL          │ -- 応募者ID
│     status                ENUM           NOT NULL          │ -- 参加状況
│     joined_at             TIMESTAMP                        │ -- 参加時刻
│     created_at            TIMESTAMP      NOT NULL          │ -- 作成日時
│     updated_at            TIMESTAMP      NOT NULL          │ -- 更新日時
└─────────────────────────────────────────────────────────────┘
```

**インデックス:**
- `PRIMARY KEY (id)`
- `INDEX idx_session_id (session_id)`
- `INDEX idx_applicant_id (applicant_id)`
- `INDEX idx_status (status)`

### 8. メールテンプレートテーブル（email_templates）

```
┌─────────────────────────────────────────────────────────────┐
│                   email_templates                          │
├─────────────────────────────────────────────────────────────┤
│ PK  id                    VARCHAR(36)    NOT NULL          │ -- テンプレートID
│     name                  VARCHAR(100)   NOT NULL          │ -- テンプレート名
│     subject               VARCHAR(200)   NOT NULL          │ -- 件名
│     body                  TEXT           NOT NULL          │ -- 本文
│     stage                 ENUM           NOT NULL          │ -- 対象選考段階
│     type                  ENUM           NOT NULL          │ -- メールタイプ
│     is_active             BOOLEAN        NOT NULL          │ -- 有効フラグ
│     created_at            TIMESTAMP      NOT NULL          │ -- 作成日時
│     updated_at            TIMESTAMP      NOT NULL          │ -- 更新日時
└─────────────────────────────────────────────────────────────┘
```

**インデックス:**
- `PRIMARY KEY (id)`
- `INDEX idx_stage (stage)`
- `INDEX idx_type (type)`
- `INDEX idx_is_active (is_active)`

### 9. メールログテーブル（email_logs）

```
┌─────────────────────────────────────────────────────────────┐
│                     email_logs                             │
├─────────────────────────────────────────────────────────────┤
│ PK  id                    VARCHAR(36)    NOT NULL          │ -- メールログID
│ FK  template_id           VARCHAR(36)    NOT NULL          │ -- テンプレートID
│ FK  applicant_id          VARCHAR(36)    NOT NULL          │ -- 応募者ID
│     subject               VARCHAR(200)   NOT NULL          │ -- 送信件名
│     body                  TEXT           NOT NULL          │ -- 送信本文
│     status                ENUM           NOT NULL          │ -- 送信状況
│     sent_at               TIMESTAMP      NOT NULL          │ -- 送信日時
│     delivered_at          TIMESTAMP                        │ -- 配信日時
│     error_message         TEXT                             │ -- エラーメッセージ
│     created_at            TIMESTAMP      NOT NULL          │ -- 作成日時
│     updated_at            TIMESTAMP      NOT NULL          │ -- 更新日時
└─────────────────────────────────────────────────────────────┘
```

**インデックス:**
- `PRIMARY KEY (id)`
- `INDEX idx_template_id (template_id)`
- `INDEX idx_applicant_id (applicant_id)`
- `INDEX idx_sent_at (sent_at)`
- `INDEX idx_status (status)`

### 10. 評価フォームテーブル（evaluation_forms）

```
┌─────────────────────────────────────────────────────────────┐
│                  evaluation_forms                          │
├─────────────────────────────────────────────────────────────┤
│ PK  id                    VARCHAR(36)    NOT NULL          │ -- 評価フォームID
│ FK  applicant_id          VARCHAR(36)    NOT NULL          │ -- 応募者ID
│     stage                 ENUM           NOT NULL          │ -- 評価対象段階
│     evaluator_id          VARCHAR(36)    NOT NULL          │ -- 評価者ID
│     evaluator_name        VARCHAR(100)   NOT NULL          │ -- 評価者名
│     evaluation_date       TIMESTAMP      NOT NULL          │ -- 評価日時
│     criteria              JSON           NOT NULL          │ -- 評価項目
│     overall_score         INT            NOT NULL          │ -- 総合評価点
│     comments              TEXT           NOT NULL          │ -- コメント
│     result                ENUM           NOT NULL          │ -- 評価結果
│     created_at            TIMESTAMP      NOT NULL          │ -- 作成日時
│     updated_at            TIMESTAMP      NOT NULL          │ -- 更新日時
└─────────────────────────────────────────────────────────────┘
```

## 列挙型（ENUM）定義

### SelectionStage（選考段階）
```sql
ENUM('エントリー', '書類選考', '会社説明会', '適性検査体験', 
     '職場見学', '仕事体験', '個別面接', '集団面接', 
     'CEOセミナー', '人事面接', '最終選考', '内定面談', '不採用')
```

### TaskType（タスクタイプ）
```sql
ENUM('アプローチ1', 'アプローチ1の実施', '詳細連絡', 
     '日程調整連絡', '提出書類', '結果連絡', 'リマインド')
```

### TaskStatus（タスクステータス）
```sql
ENUM('未着手', '完了', '提出待ち', '返信待ち')
```

### ContactStatus（連絡ステータス）
```sql
ENUM('未', '済', '返信待ち')
```

### ParticipationStatus（参加ステータス）
```sql
ENUM('参加', '不参加', '未定', '申込', '欠席')
```

### EventFormat（開催形式）
```sql
ENUM('対面', 'オンライン', 'ハイブリッド')
```

### EventType（イベントタイプ）
```sql
ENUM('会社説明会', '職場見学', 'CEOセミナー', '人事面接', '集団面接', 
     '書類選考', '適性検査', '仕事体験', '最終選考', '内定面談')
```

## 外部キー制約

```sql
-- 選考履歴 → 応募者
ALTER TABLE selection_histories 
ADD CONSTRAINT fk_selection_histories_applicant 
FOREIGN KEY (applicant_id) REFERENCES applicants(id) 
ON DELETE CASCADE;

-- タスクインスタンス → 応募者
ALTER TABLE task_instances 
ADD CONSTRAINT fk_task_instances_applicant 
FOREIGN KEY (applicant_id) REFERENCES applicants(id) 
ON DELETE CASCADE;

-- タスクインスタンス → 固定タスク
ALTER TABLE task_instances 
ADD CONSTRAINT fk_task_instances_task 
FOREIGN KEY (task_id) REFERENCES fixed_tasks(id) 
ON DELETE CASCADE;

-- イベントセッション → イベント
ALTER TABLE event_sessions 
ADD CONSTRAINT fk_event_sessions_event 
FOREIGN KEY (event_id) REFERENCES events(id) 
ON DELETE CASCADE;

-- イベント参加者 → セッション
ALTER TABLE event_participants 
ADD CONSTRAINT fk_event_participants_session 
FOREIGN KEY (session_id) REFERENCES event_sessions(id) 
ON DELETE CASCADE;

-- イベント参加者 → 応募者
ALTER TABLE event_participants 
ADD CONSTRAINT fk_event_participants_applicant 
FOREIGN KEY (applicant_id) REFERENCES applicants(id) 
ON DELETE CASCADE;

-- メールログ → テンプレート
ALTER TABLE email_logs 
ADD CONSTRAINT fk_email_logs_template 
FOREIGN KEY (template_id) REFERENCES email_templates(id) 
ON DELETE CASCADE;

-- メールログ → 応募者
ALTER TABLE email_logs 
ADD CONSTRAINT fk_email_logs_applicant 
FOREIGN KEY (applicant_id) REFERENCES applicants(id) 
ON DELETE CASCADE;

-- 評価フォーム → 応募者
ALTER TABLE evaluation_forms 
ADD CONSTRAINT fk_evaluation_forms_applicant 
FOREIGN KEY (applicant_id) REFERENCES applicants(id) 
ON DELETE CASCADE;
```

## データサンプル

### 応募者データ例
```sql
INSERT INTO applicants VALUES (
  'app-001',
  '田中太郎',
  'タナカタロウ',
  'tanaka@example.com',
  '090-1234-5678',
  '東京都渋谷区...',
  '北海道札幌市...',
  '東京大学',
  '工学部',
  '機械工学科',
  '2024',
  'マイナビ',
  '男性',
  '書類選考',
  '応募中',
  '優秀な学生',
  NOW(),
  NOW()
);
```

### 固定タスクデータ例
```sql
INSERT INTO fixed_tasks VALUES (
  'task-001',
  '書類選考',
  '書類確認',
  '応募書類の内容を確認する',
  '提出書類',
  1
);
```

### タスクインスタンスデータ例
```sql
INSERT INTO task_instances VALUES (
  'instance-001',
  'app-001',
  'task-001',
  '未着手',
  '2024-01-15 17:00:00',
  NULL,
  NULL,
  NOW(),
  NOW()
);
```

## パフォーマンス最適化

### 推奨インデックス戦略
1. **検索頻度の高いカラム**: `email`, `current_stage`, `status`
2. **結合条件**: `applicant_id`, `task_id`, `session_id`
3. **日付範囲検索**: `due_date`, `sent_at`
4. **複合インデックス**: `(applicant_id, status)`, `(stage, order)`

### パーティショニング戦略
- **日付ベース**: `email_logs`, `selection_histories`
- **段階ベース**: `task_instances`
- **応募者ベース**: `evaluation_forms`

---

## 関連ドキュメント

- [データベースリファクタリング計画](./database-refactoring-plan.md) - このスキーマの改善計画と実装詳細

---

*このドキュメントは採用管理システムのデータベース構造を詳細に説明し、開発・運用チームがデータベース設計を理解し、適切なクエリを書くための参考資料として作成されています。*
