# 採用管理システム ビジネスプロセス・データフロー図

## 採用プロセス全体フロー

```mermaid
flowchart TD
    A[応募者エントリー] --> B[応募者情報登録]
    B --> C[エントリー段階開始]
    C --> D[初期タスク生成]
    D --> E[書類選考]
    E --> F{書類選考結果}
    F -->|不合格| G[不採用処理]
    F -->|合格| H[会社説明会]
    H --> I[適性検査体験]
    I --> J[職場見学]
    J --> K[仕事体験]
    K --> L[個別面接]
    L --> M[集団面接]
    M --> N[CEOセミナー]
    N --> O[人事面接]
    O --> P[最終選考]
    P --> Q{最終結果}
    Q -->|合格| R[内定面談]
    Q -->|不合格| G
    R --> S[内定]
    
    style A fill:#e1f5fe
    style S fill:#c8e6c9
    style G fill:#ffcdd2
```

## 段階別タスク管理フロー

```mermaid
flowchart LR
    subgraph "エントリー段階"
        E1[エントリー確認]
        E2[初期連絡]
    end
    
    subgraph "書類選考段階"
        D1[書類確認]
        D2[書類評価]
        D3[結果連絡]
    end
    
    subgraph "面接段階"
        I1[面接日程調整]
        I2[面接実施]
        I3[面接評価]
        I4[結果連絡]
    end
    
    subgraph "最終段階"
        F1[最終面接]
        F2[内定判断]
        F3[内定連絡]
    end
    
    E1 --> E2 --> D1 --> D2 --> D3 --> I1 --> I2 --> I3 --> I4 --> F1 --> F2 --> F3
```

## タスク実行プロセス

```mermaid
flowchart TD
    A[タスク開始] --> B{タスクタイプ確認}
    
    B -->|連絡系| C[メールテンプレート選択]
    B -->|評価系| D[評価フォーム作成]
    B -->|その他| E[タスク実行]
    
    C --> F[メール送信]
    F --> G[送信ログ記録]
    G --> H[連絡ステータス更新]
    
    D --> I[評価実施]
    I --> J[評価結果記録]
    
    E --> K[タスク完了]
    H --> K
    J --> K
    
    K --> L{次のタスク確認}
    L -->|あり| M[次のタスク開始]
    L -->|なし| N[段階完了確認]
    
    M --> A
    N --> O{次の段階へ進む?}
    O -->|はい| P[次の段階開始]
    O -->|いいえ| Q[プロセス完了]
    
    P --> R[新しいタスク生成]
    R --> A
```

## イベント管理プロセス

```mermaid
flowchart TD
    A[イベント企画] --> B[イベント作成]
    B --> C[セッション設定]
    C --> D[参加者募集]
    D --> E[応募者登録]
    E --> F[参加確認]
    F --> G[イベント実施]
    G --> H[参加状況記録]
    H --> I[フォローアップ]
    
    subgraph "参加者管理"
        J[定員確認]
        K[重複参加チェック]
        L[参加キャンセル処理]
    end
    
    E --> J
    E --> K
    F --> L
```

## データ連携フロー

```mermaid
flowchart TD
    subgraph "応募者データ"
        A1[applicants]
        A2[selection_histories]
    end
    
    subgraph "タスクデータ"
        T1[fixed_tasks]
        T2[task_instances]
    end
    
    subgraph "イベントデータ"
        E1[events]
        E2[event_sessions]
        E3[event_participants]
    end
    
    subgraph "メールデータ"
        M1[email_templates]
        M2[email_logs]
    end
    
    subgraph "評価データ"
        V1[evaluation_forms]
    end
    
    A1 --> A2
    A1 --> T2
    A1 --> E3
    A1 --> M2
    A1 --> V1
    
    T1 --> T2
    E1 --> E2
    E2 --> E3
    M1 --> M2
```

## ステータス遷移図

### 応募者ステータス遷移

```mermaid
stateDiagram-v2
    [*] --> 応募中
    応募中 --> 内定: 最終選考合格
    応募中 --> 不採用: 選考不合格
    応募中 --> 辞退: 応募者辞退
    内定 --> 辞退: 内定辞退
    不採用 --> [*]
    辞退 --> [*]
```

### タスクステータス遷移

```mermaid
stateDiagram-v2
    [*] --> 未着手
    未着手 --> 進行中: タスク開始
    進行中 --> 完了: タスク完了
    進行中 --> 提出待ち: 応募者待ち
    提出待ち --> 完了: 提出完了
    提出待ち --> 返信待ち: 返信待ち
    返信待ち --> 完了: 返信完了
    完了 --> [*]
```

### 選考段階ステータス遷移

