import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Plus,
  Save,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

import { EvaluationTabProps } from '../types/applicantDetail';

export function EvaluationTab({
  evaluationForms,
  formData,
  showEvaluationForm,
  isEditing,
  editingFormId,
  viewingFormId,
  onShowEvaluationForm,
  onFormDataChange,
  onSaveEvaluation,
  onEditForm,
  onViewForm,
  onDeleteForm,
  onSaveEdit,
  onCancelEdit
}: EvaluationTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>評定表</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onShowEvaluationForm(!showEvaluationForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {showEvaluationForm ? 'フォームを閉じる' : '評定表追加'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* 保存された評定表の表示 */}
        {evaluationForms.length > 0 && !showEvaluationForm && !isEditing && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">保存された評定表</h3>
            <div className="space-y-4">
              {evaluationForms.map((form) => (
                <Card key={form.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{form.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {form.stage} - {new Date(form.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewForm(form.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEditForm(form)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDeleteForm(form.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* 評定者の強調表示 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-blue-900">評定者</Label>
                        <p className="text-sm font-medium text-blue-800 mt-1">
                          {form.evaluator}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 閲覧モード */}
        {viewingFormId && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold border-b pb-2">評定表閲覧</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewForm('')}
              >
                閉じる
              </Button>
            </div>
            {(() => {
              const form = evaluationForms.find(f => f.id === viewingFormId);
              if (!form) return null;
              
              return (
                <div className="space-y-6">
                  {/* 評定表ヘッダー情報 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-blue-900">評定者</Label>
                        <p className="text-sm font-medium text-blue-800 mt-1">
                          {form.evaluator}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 業界・職種・イズ志望理由 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">業界・職種・イズ志望理由</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">業界・職種・イズ志望理由</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.motivation.companyMotivation || '未入力'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 企業選びの軸 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">企業選びの軸</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">企業選びの軸</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.motivation.industryMotivation || '未入力'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 学業・バイト・サークル */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">学業・バイト・サークル</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">学業・バイト・サークル</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.experience.pastExperience || '未入力'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 将来像 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">将来像</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">将来像</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.futureVision.careerVision || '未入力'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* その他 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">その他</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">その他</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.selfUnderstanding.strengthsWeaknesses || '未入力'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 所感 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">所感</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">所感</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.problemSolving.failureExperience || '未入力'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 編集・作成モード */}
        {(showEvaluationForm || isEditing) && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold border-b pb-2">
                {isEditing ? '評定表編集' : '新規評定表作成'}
              </h3>
              <div className="flex space-x-2">
                {isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onCancelEdit}
                  >
                    キャンセル
                  </Button>
                )}
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={isEditing ? onSaveEdit : onSaveEvaluation}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? '更新' : '保存'}
                </Button>
              </div>
            </div>

            {/* 評定者 */}
            <div>
              <Label className="text-sm font-medium">評定者</Label>
              <Input 
                placeholder="評定者名を入力" 
                className="mt-1"
                value={formData.evaluator}
                onChange={(e) => onFormDataChange('evaluator', '', e.target.value)}
              />
            </div>

            {/* 業界・職種・イズ志望理由 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">業界・職種・イズ志望理由</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">業界・職種・イズ志望理由</Label>
                  <Textarea 
                    placeholder="業界・職種・イズ志望理由を入力してください" 
                    className="mt-1"
                    rows={4}
                    value={formData.motivation.companyMotivation}
                    onChange={(e) => onFormDataChange('motivation', 'companyMotivation', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 企業選びの軸 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">企業選びの軸</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">企業選びの軸</Label>
                  <Textarea 
                    placeholder="企業選びの軸を入力してください" 
                    className="mt-1"
                    rows={4}
                    value={formData.motivation.industryMotivation}
                    onChange={(e) => onFormDataChange('motivation', 'industryMotivation', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 学業・バイト・サークル */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">学業・バイト・サークル</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">学業・バイト・サークル</Label>
                  <Textarea 
                    placeholder="学業・バイト・サークルについて入力してください" 
                    className="mt-1"
                    rows={4}
                    value={formData.experience.pastExperience}
                    onChange={(e) => onFormDataChange('experience', 'pastExperience', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 将来像 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">将来像</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">将来像</Label>
                  <Textarea 
                    placeholder="将来像を入力してください" 
                    className="mt-1"
                    rows={4}
                    value={formData.futureVision.careerVision}
                    onChange={(e) => onFormDataChange('futureVision', 'careerVision', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* その他 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">その他</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">その他</Label>
                  <Textarea 
                    placeholder="その他の情報を入力してください" 
                    className="mt-1"
                    rows={4}
                    value={formData.selfUnderstanding.strengthsWeaknesses}
                    onChange={(e) => onFormDataChange('selfUnderstanding', 'strengthsWeaknesses', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 所感 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">所感</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">所感</Label>
                  <Textarea 
                    placeholder="所感を入力してください" 
                    className="mt-1"
                    rows={4}
                    value={formData.problemSolving.failureExperience}
                    onChange={(e) => onFormDataChange('problemSolving', 'failureExperience', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
