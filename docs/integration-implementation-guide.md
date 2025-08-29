# 案1拡張方式 実装ガイド

## 実装状況

### ✅ 完了項目
1. **統合データアクセス層の作成**
   - `IntegratedSystemConfigDataAccess` - eventsテーブル連携
   - 既存データから新設定システム形式への変換機能
   - stage_config JSONB フィールドの活用

2. **統合フックの実装**
   - `useIntegratedStageConfig` - 選考段階管理フック
   - `useIntegratedSystemConfig` - システム設定管理フック
   - 既存データとの完全互換

3. **UIコンポーネントの更新**
   - `StageConfigPage` - 統合フック使用に変更
   - `SystemConfigIndexPage` - 統合フック使用に変更

### 🔄 現在の作業
4. **既存システムとの互換性確保**

## 次の実装手順

### 即座に実行可能なテスト手順

1. **アプリケーション起動確認**
```bash
npm run dev
```

2. **システム設定ページアクセス**
- `http://localhost:5173/system-config` にアクセス
- 既存の events データが表示されることを確認

3. **段階管理ページアクセス**  
- `http://localhost:5173/system-config/stages` にアクセス
- スクリーンショットで確認したデータ（エントリー、書類選考等）が表示されること

4. **編集機能テスト**
- 任意の段階を編集してみる
- stage_config が正しく更新されることを確認

### 必要な追加実装

#### A. 互換性確保（高優先度）

##### A-1: 既存EventDataAccessとの共存
```typescript
// src/lib/dataAccess/eventDataAccess.ts に追加
export class EventDataAccess {
  // 既存メソッドは無変更で維持

  /**
   * システム設定連携用：stage_config を更新
   */
  static async updateStageConfig(eventId: string, config: StageConfig): Promise<void> {
    const { error } = await supabase
      .from('events')
      .update({
        stage_config: {
          ...config,
          config_version: (config.config_version || 0) + 1,
          updated_by_system: true,
          updated_at: new Date().toISOString()
        }
      })
      .eq('id', eventId);

    if (error) throw error;
  }

  /**
   * システム設定で管理されているかチェック
   */  
  static isSystemManaged(event: Event): boolean {
    return event.stageConfig?.created_by_system === true;
  }
}
```

##### A-2: 型定義の段階的移行
```typescript
// src/features/applicants/types/applicant.ts を段階的に更新

// 既存の固定型を維持しつつ、動的型も受け入れる
export type SelectionStage = string; // 将来的な動的型対応

// 既存型との互換性チェック用ユーティリティ
export const LEGACY_SELECTION_STAGES = [
  'エントリー', '書類選考', '会社説明会', '適性検査', '適性検査体験',
  '職場見学', '仕事体験', '個別面接', '人事面接', '集団面接',
  '最終選考', 'CEOセミナー', '内定面談', '不採用'
] as const;

export const isValidSelectionStage = (stage: string): stage is SelectionStage => {
  // 動的バリデーション - eventsテーブルから有効な段階を取得
  return true; // 実装は後で
};
```

#### B. エラーハンドリングの強化

##### B-1: 統合データアクセスのエラー処理
```typescript
// IntegratedSystemConfigDataAccess に追加
export class IntegratedSystemConfigDataAccess {
  /**
   * フォールバック付きデータ取得
   */
  static async getAllSelectionStagesWithFallback(): Promise<SelectionStageDefinition[]> {
    try {
      return await this.getAllSelectionStages();
    } catch (error) {
      console.error('Failed to load from events table, using fallback:', error);
      
      // 既存の固定データをフォールバックとして使用
      return LEGACY_SELECTION_STAGES.map((stage, index) => ({
        id: `fallback-${index}`,
        name: stage,
        displayName: stage,
        description: '',
        stageGroup: '選考',
        sortOrder: index,
        isActive: true,
        colorScheme: 'blue',
        icon: '',
        estimatedDurationMinutes: 60,
        requiresSession: false,
        sessionTypes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }));
    }
  }
}
```

#### C. 段階的なデータ移行支援

