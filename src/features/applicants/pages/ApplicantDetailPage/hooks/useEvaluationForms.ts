import { useState } from 'react';
import { EvaluationForm } from '@/features/applicants/types/applicant';
import { EvaluationFormData } from '../types/applicantDetail';

export function useEvaluationForms(applicantId: string) {
  const [evaluationForms, setEvaluationForms] = useState<EvaluationForm[]>([]);
  
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [viewingFormId, setViewingFormId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<EvaluationFormData>({
    evaluator: '',
    overallRating: 'C',
    motivation: {
      companyMotivation: '',
      industryMotivation: '',
      jobMotivation: ''
    },
    experience: {
      pastExperience: '',
      focusedActivity: '',
      learnedFromActivities: ''
    },
    selfUnderstanding: {
      strengthsWeaknesses: '',
      othersOpinion: ''
    },
    problemSolving: {
      failureExperience: '',
      difficultSituation: ''
    },
    futureVision: {
      careerVision: '',
      futurePosition: ''
    },
    reverseQuestion: {
      questions: ''
    }
  });

  // フォームデータの更新
  const handleFormDataChange = (section: string, field: string, value: string) => {
    setFormData(prev => {
      if (section === 'evaluator' || section === 'overallRating') {
        return {
          ...prev,
          [section]: value
        };
      }
      
      const sectionData = prev[section as keyof typeof prev];
      if (typeof sectionData === 'object' && sectionData !== null) {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: value
          }
        };
      }
      
      return prev;
    });
  };

  // 評定表の保存機能
  const handleSaveEvaluation = () => {
    const newForm: EvaluationForm = {
      id: `eval-${Date.now()}`,
      applicantId: applicantId,
      title: '新規評定表',
      stage: '人事面接',
      evaluator: formData.evaluator || '評価者名',
      overallRating: formData.overallRating,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: {
        motivation: {
          ...formData.motivation,
          criteria: ['動機が具体的で一貫しているか', '会社や業界の理解度', '他社ではなく自社を選ぶ理由の説得力']
        },
        experience: {
          ...formData.experience,
          criteria: ['成果や役割の具体性', '困難に対する行動プロセス', '自社の業務に活かせるスキルや姿勢']
        },
        selfUnderstanding: {
          ...formData.selfUnderstanding,
          criteria: ['自分の特徴を客観的に把握しているか', '弱みを改善する姿勢があるか', '強みが仕事で活かせるか']
        },
        problemSolving: {
          ...formData.problemSolving,
          criteria: ['課題を分析する力', '解決への主体性', '再発防止や改善への意識']
        },
        futureVision: {
          ...formData.futureVision,
          criteria: ['目標の明確さと現実性', '自社でのキャリアパスとの一致度']
        },
        reverseQuestion: {
          ...formData.reverseQuestion,
          criteria: ['準備度（事前に調べているか）', '会社や職務への興味の深さ', '自分の意思で判断する姿勢']
        }
      }
    };
    
    setEvaluationForms([...evaluationForms, newForm]);
    resetFormData();
    setShowEvaluationForm(false);
  };

  // 編集機能
  const handleEditForm = (form: EvaluationForm) => {
    setEditingFormId(form.id);
    setViewingFormId(null);
    setShowEvaluationForm(false);
    setIsEditing(true);
    
    setFormData({
      evaluator: form.evaluator,
      overallRating: form.overallRating,
      motivation: {
        companyMotivation: form.sections.motivation.companyMotivation,
        industryMotivation: form.sections.motivation.industryMotivation,
        jobMotivation: form.sections.motivation.jobMotivation
      },
      experience: {
        pastExperience: form.sections.experience.pastExperience,
        focusedActivity: form.sections.experience.focusedActivity,
        learnedFromActivities: form.sections.experience.learnedFromActivities
      },
      selfUnderstanding: {
        strengthsWeaknesses: form.sections.selfUnderstanding.strengthsWeaknesses,
        othersOpinion: form.sections.selfUnderstanding.othersOpinion
      },
      problemSolving: {
        failureExperience: form.sections.problemSolving.failureExperience,
        difficultSituation: form.sections.problemSolving.difficultSituation
      },
      futureVision: {
        careerVision: form.sections.futureVision.careerVision,
        futurePosition: form.sections.futureVision.futurePosition
      },
      reverseQuestion: {
        questions: form.sections.reverseQuestion.questions
      }
    });
  };

  // 閲覧機能
  const handleViewForm = (formId: string) => {
    setViewingFormId(formId);
    setEditingFormId(null);
    setShowEvaluationForm(false);
    setIsEditing(false);
  };

  // 削除機能
  const handleDeleteForm = (formId: string) => {
    if (confirm('この評定表を削除しますか？')) {
      setEvaluationForms(prev => prev.filter(form => form.id !== formId));
    }
  };

  // 編集保存機能
  const handleSaveEdit = () => {
    if (!editingFormId) return;
    
    const updatedForms = evaluationForms.map(form => {
      if (form.id === editingFormId) {
        return {
          ...form,
          evaluator: formData.evaluator || form.evaluator,
          overallRating: formData.overallRating,
          updatedAt: new Date().toISOString(),
          sections: {
            motivation: {
              ...formData.motivation,
              criteria: ['動機が具体的で一貫しているか', '会社や業界の理解度', '他社ではなく自社を選ぶ理由の説得力']
            },
            experience: {
              ...formData.experience,
              criteria: ['成果や役割の具体性', '困難に対する行動プロセス', '自社の業務に活かせるスキルや姿勢']
            },
            selfUnderstanding: {
              ...formData.selfUnderstanding,
              criteria: ['自分の特徴を客観的に把握しているか', '弱みを改善する姿勢があるか', '強みが仕事で活かせるか']
            },
            problemSolving: {
              ...formData.problemSolving,
              criteria: ['課題を分析する力', '解決への主体性', '再発防止や改善への意識']
            },
            futureVision: {
              ...formData.futureVision,
              criteria: ['目標の明確さと現実性', '自社でのキャリアパスとの一致度']
            },
            reverseQuestion: {
              ...formData.reverseQuestion,
              criteria: ['準備度（事前に調べているか）', '会社や職務への興味の深さ', '自分の意思で判断する姿勢']
            }
          }
        };
      }
      return form;
    });
    
    setEvaluationForms(updatedForms);
    setEditingFormId(null);
    setIsEditing(false);
    resetFormData();
  };

  // キャンセル機能
  const handleCancelEdit = () => {
    setEditingFormId(null);
    setViewingFormId(null);
    setIsEditing(false);
    resetFormData();
  };

  // フォームデータのリセット
  const resetFormData = () => {
    setFormData({
      evaluator: '',
      overallRating: 'C',
      motivation: { companyMotivation: '', industryMotivation: '', jobMotivation: '' },
      experience: { pastExperience: '', focusedActivity: '', learnedFromActivities: '' },
      selfUnderstanding: { strengthsWeaknesses: '', othersOpinion: '' },
      problemSolving: { failureExperience: '', difficultSituation: '' },
      futureVision: { careerVision: '', futurePosition: '' },
      reverseQuestion: { questions: '' }
    });
  };

  return {
    evaluationForms,
    showEvaluationForm,
    isEditing,
    editingFormId,
    viewingFormId,
    formData,
    setShowEvaluationForm,
    handleFormDataChange,
    handleSaveEvaluation,
    handleEditForm,
    handleViewForm,
    handleDeleteForm,
    handleSaveEdit,
    handleCancelEdit
  };
}
