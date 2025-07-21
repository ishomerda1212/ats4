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
  firstImpression: z.string().min(1, '第一印象を入力してください'),
  communicationSkills: z.string().min(1, 'コミュニケーション能力を入力してください'),
  logicalThinking: z.string().min(1, '論理的思考力を入力してください'),
  initiative: z.string().min(1, '積極性・主体性を入力してください'),
  teamwork: z.string().min(1, '協調性を入力してください'),
  motivation: z.string().min(1, '志望動機・熱意を入力してください'),
  technicalSkills: z.string().min(1, '技術的スキルを入力してください'),
  overallEvaluation: z.string().min(1, '総合評価を入力してください'),
});

export function useEvaluationForm(applicantId: string, selectionHistoryId: string) {
  const [, setEvaluations] = useLocalStorage<Evaluation[]>('evaluations', mockEvaluations);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      evaluatorName: '',
      firstImpression: '',
      communicationSkills: '',
      logicalThinking: '',
      initiative: '',
      teamwork: '',
      motivation: '',
      technicalSkills: '',
      overallEvaluation: '',
    },
  });

  const onSubmit = async (data: EvaluationFormData) => {
    setLoading(true);
    try {
      const newEvaluation: Evaluation = {
        id: generateId(),
        applicantId,
        selectionHistoryId,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setEvaluations(current => [...current, newEvaluation]);
      
      toast({
        title: "評定表を保存しました",
        description: "評定表が正常に保存されました。",
      });

      navigate(`/applicants/${applicantId}`);
    } catch {
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