# 採用管理システム API仕様書

## 概要

このドキュメントは採用管理システム（ATS4）のAPI仕様を定義します。RESTful APIの設計原則に従い、JSON形式でのデータ交換を行います。

## 基本情報

- **ベースURL**: `https://api.ats4.example.com/v1`
- **認証方式**: Bearer Token (JWT)
- **データ形式**: JSON
- **文字エンコーディング**: UTF-8

## 共通レスポンス形式

### 成功レスポンス

```json
{
  "success": true,
  "data": {
    // レスポンスデータ
  },
  "message": "操作が成功しました"
}
```

### エラーレスポンス

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": {
      // 詳細エラー情報
    }
  }
}
```

### ページネーション

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

## エンドポイント一覧

### 1. 応募者管理 API

#### 1.1 応募者一覧取得

```http
GET /applicants
```

**クエリパラメータ**:
- `page` (number): ページ番号（デフォルト: 1）
- `limit` (number): 1ページあたりの件数（デフォルト: 20）
- `search` (string): 検索キーワード（名前、メールアドレス）
- `stage` (string): 選考段階でフィルタ
- `status` (string): ステータスでフィルタ
- `source` (string): 応募元でフィルタ

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "applicant-1",
        "name": "田中 太郎",
        "nameKana": "タナカ タロウ",
        "email": "tanaka@example.com",
        "phone": "090-1234-5678",
        "address": "東京都渋谷区",
        "education": "東京大学 工学部 情報工学科",
        "graduationYear": "2025年卒業予定",
        "source": "マイナビ",
        "gender": "男性",
        "currentStage": "人事面接",
        "status": "応募中",
        "notes": "優秀な学生",
        "createdAt": "2024-01-15T09:00:00Z",
        "updatedAt": "2024-01-20T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

#### 1.2 応募者詳細取得

```http
GET /applicants/{id}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "applicant": {
      "id": "applicant-1",
      "name": "田中 太郎",
      "nameKana": "タナカ タロウ",
      "email": "tanaka@example.com",
      "phone": "090-1234-5678",
      "address": "東京都渋谷区",
      "education": "東京大学 工学部 情報工学科",
      "graduationYear": "2025年卒業予定",
      "source": "マイナビ",
      "gender": "男性",
      "currentStage": "人事面接",
      "status": "応募中",
      "notes": "優秀な学生",
      "createdAt": "2024-01-15T09:00:00Z",
      "updatedAt": "2024-01-20T14:30:00Z"
    },
    "selectionHistory": [
      {
        "id": "history-1",
        "stage": "エントリー",
        "startDate": "2024-01-15T09:00:00Z",
        "endDate": "2024-01-16T17:00:00Z",
        "status": "完了",
        "result": "合格",
        "notes": "エントリーシート確認完了"
      }
    ],
    "currentTasks": [
      {
        "id": "task-1",
        "title": "詳細連絡",
        "description": "人事面接の詳細について連絡する",
        "status": "完了",
        "dueDate": "2024-01-21T17:00:00Z",
        "type": "詳細連絡"
      }
    ]
  }
}
```

#### 1.3 応募者作成

```http
POST /applicants
```

**リクエストボディ**:
```json
{
  "name": "田中 太郎",
  "nameKana": "タナカ タロウ",
  "email": "tanaka@example.com",
  "phone": "090-1234-5678",
  "address": "東京都渋谷区",
  "education": "東京大学 工学部 情報工学科",
  "graduationYear": "2025年卒業予定",
  "source": "マイナビ",
  "gender": "男性",
  "notes": "優秀な学生"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "applicant-1",
    "name": "田中 太郎",
    "currentStage": "エントリー",
    "status": "応募中",
    "createdAt": "2024-01-15T09:00:00Z"
  },
  "message": "応募者が正常に作成されました"
}
```

#### 1.4 応募者更新

```http
PUT /applicants/{id}
```

**リクエストボディ**:
```json
{
  "name": "田中 太郎",
  "nameKana": "タナカ タロウ",
  "email": "tanaka@example.com",
  "phone": "090-1234-5678",
  "address": "東京都渋谷区",
  "education": "東京大学 工学部 情報工学科",
  "graduationYear": "2025年卒業予定",
  "source": "マイナビ",
  "gender": "男性",
  "notes": "優秀な学生"
}
```

#### 1.5 応募者削除

```http
DELETE /applicants/{id}
```

### 2. 選考履歴管理 API

#### 2.1 選考履歴一覧取得

```http
GET /applicants/{id}/selection-history
```

**レスポンス**:
```json
{
  "success": true,
  "data": [
    {
      "id": "history-1",
      "stage": "エントリー",
      "startDate": "2024-01-15T09:00:00Z",
      "endDate": "2024-01-16T17:00:00Z",
      "status": "完了",
      "result": "合格",
      "notes": "エントリーシート確認完了"
    }
  ]
}
```

#### 2.2 選考段階進行

```http
POST /applicants/{id}/advance-stage
```

**リクエストボディ**:
```json
{
  "nextStage": "書類選考",
  "notes": "エントリー段階完了"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "currentStage": "書類選考",
    "newHistory": {
      "id": "history-2",
      "stage": "書類選考",
      "startDate": "2024-01-17T09:00:00Z",
      "status": "進行中"
    },
    "newTasks": [
      {
        "id": "task-2",
        "title": "詳細連絡",
        "description": "書類選考の詳細について連絡する",
        "status": "未着手",
        "type": "詳細連絡"
      }
    ]
  },
  "message": "選考段階が正常に進行しました"
}
```

### 3. タスク管理 API

#### 3.1 タスク一覧取得

```http
GET /tasks
```

**クエリパラメータ**:
- `applicantId` (string): 応募者IDでフィルタ
- `stage` (string): 選考段階でフィルタ
- `status` (string): ステータスでフィルタ
- `page` (number): ページ番号
- `limit` (number): 1ページあたりの件数

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "task-1",
        "title": "詳細連絡",
        "description": "人事面接の詳細について連絡する",
        "status": "完了",
        "dueDate": "2024-01-21T17:00:00Z",
        "type": "詳細連絡",
        "applicant": {
          "id": "applicant-1",
          "name": "田中 太郎",
          "currentStage": "人事面接"
        },
        "createdAt": "2024-01-20T14:30:00Z",
        "updatedAt": "2024-01-20T16:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### 3.2 タスク詳細取得

```http
GET /tasks/{id}
```

#### 3.3 タスクステータス更新

```http
PUT /tasks/{id}/status
```

**リクエストボディ**:
```json
{
  "status": "完了",
  "contactStatus": "済",
  "notes": "連絡完了"
}
```

#### 3.4 タスク期限設定

```http
PUT /tasks/{id}/due-date
```

**リクエストボディ**:
```json
{
  "dueDate": "2024-01-25T17:00:00Z"
}
```

### 4. イベント管理 API

#### 4.1 イベント一覧取得

```http
GET /events
```

**クエリパラメータ**:
- `type` (string): イベントタイプでフィルタ
- `status` (string): ステータスでフィルタ
- `startDate` (string): 開始日でフィルタ
- `endDate` (string): 終了日でフィルタ

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "event-1",
        "title": "会社説明会",
        "description": "2025年度新卒採用 会社説明会",
        "type": "会社説明会",
        "startDate": "2024-02-15T10:00:00Z",
        "endDate": "2024-02-15T16:00:00Z",
        "venue": "本社ビル 3階会議室",
        "maxParticipants": 50,
        "status": "予定",
        "sessions": [
          {
            "id": "session-1",
            "title": "午前の部",
            "start": "2024-02-15T10:00:00Z",
            "end": "2024-02-15T12:00:00Z",
            "format": "対面",
            "participantCount": 25
          }
        ]
      }
    ]
  }
}
```