```mermaid
stateDiagram-v2
    [*] --> 進行中
    進行中 --> 完了: 段階完了
    進行中 --> 不採用: 不合格
    完了 --> 進行中: 次の段階
    完了 --> 内定: 最終合格
    不採用 --> [*]
    内定 --> [*]
```

## データ更新タイミング

```mermaid
gantt
    title 採用プロセス データ更新タイミング
    dateFormat  YYYY-MM-DD
    section 応募者情報
    応募者登録    :done, app_reg, 2024-01-01, 1d
    基本情報更新  :app_update, 2024-01-02, 30d
    
    section 選考履歴
    エントリー開始 :done, entry_start, 2024-01-01, 1d
    書類選考開始   :doc_start, 2024-01-03, 1d
    面接開始      :int_start, 2024-01-10, 1d
    最終選考開始   :final_start, 2024-01-20, 1d
    
    section タスク管理
    初期タスク生成 :task_gen, 2024-01-01, 1d
    タスク実行    :task_exec, 2024-01-02, 25d
    タスク完了    :task_complete, 2024-01-25, 1d
    
    section イベント
    説明会開催    :event_hold, 2024-01-05, 1d
    参加者管理    :participant_mgmt, 2024-01-04, 3d
```

## システム連携図

```mermaid
graph TB
    subgraph "フロントエンド"
        UI[ユーザーインターフェース]
    end
    
    subgraph "バックエンド"
        API[API サーバー]
        AUTH[認証サービス]
    end
    
    subgraph "データベース"
        DB[(データベース)]
        CACHE[(キャッシュ)]
    end
    
    subgraph "外部サービス"
        EMAIL[メールサービス]
        STORAGE[ファイルストレージ]
        ANALYTICS[分析サービス]
    end
    
    UI --> API
    API --> AUTH
    API --> DB
    API --> CACHE
    API --> EMAIL
    API --> STORAGE
    API --> ANALYTICS
    
    EMAIL --> DB
    STORAGE --> DB
```

## エラーハンドリングフロー

```mermaid
flowchart TD
    A[処理開始] --> B{入力検証}
    B -->|エラー| C[バリデーションエラー]
    B -->|OK| D{データベース処理}
    
    D -->|エラー| E[データベースエラー]
    D -->|OK| F{外部サービス連携}
    
    F -->|エラー| G[外部サービスエラー]
    F -->|OK| H[処理完了]
    
    C --> I[エラーログ記録]
    E --> I
    G --> I
    
    I --> J[ユーザーにエラー通知]
    J --> K[処理終了]
    H --> K
```

## 監査ログフロー

```mermaid
flowchart LR
    A[ユーザーアクション] --> B[アクション記録]
    B --> C[データ変更記録]
    C --> D[監査ログ保存]
    D --> E[ログ分析]
    E --> F[セキュリティ監査]
    
    subgraph "監査項目"
        G[アクセス時刻]
        H[ユーザーID]
        I[操作内容]
        J[変更前データ]
        K[変更後データ]
    end
    
    B --> G
    B --> H
    B --> I
    C --> J
    C --> K
```

## パフォーマンス監視

```mermaid
graph TB
    subgraph "監視対象"
        A[API レスポンス時間]
        B[データベースクエリ時間]
        C[メモリ使用量]
        D[CPU使用率]
        E[ディスクI/O]
    end
    
    subgraph "アラート"
        F[レスポンス時間超過]
        G[データベース遅延]
        H[メモリ不足]
        I[CPU高負荷]
        J[ディスク容量不足]
    end
    
    A --> F
    B --> G
    C --> H
    D --> I
    E --> J
    
    subgraph "対応"
        K[スケールアウト]
        L[クエリ最適化]
        M[メモリ増設]
        N[負荷分散]
        O[ストレージ拡張]
    end
    
    F --> K
    G --> L
    H --> M
    I --> N
    J --> O
```

## バックアップ・復旧フロー

```mermaid
flowchart TD
    A[定期バックアップ] --> B[データベースバックアップ]
    B --> C[ファイルバックアップ]
    C --> D[設定ファイルバックアップ]
    D --> E[バックアップ検証]
    
    E --> F{バックアップ成功?}
    F -->|失敗| G[バックアップエラー通知]
    F -->|成功| H[バックアップ完了]
    
    I[障害発生] --> J[障害検知]
    J --> K[復旧手順開始]
    K --> L[最新バックアップ復元]
    L --> M[データ整合性確認]
    M --> N[サービス再開]
    
    G --> O[管理者通知]
    H --> P[バックアップログ記録]
    N --> Q[復旧完了通知]
```

---

*このドキュメントは採用管理システムのビジネスプロセスとデータフローを視覚的に表現し、システムの動作とデータの流れを理解しやすくすることを目的としています。*
