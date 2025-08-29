// ステータス編集ダイアログ

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type {
  CreateStatusDefinitionInput,
  StatusCategory,
  ColorScheme
} from '@/lib/dataAccess/integratedStatusDataAccess';
import { STATUS_CATEGORIES } from '@/lib/dataAccess/integratedStatusDataAccess';
import { COLOR_SCHEME_DISPLAY } from '@/features/system-config/types';

interface StatusEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status?: CreateStatusDefinitionInput;
  stageId: string;
  stageName: string;
  onSave: (data: CreateStatusDefinitionInput) => void;
  maxSortOrder: number;
}

export const StatusEditDialog = ({ 
  open, 
  onOpenChange, 
  status, 
  stageId,
  stageName,
  onSave, 
  maxSortOrder 
}: StatusEditDialogProps) => {
  const [formData, setFormData] = useState<CreateStatusDefinitionInput>({
    stageId: '',
    statusValue: '',
    displayName: '',
    statusCategory: 'pending',
    colorScheme: 'blue',
    sortOrder: maxSortOrder + 1,
    isActive: true,
    isFinal: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ダイアログが開かれた時にフォームデータを初期化
  useEffect(() => {
    if (open) {
      if (status) {
        // 編集モード
        setFormData({
          ...status
        });
      } else {
        // 新規作成モード
        setFormData({
          stageId,
          statusValue: '',
          displayName: '',
          statusCategory: 'pending',
          colorScheme: 'blue',
          sortOrder: maxSortOrder + 1,
          isActive: true,
          isFinal: false
        });
      }
      setErrors({});
    }
  }, [open, status, stageId, maxSortOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    const newErrors: Record<string, string> = {};
    if (!formData.statusValue.trim()) newErrors.statusValue = 'ステータス値は必須です';
    if (!formData.displayName.trim()) newErrors.displayName = '表示名は必須です';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Save failed:', error);
      setErrors({ general: error instanceof Error ? error.message : '保存に失敗しました' });
    }
  };

  const handleCategoryChange = (category: StatusCategory) => {
    const categoryInfo = STATUS_CATEGORIES.find(cat => cat.value === category);
    setFormData(prev => ({
      ...prev,
      statusCategory: category,
      colorScheme: categoryInfo?.defaultColor || 'blue'
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {status ? 'ステータス編集' : 'ステータス作成'}
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
                <Label htmlFor="statusValue">ステータス値 *</Label>
                <Input
                  id="statusValue"
                  value={formData.statusValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, statusValue: e.target.value }))}
                  placeholder="例: 合格"
                />
                {errors.statusValue && <p className="text-sm text-red-600">{errors.statusValue}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">表示名 *</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="例: 合格"
                />
                {errors.displayName && <p className="text-sm text-red-600">{errors.displayName}</p>}
              </div>
            </div>
          </div>

          {/* カテゴリ設定 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">カテゴリ設定</h3>
            
            <div className="space-y-2">
              <Label>ステータスカテゴリ</Label>
              <Select 
                value={formData.statusCategory} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <div>
                          <div className="font-medium">{category.label}</div>
                          <div className="text-xs text-gray-500">{category.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>色スキーム</Label>
              <Select 
                value={formData.colorScheme} 
                onValueChange={(value: ColorScheme) => setFormData(prev => ({ ...prev, colorScheme: value }))}
              >
                <SelectTrigger>
                  <SelectValue>
                    {formData.colorScheme && (
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${COLOR_SCHEME_DISPLAY[formData.colorScheme].preview}`} />
                        <span>{COLOR_SCHEME_DISPLAY[formData.colorScheme].name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COLOR_SCHEME_DISPLAY).map(([colorKey, colorInfo]) => (
                    <SelectItem key={colorKey} value={colorKey}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${colorInfo.preview}`} />
                        <span>{colorInfo.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 詳細設定 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">詳細設定</h3>
            
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

            <div className="space-y-3">
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
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFinal"
                  checked={formData.isFinal}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isFinal: !!checked }))
                  }
                />
                <Label htmlFor="isFinal">最終ステータス</Label>
              </div>
              
              <p className="text-sm text-gray-600">
                最終ステータスに設定すると、このステータス後は次の段階に進めません。
              </p>
            </div>
          </div>

          {/* プレビュー */}
          <div className="space-y-2">
            <Label>プレビュー</Label>
            <div className="flex items-center gap-2">
              <Badge 
                className={COLOR_SCHEME_DISPLAY[formData.colorScheme || 'blue'].class}
              >
                {formData.displayName || 'プレビュー'}
              </Badge>
              {formData.isFinal && (
                <Badge variant="outline" className="text-xs">
                  最終
                </Badge>
              )}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              キャンセル
            </Button>
            <Button type="submit">
              {status ? '更新' : '作成'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};