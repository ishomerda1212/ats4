// タスク編集ダイアログ

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type {
  IntegratedTaskDefinition,
  CreateTaskDefinitionInput,
  UpdateTaskDefinitionInput,
  TaskType
} from '@/lib/dataAccess/integratedTaskDataAccess';
import { TASK_TYPES } from '@/lib/dataAccess/integratedTaskDataAccess';

interface TaskEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: IntegratedTaskDefinition;
  stageId: string;
  stageName: string;
  onSave: (data: CreateTaskDefinitionInput | UpdateTaskDefinitionInput) => Promise<void>;
  maxSortOrder: number;
}

export const TaskEditDialog = ({ 
  open, 
  onOpenChange, 
  task, 
  stageId,
  stageName,
  onSave, 
  maxSortOrder 
}: TaskEditDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    taskType: 'general' as TaskType,
    sortOrder: maxSortOrder + 1,
    isRequired: true,
    isActive: true,
    dueOffsetDays: undefined as number | undefined,
    emailTemplateId: undefined as string | undefined
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ダイアログが開かれた時にフォームデータを初期化
  useEffect(() => {
    if (open) {
      if (task) {
        // 編集モード
        setFormData({
          name: task.name,
          displayName: task.displayName,
          description: task.description,
          taskType: task.taskType,
          sortOrder: task.sortOrder,
          isRequired: task.isRequired,
          isActive: task.isActive,
          dueOffsetDays: task.dueOffsetDays,
          emailTemplateId: task.emailTemplateId
        });
      } else {
        // 新規作成モード
        setFormData({
          name: '',
          displayName: '',
          description: '',
          taskType: 'general',
          sortOrder: maxSortOrder + 1,
          isRequired: true,
          isActive: true,
          dueOffsetDays: undefined,
          emailTemplateId: undefined
        });
      }
      setErrors({});
    }
  }, [open, task, maxSortOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'タスク名は必須です';
    if (!formData.displayName.trim()) newErrors.displayName = '表示名は必須です';
    if (formData.dueOffsetDays !== undefined && formData.dueOffsetDays < 0) {
      newErrors.dueOffsetDays = '相対期限は0以上で設定してください';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      
      const saveData = task ? formData : { ...formData, stageId };
      await onSave(saveData);
      onOpenChange(false);
    } catch (error) {
      console.error('Save failed:', error);
      setErrors({ general: error instanceof Error ? error.message : '保存に失敗しました' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {task ? 'タスク編集' : 'タスク作成'}
            <span className="text-sm font-normal text-gray-600 ml-2">
              段階: {stageName}
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* エラー表示 */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          {/* 基本情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">基本情報</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">タスク名 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="例: 詳細連絡"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">表示名 *</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="例: 詳細連絡"
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
                placeholder="タスクの詳細説明"
                rows={3}
              />
            </div>
          </div>

          {/* タスク設定 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">タスク設定</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>タスクタイプ</Label>
                <Select 
                  value={formData.taskType} 
                  onValueChange={(value: TaskType) => setFormData(prev => ({ ...prev, taskType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            <div className="space-y-2">
              <Label htmlFor="dueOffsetDays">相対期限（日数）</Label>
              <Input
                id="dueOffsetDays"
                type="number"
                min="0"
                value={formData.dueOffsetDays || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  dueOffsetDays: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                placeholder="例: 3 (3日後が期限)"
              />
              {errors.dueOffsetDays && (
                <p className="text-sm text-red-600">{errors.dueOffsetDays}</p>
              )}
              <p className="text-sm text-gray-600">
                未設定の場合は期限なしのタスクとなります
              </p>
            </div>
          </div>

          {/* オプション設定 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">オプション設定</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRequired"
                  checked={formData.isRequired}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isRequired: !!checked }))
                  }
                />
                <Label htmlFor="isRequired">必須タスク</Label>
              </div>
              
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
            </div>
            
            <p className="text-sm text-gray-600">
              非アクティブにすると、このタスクは新規作成時に表示されなくなります。
            </p>
          </div>

          {/* メール設定（メールタスクの場合） */}
          {formData.taskType === 'email' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">メール設定</h3>
              
              <div className="space-y-2">
                <Label htmlFor="emailTemplateId">メールテンプレート</Label>
                <Select 
                  value={formData.emailTemplateId || ''} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    emailTemplateId: value || undefined 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="テンプレートを選択（オプション）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">テンプレートなし</SelectItem>
                    {/* 実際の実装では、メールテンプレート一覧を取得して表示 */}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600">
                  メールテンプレートを選択すると、タスク実行時に自動的に適用されます
                </p>
              </div>
            </div>
          )}

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
              {loading ? '保存中...' : (task ? '更新' : '作成')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};