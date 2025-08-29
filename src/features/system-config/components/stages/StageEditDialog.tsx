// 選考段階編集ダイアログ

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ColorSchemeSelect } from '../common/ColorSchemeSelect';
import { IconSelect } from '../common/IconSelect';
import type {
  SelectionStageDefinition,
  CreateSelectionStageInput,
  UpdateSelectionStageInput,
  StageGroup,
  SessionType,
  ColorScheme
} from '@/features/system-config/types';
import { STAGE_GROUPS, SESSION_TYPES } from '@/features/system-config/types';

interface StageEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage?: SelectionStageDefinition;
  onSave: (data: CreateSelectionStageInput | UpdateSelectionStageInput) => Promise<void>;
  maxSortOrder: number;
}

export const StageEditDialog = ({ 
  open, 
  onOpenChange, 
  stage, 
  onSave, 
  maxSortOrder 
}: StageEditDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    stageGroup: 'その他' as StageGroup,
    sortOrder: maxSortOrder + 1,
    isActive: true,
    colorScheme: 'blue' as ColorScheme,
    icon: '',
    estimatedDurationMinutes: 60,
    requiresSession: false,
    sessionTypes: [] as SessionType[]
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ダイアログが開かれた時にフォームデータを初期化
  useEffect(() => {
    if (open) {
      if (stage) {
        // 編集モード
        setFormData({
          name: stage.name,
          displayName: stage.displayName,
          description: stage.description || '',
          stageGroup: stage.stageGroup,
          sortOrder: stage.sortOrder,
          isActive: stage.isActive,
          colorScheme: stage.colorScheme,
          icon: stage.icon || '',
          estimatedDurationMinutes: stage.estimatedDurationMinutes,
          requiresSession: stage.requiresSession,
          sessionTypes: stage.sessionTypes
        });
      } else {
        // 新規作成モード
        setFormData({
          name: '',
          displayName: '',
          description: '',
          stageGroup: 'その他',
          sortOrder: maxSortOrder + 1,
          isActive: true,
          colorScheme: 'blue',
          icon: '',
          estimatedDurationMinutes: 60,
          requiresSession: false,
          sessionTypes: []
        });
      }
      setErrors({});
    }
  }, [open, stage, maxSortOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = '名前は必須です';
    if (!formData.displayName.trim()) newErrors.displayName = '表示名は必須です';
    if (formData.estimatedDurationMinutes < 1) newErrors.estimatedDurationMinutes = '所要時間は1分以上で設定してください';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionTypeChange = (sessionType: SessionType, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sessionTypes: checked
        ? [...prev.sessionTypes, sessionType]
        : prev.sessionTypes.filter(t => t !== sessionType)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {stage ? '選考段階編集' : '選考段階作成'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">基本情報</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">段階名称 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="例: 書類選考"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">表示名 *</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="例: 書類選考"
                />
                {errors.displayName && <p className="text-sm text-red-600">{errors.displayName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="選考段階の詳細説明"
                rows={3}
              />
            </div>
          </div>

          {/* グループ・分類 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">グループ・分類</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>段階グループ</Label>
                <Select 
                  value={formData.stageGroup} 
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, stageGroup: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGE_GROUPS.map(group => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>色スキーム</Label>
                <ColorSchemeSelect
                  value={formData.colorScheme}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, colorScheme: value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>アイコン</Label>
                <IconSelect
                  value={formData.icon}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sortOrder">表示順序</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min="1"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) }))}
                />
              </div>
            </div>
          </div>

          {/* セッション設定 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">セッション設定</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresSession"
                  checked={formData.requiresSession}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, requiresSession: !!checked }))
                  }
                />
                <Label htmlFor="requiresSession" className="font-medium">セッション予約が必要</Label>
              </div>
              
              <div className="ml-6 space-y-2">
                <p className="text-sm text-gray-600">
                  {formData.requiresSession 
                    ? 'この段階では面接や説明会などのセッション予約が必要です。ステータス管理も有効になります。'
                    : 'この段階ではセッション予約は不要です。ステータス管理も無効になります。'
                  }
                </p>
                {!formData.requiresSession && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>注意:</strong> セッション不要に設定すると、この段階のステータス管理は無効になります。
                      既存のステータス設定は保持されますが、応募者管理では使用されません。
                    </p>
                  </div>
                )}
              </div>

              {formData.requiresSession && (
                <>
                  <div className="space-y-2">
                    <Label>セッション形式</Label>
                    <div className="flex flex-wrap gap-4">
                      {SESSION_TYPES.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`session-${type}`}
                            checked={formData.sessionTypes.includes(type)}
                            onCheckedChange={(checked) => handleSessionTypeChange(type, !!checked)}
                          />
                          <Label htmlFor={`session-${type}`}>{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedDuration">推定所要時間（分）</Label>
                    <Input
                      id="estimatedDuration"
                      type="number"
                      min="1"
                      value={formData.estimatedDurationMinutes}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        estimatedDurationMinutes: parseInt(e.target.value) 
                      }))}
                    />
                    {errors.estimatedDurationMinutes && (
                      <p className="text-sm text-red-600">{errors.estimatedDurationMinutes}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* アクティブ設定 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isActive: !!checked }))
                }
              />
              <Label htmlFor="isActive">アクティブ（使用中）</Label>
            </div>
            <p className="text-sm text-gray-600">
              無効にすると、この段階は選考プロセスで使用されなくなります。
            </p>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : (stage ? '更新' : '作成')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// デフォルトエクスポートも追加
export default StageEditDialog;
