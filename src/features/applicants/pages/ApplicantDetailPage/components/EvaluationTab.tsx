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
            {showEvaluationForm && (
              <Button 
                variant="default" 
                size="sm"
                onClick={onSaveEvaluation}
              >
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            )}
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
                  
                  {/* 評定者と総合評価の強調表示 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-green-900">総合評価</Label>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                              form.overallRating === 'A' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
                              form.overallRating === 'B' ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' :
                              form.overallRating === 'C' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
                              form.overallRating === 'D' ? 'bg-red-100 text-red-800 border-2 border-red-300' :
                              'bg-gray-100 text-gray-800 border-2 border-gray-300'
                            }`}>
                              {form.overallRating}
                              <span className="ml-1 text-xs">
                                {form.overallRating === 'A' ? '（優秀）' :
                                 form.overallRating === 'B' ? '（良好）' :
                                 form.overallRating === 'C' ? '（普通）' :
                                 form.overallRating === 'D' ? '（不適格）' : ''}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">総合評価コメント</Label>
                      <div className="mt-2 p-3 bg-muted rounded-md border-l-4 border-blue-500">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {form.overallRating === 'A' ? '非常に優秀な人材です。志望動機が明確で一貫性があり、会社や業界への理解も深い。過去の経験や活動から得た学びを具体的に語り、自己分析も的確。課題解決能力やリーダーシップも備えており、即戦力として期待できる。コミュニケーション能力も高く、チームワークも良好。採用を強く推奨します。' :
                           form.overallRating === 'B' ? '良好な人材です。志望動機は明確で、基本的な能力も備わっている。経験や活動についても具体的に説明でき、意欲も高い。一部改善点はあるが、育成次第で十分に活躍できると期待できる。採用を推奨します。' :
                           form.overallRating === 'C' ? '平均的な人材です。基本的な能力はあるが、志望動機や経験の説明がやや抽象的。意欲は感じられるが、具体的な成果や学びの説明が不足している。さらなる成長が必要で、要検討です。' :
                           form.overallRating === 'D' ? '不適格な人材です。志望動機が不明確で、経験や活動の説明も具体性に欠ける。基本的な能力や意欲に疑問があり、自己分析も不十分。採用は推奨しません。' :
                           '評価コメントが設定されていません。'}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-green-900">総合評価</Label>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                              form.overallRating === 'A' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
                              form.overallRating === 'B' ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' :
                              form.overallRating === 'C' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
                              form.overallRating === 'D' ? 'bg-red-100 text-red-800 border-2 border-red-300' :
                              'bg-gray-100 text-gray-800 border-2 border-gray-300'
                            }`}>
                              {form.overallRating}
                              <span className="ml-1 text-xs">
                                {form.overallRating === 'A' ? '（優秀）' :
                                 form.overallRating === 'B' ? '（良好）' :
                                 form.overallRating === 'C' ? '（普通）' :
                                 form.overallRating === 'D' ? '（不適格）' : ''}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-900">作成日</Label>
                          <p className="text-sm font-medium text-gray-800 mt-1">
                            {new Date(form.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 総合評価コメント */}
                    <div className="mt-4 p-4 bg-white rounded-md border-l-4 border-blue-500">
                      <Label className="text-sm font-semibold text-gray-900">総合評価コメント</Label>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                        {form.overallRating === 'A' ? '非常に優秀な人材です。志望動機が明確で一貫性があり、会社や業界への理解も深い。過去の経験や活動から得た学びを具体的に語り、自己分析も的確。課題解決能力やリーダーシップも備えており、即戦力として期待できる。コミュニケーション能力も高く、チームワークも良好。採用を強く推奨します。' :
                         form.overallRating === 'B' ? '良好な人材です。志望動機は明確で、基本的な能力も備わっている。経験や活動についても具体的に説明でき、意欲も高い。一部改善点はあるが、育成次第で十分に活躍できると期待できる。採用を推奨します。' :
                         form.overallRating === 'C' ? '平均的な人材です。基本的な能力はあるが、志望動機や経験の説明がやや抽象的。意欲は感じられるが、具体的な成果や学びの説明が不足している。さらなる成長が必要で、要検討です。' :
                         form.overallRating === 'D' ? '不適格な人材です。志望動機が不明確で、経験や活動の説明も具体性に欠ける。基本的な能力や意欲に疑問があり、自己分析も不十分。採用は推奨しません。' :
                         '評価コメントが設定されていません。'}
                      </p>
                    </div>
                  </div>

                  {/* 志望理由系 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">志望理由系</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">当社を志望する理由</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.motivation.companyMotivation || '未入力'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">業界を志望する理由</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.motivation.industryMotivation || '未入力'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">職務を志望する理由</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.motivation.jobMotivation || '未入力'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 経験・活動系 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">経験・活動系</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">過去の経験で最も印象に残っていること</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.experience.pastExperience || '未入力'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">最も力を入れて取り組んだ活動</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.experience.focusedActivity || '未入力'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">活動から学んだこと</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.experience.learnedFromActivities || '未入力'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 自己理解系 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">自己理解系</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">自分の強みと弱み</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.selfUnderstanding.strengthsWeaknesses || '未入力'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">他者からの評価</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.selfUnderstanding.othersOpinion || '未入力'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 課題解決系 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">課題解決系</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">失敗した経験とその学び</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.problemSolving.failureExperience || '未入力'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">困難な状況での対応</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.problemSolving.difficultSituation || '未入力'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 将来ビジョン系 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">将来ビジョン系</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">キャリアビジョン</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.futureVision.careerVision || '未入力'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">将来のポジション</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.futureVision.futurePosition || '未入力'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 逆質問 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">逆質問</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">何か質問はありますか？</Label>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {form.sections.reverseQuestion.questions || '未入力'}
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

            {/* 評定者と総合評価 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">評定者</Label>
                <Input 
                  placeholder="評定者名を入力" 
                  className="mt-1"
                  value={formData.evaluator}
                  onChange={(e) => onFormDataChange('evaluator', '', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">総合評価</Label>
                <Select 
                  value={formData.overallRating} 
                  onValueChange={(value) => onFormDataChange('overallRating', '', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="評価を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A（優秀）</SelectItem>
                    <SelectItem value="B">B（良好）</SelectItem>
                    <SelectItem value="C">C（普通）</SelectItem>
                    <SelectItem value="D">D（不適格）</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 志望理由系 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">志望理由系</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">当社を志望する理由</Label>
                  <Textarea 
                    placeholder="当社を志望する理由を入力してください" 
                    className="mt-1"
                    rows={3}
                    value={formData.motivation.companyMotivation}
                    onChange={(e) => onFormDataChange('motivation', 'companyMotivation', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">業界を志望する理由</Label>
                  <Textarea 
                    placeholder="業界を志望する理由を入力してください" 
                    className="mt-1"
                    rows={3}
                    value={formData.motivation.industryMotivation}
                    onChange={(e) => onFormDataChange('motivation', 'industryMotivation', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">職務を志望する理由</Label>
                  <Textarea 
                    placeholder="職務を志望する理由を入力してください" 
                    className="mt-1"
                    rows={3}
                    value={formData.motivation.jobMotivation}
                    onChange={(e) => onFormDataChange('motivation', 'jobMotivation', e.target.value)}
                  />
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <Label className="text-sm font-medium flex items-center">
                    📌 判断基準
                  </Label>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• 動機が具体的で一貫しているか</li>
                    <li>• 会社や業界の理解度</li>
                    <li>• 他社ではなく自社を選ぶ理由の説得力</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 経験・活動系 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">経験・活動系</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">過去の経験で最も印象に残っていること</Label>
                  <Textarea 
                    placeholder="過去の経験で最も印象に残っていることを入力してください" 
                    className="mt-1"
                    rows={3}
                    value={formData.experience.pastExperience}
                    onChange={(e) => onFormDataChange('experience', 'pastExperience', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">最も力を入れて取り組んだ活動</Label>
                  <Textarea 
                    placeholder="最も力を入れて取り組んだ活動を入力してください" 
                    className="mt-1"
                    rows={3}
                    value={formData.experience.focusedActivity}
                    onChange={(e) => onFormDataChange('experience', 'focusedActivity', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">活動から学んだこと</Label>
                  <Textarea 
                    placeholder="活動から学んだことを入力してください" 
                    className="mt-1"
                    rows={3}
                    value={formData.experience.learnedFromActivities}
                    onChange={(e) => onFormDataChange('experience', 'learnedFromActivities', e.target.value)}
                  />
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <Label className="text-sm font-medium flex items-center">
                    📌 判断基準
                  </Label>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• 成果や役割の具体性</li>
                    <li>• 困難に対する行動プロセス</li>
                    <li>• 自社の業務に活かせるスキルや姿勢</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 自己理解系 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">自己理解系</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">自分の強みと弱み</Label>
                  <Textarea 
                    placeholder="自分の強みと弱みを入力してください" 
                    className="mt-1"
                    rows={3}
                    value={formData.selfUnderstanding.strengthsWeaknesses}
                    onChange={(e) => onFormDataChange('selfUnderstanding', 'strengthsWeaknesses', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">他者からの評価</Label>
                  <Textarea 
                    placeholder="他者からの評価を入力してください" 
                    className="mt-1"
                    rows={3}
                    value={formData.selfUnderstanding.othersOpinion}
                    onChange={(e) => onFormDataChange('selfUnderstanding', 'othersOpinion', e.target.value)}
                  />
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <Label className="text-sm font-medium flex items-center">
                    📌 判断基準
                  </Label>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• 自分の特徴を客観的に把握しているか</li>
                    <li>• 弱みを改善する姿勢があるか</li>
                    <li>• 強みが仕事で活かせるか</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 課題解決系 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">課題解決系</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">失敗した経験とその学び</Label>
                  <Textarea 
                    placeholder="失敗した経験とその学びを入力してください" 
                    className="mt-1"
                    rows={3}
                    value={formData.problemSolving.failureExperience}
                    onChange={(e) => onFormDataChange('problemSolving', 'failureExperience', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">困難な状況での対応</Label>
                  <Textarea 
                    placeholder="困難な状況での対応を入力してください" 
                    className="mt-1"
                    rows={3}
                    value={formData.problemSolving.difficultSituation}
                    onChange={(e) => onFormDataChange('problemSolving', 'difficultSituation', e.target.value)}
                  />
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <Label className="text-sm font-medium flex items-center">
                    📌 判断基準
                  </Label>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• 課題を分析する力</li>
                    <li>• 解決への主体性</li>
                    <li>• 再発防止や改善への意識</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 将来ビジョン系 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">将来ビジョン系</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">キャリアビジョン</Label>
                  <Textarea 
                    placeholder="キャリアビジョンを入力してください" 
                    className="mt-1"
                    rows={3}
                    value={formData.futureVision.careerVision}
                    onChange={(e) => onFormDataChange('futureVision', 'careerVision', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">将来のポジション</Label>
                  <Textarea 
                    placeholder="将来のポジションを入力してください" 
                    className="mt-1"
                    rows={3}
                    value={formData.futureVision.futurePosition}
                    onChange={(e) => onFormDataChange('futureVision', 'futurePosition', e.target.value)}
                  />
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <Label className="text-sm font-medium flex items-center">
                    📌 判断基準
                  </Label>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• 目標の明確さと現実性</li>
                    <li>• 自社でのキャリアパスとの一致度</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 逆質問 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">逆質問</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">何か質問はありますか？</Label>
                  <Textarea 
                    placeholder="質問内容を入力してください" 
                    className="mt-1"
                    rows={3}
                    value={formData.reverseQuestion.questions}
                    onChange={(e) => onFormDataChange('reverseQuestion', 'questions', e.target.value)}
                  />
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <Label className="text-sm font-medium flex items-center">
                    📌 判断基準
                  </Label>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• 準備度（事前に調べているか）</li>
                    <li>• 会社や職務への興味の深さ</li>
                    <li>• 自分の意思で判断する姿勢</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
