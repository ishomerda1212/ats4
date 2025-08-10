import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EvaluationFormData, Evaluation } from '../types/evaluation';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { mockEvaluations } from '@/shared/data/mockData';
import { generateId } from '@/shared/utils/date';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const evaluationSchema = z.object({
  evaluatorName: z.string().min(1, '評価者名を入力してください'),
  motivationReason: z.string().min(1, '志望理由系の評価を入力してください'),
  experienceBackground: z.string().min(1, '経歴・経験系の評価を入力してください'),
  selfUnderstanding: z.string().min(1, '自己理解系の評価を入力してください'),
  problemSolving: z.string().min(1, '課題対応・行動特性系の評価を入力してください'),
  futureVision: z.string().min(1, '将来像系の評価を入力してください'),
  reverseQuestion: z.string().min(1, '逆質問の評価を入力してください'),
});

export function useEvaluationForm(applicantId: string) {
  const [, setEvaluations] = useLocalStorage<Evaluation[]>('evaluations', mockEvaluations);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log('useEvaluationForm called with:', { applicantId });

  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      evaluatorName: '',
      motivationReason: '',
      experienceBackground: '',
      selfUnderstanding: '',
      problemSolving: '',
      futureVision: '',
      reverseQuestion: '',
    },
  });

  const onSubmit = async (data: EvaluationFormData) => {
    console.log('評定表フォームが送信されました:', data);
    setLoading(true);
    try {
      const newEvaluation: Evaluation = {
        id: generateId(),
        applicantId,
        selectionHistoryId: '', // 空文字列または削除
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('新しい評価を作成:', newEvaluation);
      setEvaluations(current => [...current, newEvaluation]);
      
      toast({
        title: "評定表を保存しました",
        description: "評定表が正常に保存されました。",
      });

      navigate(`/applicants/${applicantId}`);
    } catch (error) {
      console.error('評定表保存エラー:', error);
      toast({
        title: "エラーが発生しました",
        description: "評定表の保存に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    loading,
  };
}