##### C-1: データ移行ユーティリティ
```typescript
// src/lib/utils/stageConfigMigration.ts
export class StageConfigMigrationUtils {
  /**
   * 既存 events の stage_config を初期化
   */
  static async initializeStageConfigs(): Promise<void> {
    const events = await EventDataAccess.getAllEvents();
    
    const updatePromises = events.map(async (event) => {
      if (!event.stageConfig?.created_by_system) {
        const defaultConfig = {
          display_name: event.name,
          description: event.description,
          stage_group: this.inferStageGroup(event.stage),
          is_active: true,
          color_scheme: this.inferColorScheme(event.stage),
          icon: this.inferIcon(event.stage),
          estimated_duration_minutes: 60,
          requires_session: this.inferRequiresSession(event.stage),
          session_types: this.inferSessionTypes(event.stage),
          created_by_system: true,
          config_version: 1
        };

        await EventDataAccess.updateStageConfig(event.id, defaultConfig);
      }
    });

    await Promise.all(updatePromises);
  }

  private static inferStageGroup(stage: string): StageGroup {
    if (['エントリー'].includes(stage)) return 'エントリー';
    if (['会社説明会', 'CEOセミナー', '適性検査体験', '職場見学', '仕事体験'].includes(stage)) return 'インターンシップ';
    if (['書類選考', '人事面接', '集団面接', '最終選考', '内定面談'].includes(stage)) return '選考';
    return 'その他';
  }

  private static inferColorScheme(stage: string): ColorScheme {
    const colorMap: Record<string, ColorScheme> = {
      'エントリー': 'blue',
      '書類選考': 'purple',
      '会社説明会': 'indigo',
      '適性検査体験': 'yellow',
      '職場見学': 'orange',
      '仕事体験': 'red',
      '人事面接': 'teal',
      '集団面接': 'cyan',
      'CEOセミナー': 'pink',
      '最終選考': 'violet',
      '内定面談': 'emerald',
      '不採用': 'gray'
    };
    return colorMap[stage] || 'blue';
  }

  private static inferRequiresSession(stage: string): boolean {
    const sessionRequired = [
      '会社説明会', '適性検査体験', '職場見学', '仕事体験',
      '人事面接', '集団面接', 'CEOセミナー', '最終選考', '内定面談'
    ];
    return sessionRequired.includes(stage);
  }

  private static inferSessionTypes(stage: string): SessionType[] {
    if (['会社説明会', '職場見学'].includes(stage)) return ['対面'];
    if (['適性検査体験'].includes(stage)) return ['オンライン'];
    return ['対面', 'オンライン', 'ハイブリッド'];
  }

  private static inferIcon(stage: string): string {
    const iconMap: Record<string, string> = {
      'エントリー': 'user-plus',
      '書類選考': 'file-text',  
      '会社説明会': 'presentation',
      '適性検査体験': 'brain',
      '職場見学': 'building',
      '仕事体験': 'briefcase',
      '人事面接': 'user',
      '集団面接': 'users',
      'CEOセミナー': 'award',
      '最終選考': 'star',
      '内定面談': 'check-circle',
      '不採用': 'x-circle'
    };
    return iconMap[stage] || '';
  }
}
```

## 動作確認手順

### 1. 基本動作確認
```bash
# 1. アプリケーション起動
npm run dev

# 2. ブラウザで確認
# - http://localhost:5173/system-config
# - http://localhost:5173/system-config/stages
```

### 2. データ表示確認
- [ ] 既存の events データが選考段階として表示される
- [ ] スクリーンショットのデータ（エントリー、会社説明会等）が見える
- [ ] 段階の並び順が sort_order に従って表示される

### 3. 編集機能確認
- [ ] 段階の編集ダイアログが開く
- [ ] 色やアイコンの変更ができる
- [ ] 保存後、events.stage_config が更新される

### 4. 互換性確認
- [ ] 既存の events 関連機能が正常動作する
- [ ] EventDataAccess の既存メソッドが影響を受けない

## トラブルシューティング

### よくある問題と解決方法

#### 1. データが表示されない
**原因**: stage_config が未設定のため
**解決**: マイグレーションユーティリティを実行
```typescript
await StageConfigMigrationUtils.initializeStageConfigs();
```

#### 2. 編集が保存されない
**原因**: events テーブルの権限設定
**解決**: Supabase の RLS設定を確認

#### 3. 既存機能が動作しない  
**原因**: EventDataAccess との競合
**解決**: 段階的に統合フックに移行

## 推奨される展開順序

### Phase 1: 基本機能（即座に実行可能）
1. 統合データアクセス層のテスト
2. 設定画面での既存データ表示確認
3. 基本的な編集機能の動作確認

### Phase 2: 互換性確保（1週間以内）
1. 既存システムとの並行動作確認
2. EventDataAccess との共存実装
3. エラーハンドリングの強化

### Phase 3: 完全統合（2週間以内）
1. 全ての設定画面の統合フック化
2. 既存システムからの段階的移行
3. データ整合性の確保

## 成功の指標

- [ ] 既存 events データが新設定システムで表示・編集できる
- [ ] 既存機能（イベント管理等）が影響を受けない
- [ ] 新設定で変更した内容が既存システムに反映される
- [ ] パフォーマンスが既存システム以上を維持

この実装により、既存データを活用しながら新しい設定管理機能を提供できます。