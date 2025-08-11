import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useForm, Controller, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Applicant } from '@/features/applicants/types/applicant';
import { EvaluationFormData, EVALUATION_FIELDS } from '@/features/evaluations/types/evaluation';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { mockEvaluations } from '@/shared/data/mockData';
import { generateId } from '@/shared/utils/date';
import { toast } from '@/hooks/use-toast';

const evaluationSchema = z.object({
  evaluatorName: z.string().min(1, '評価者名を入力してください'),
  motivationReason: z.string().optional(),
  experienceBackground: z.string().optional(),
  selfUnderstanding: z.string().optional(),
  problemSolving: z.string().optional(),
  futureVision: z.string().optional(),
  reverseQuestion: z.string().optional(),
});

interface GroupEvaluationFormProps {
  applicant: Applicant;
  sessionId: string;
  autoSave?: boolean;
  onSaveSuccess?: () => void;
}

export function GroupEvaluationForm({ 
  applicant, 
  sessionId, 
  autoSave = true, 
  onSaveSuccess 
}: GroupEvaluationFormProps) {
  const [evaluations, setEvaluations] = useLocalStorage('evaluations', mockEvaluations);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDraft, setIsDraft] = useState(true);

  // 下書きデータのキー
  const draftKey = `draft-evaluation-${applicant.id}-${sessionId}`;
  const emptyEvaluation: EvaluationFormData = {
    evaluatorName: '',
    motivationReason: '',
    experienceBackground: '',
    selfUnderstanding: '',
    problemSolving: '',
    futureVision: '',
    reverseQuestion: '',
  };
  const [draftData, setDraftData] = useLocalStorage<EvaluationFormData>(draftKey, emptyEvaluation);

  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      evaluatorName: draftData.evaluatorName || '',
      motivationReason: draftData.motivationReason || '',
      experienceBackground: draftData.experienceBackground || '',
      selfUnderstanding: draftData.selfUnderstanding || '',
      problemSolving: draftData.problemSolving || '',
      futureVision: draftData.futureVision || '',
      reverseQuestion: draftData.reverseQuestion || '',
    },
  });

  // 自動保存機能
  useEffect(() => {
    if (!autoSave) return;

    const subscription = form.watch((data) => {
      setDraftData(data as EvaluationFormData);
      setLastSaved(new Date());
    });

    return () => subscription.unsubscribe();
  }, [form, autoSave, setDraftData]);

  // 既存の評価があるかチェック
  const existingEvaluation = evaluations.find(e => 
    e.applicantId === applicant.id && 
    e.selectionHistoryId === sessionId
  );

  useEffect(() => {
    if (existingEvaluation) {
      form.reset({
        evaluatorName: existingEvaluation.evaluatorName,
        motivationReason: existingEvaluation.motivationReason || '',
        experienceBackground: existingEvaluation.experienceBackground || '',
        selfUnderstanding: existingEvaluation.selfUnderstanding || '',
        problemSolving: existingEvaluation.problemSolving || '',
        futureVision: existingEvaluation.futureVision || '',
        reverseQuestion: existingEvaluation.reverseQuestion || '',
      });
      setIsDraft(false);
    }
  }, [existingEvaluation, form]);

  const onSubmit = async (data: EvaluationFormData) => {
    setLoading(true);
    try {
      if (existingEvaluation) {
        // 更新
        const updatedEvaluation = {
          ...existingEvaluation,
          ...data,
          updatedAt: new Date(),
        };
        setEvaluations(current => 
          current.map(e => e.id === existingEvaluation.id ? updatedEvaluation : e)
        );
      } else {
        // 新規作成
        const newEvaluation = {
          id: generateId(),
          applicantId: applicant.id,
          selectionHistoryId: sessionId,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setEvaluations(current => [...current, newEvaluation]);
      }

      // 下書きデータを削除
      setDraftData(emptyEvaluation);
      setIsDraft(false);
      
      toast({
        title: "評定表を保存しました",
        description: `${applicant.name}さんの評定表が正常に保存されました。`,
      });

      onSaveSuccess?.();
    } catch {
      toast({
        title: "エラー",
        description: "評定表の保存に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = () => {
    const currentData = form.getValues();
    setDraftData(currentData as EvaluationFormData);
    setLastSaved(new Date());
    toast({
      title: "下書きを保存しました",
      description: "入力内容が下書きとして保存されました。",
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>評定表入力</span>
            {existingEvaluation ? (
              <Badge className="bg-blue-100 text-blue-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                完了
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-800">
                <Clock className="h-3 w-3 mr-1" />
                {isDraft ? '下書き' : '未入力'}
              </Badge>
            )}
          </CardTitle>
          {lastSaved && autoSave && (
            <div className="text-xs text-muted-foreground">
              最終保存: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {applicant.name}さんの評定表
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 overflow-y-auto max-h-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="evaluatorName"
              control={form.control as Control<EvaluationFormData>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>評価者名 *</FormLabel>
                  <FormControl>
                    <Input placeholder="評価者の氏名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {EVALUATION_FIELDS.map((fieldConfig) => (
              <FormField
                key={fieldConfig.key}
                control={form.control as Control<EvaluationFormData>}
                name={fieldConfig.key as keyof EvaluationFormData}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldConfig.label} *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={fieldConfig.placeholder}
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex justify-between space-x-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={saveDraft}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                下書き保存
              </Button>
              
              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {loading ? '保存中...' : '完了して保存'}
                </Button>
                
                <Button 
                  type="submit" 
                  variant="outline"
                  disabled={loading}
                  onClick={() => {
                    // 次の応募者に移動する処理をここに追加
                  }}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  保存して次へ
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}