#### 4.2 イベント作成

```http
POST /events
```

**リクエストボディ**:
```json
{
  "title": "会社説明会",
  "description": "2025年度新卒採用 会社説明会",
  "type": "会社説明会",
  "startDate": "2024-02-15T10:00:00Z",
  "endDate": "2024-02-15T16:00:00Z",
  "venue": "本社ビル 3階会議室",
  "maxParticipants": 50,
  "sessions": [
    {
      "title": "午前の部",
      "start": "2024-02-15T10:00:00Z",
      "end": "2024-02-15T12:00:00Z",
      "venue": "本社ビル 3階会議室",
      "format": "対面"
    }
  ]
}
```

#### 4.3 イベント参加登録

```http
POST /events/{eventId}/sessions/{sessionId}/participants
```

**リクエストボディ**:
```json
{
  "applicantId": "applicant-1",
  "status": "申込"
}
```

### 5. メール管理 API

#### 5.1 メールテンプレート一覧取得

```http
GET /email-templates
```

**クエリパラメータ**:
- `stage` (string): 選考段階でフィルタ
- `type` (string): テンプレートタイプでフィルタ

**レスポンス**:
```json
{
  "success": true,
  "data": [
    {
      "id": "template-1",
      "name": "詳細連絡テンプレート",
      "subject": "【{company_name}】{stage}の詳細について",
      "body": "拝啓\n\n{applicant_name}様\n\n{stage}の詳細についてご連絡いたします。\n\n...",
      "stage": "人事面接",
      "type": "詳細連絡",
      "isActive": true
    }
  ]
}
```

#### 5.2 メール送信

```http
POST /email/send
```

**リクエストボディ**:
```json
{
  "templateId": "template-1",
  "applicantId": "applicant-1",
  "variables": {
    "company_name": "株式会社サンプル",
    "stage": "人事面接",
    "applicant_name": "田中太郎"
  }
}
```

#### 5.3 メール送信履歴取得

```http
GET /email/logs
```

**クエリパラメータ**:
- `applicantId` (string): 応募者IDでフィルタ
- `status` (string): 送信ステータスでフィルタ
- `startDate` (string): 開始日でフィルタ
- `endDate` (string): 終了日でフィルタ

### 6. 評定表管理 API

#### 6.1 評定表一覧取得

```http
GET /evaluation-forms
```

**クエリパラメータ**:
- `applicantId` (string): 応募者IDでフィルタ
- `stage` (string): 選考段階でフィルタ
- `evaluatorId` (string): 評価者IDでフィルタ

#### 6.2 評定表作成

```http
POST /evaluation-forms
```

**リクエストボディ**:
```json
{
  "applicantId": "applicant-1",
  "stage": "人事面接",
  "evaluatorId": "evaluator-1",
  "evaluatorName": "田中部長",
  "evaluationDate": "2024-01-20T14:30:00Z",
  "criteria": [
    {
      "name": "コミュニケーション能力",
      "score": 4,
      "weight": 0.3,
      "comments": "非常に優秀"
    },
    {
      "name": "専門知識",
      "score": 5,
      "weight": 0.4,
      "comments": "期待以上"
    }
  ],
  "overallScore": 4.5,
  "comments": "総合的に優秀な人材",
  "result": "合格"
}
```

### 7. レポート API

#### 7.1 採用指標レポート

```http
GET /reports/recruitment-metrics
```

**クエリパラメータ**:
- `startDate` (string): 開始日
- `endDate` (string): 終了日
- `groupBy` (string): グループ化（日、週、月）

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "totalApplicants": 150,
    "activeApplicants": 120,
    "completedStages": {
      "エントリー": 150,
      "書類選考": 100,
      "人事面接": 50,
      "最終選考": 20
    },
    "conversionRates": {
      "エントリー→書類選考": 66.7,
      "書類選考→人事面接": 50.0,
      "人事面接→最終選考": 40.0
    },
    "averageProcessingTime": {
      "エントリー": 2.5,
      "書類選考": 5.2,
      "人事面接": 3.8
    }
  }
}
```

#### 7.2 応募者分析レポート

```http
GET /reports/applicant-analysis
```

#### 7.3 タスク進捗レポート

```http
GET /reports/task-progress
```

## エラーコード

### 共通エラーコード

| コード | メッセージ | 説明 |
|--------|------------|------|
| `AUTH_REQUIRED` | 認証が必要です | 認証トークンが無効または期限切れ |
| `PERMISSION_DENIED` | 権限がありません | リソースへのアクセス権限がない |
| `VALIDATION_ERROR` | バリデーションエラー | リクエストデータの形式が不正 |
| `RESOURCE_NOT_FOUND` | リソースが見つかりません | 指定されたIDのリソースが存在しない |
| `INTERNAL_SERVER_ERROR` | 内部サーバーエラー | サーバー内部でエラーが発生 |

### ビジネスロジックエラー

| コード | メッセージ | 説明 |
|--------|------------|------|
| `INVALID_STAGE_TRANSITION` | 無効な段階遷移です | 現在の段階から指定された段階に進めない |
| `TASK_DEPENDENCY_NOT_MET` | タスクの依存関係が満たされていません | 必須タスクが完了していない |
| `EVENT_FULL` | イベントの定員に達しています | イベントの参加者数が上限に達した |
| `DUPLICATE_EMAIL` | 重複するメールアドレスです | 既に登録されているメールアドレス |
| `INVALID_DATE_RANGE` | 無効な日付範囲です | 開始日が終了日より後 |

## 認証・認可

### JWT認証

```http
Authorization: Bearer <jwt_token>
```

### ロールベースアクセス制御

- **管理者**: 全機能にアクセス可能
- **採用担当者**: 応募者管理、タスク管理、イベント管理
- **面接官**: 評定表管理、選考履歴閲覧
- **一般ユーザー**: 応募者一覧閲覧のみ

## レート制限

- **一般エンドポイント**: 1000リクエスト/時間
- **メール送信**: 100リクエスト/時間
- **レポート生成**: 50リクエスト/時間

## バージョニング

APIのバージョンはURLパスで管理します：

- `v1`: 現在の安定版
- `v2`: 開発中の次期バージョン

## 変更履歴

### v1.0.0 (2024-01-15)
- 初回リリース
- 基本的なCRUD操作
- 認証・認可機能

### v1.1.0 (2024-02-01)
- レポート機能追加
- メール送信機能強化
- パフォーマンス改善

---

*このAPI仕様書は採用管理システムの開発・運用の参考として作成されています。実際の実装時には、セキュリティ要件やパフォーマンス要件に応じて適切に調整してください。*

