import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApplicantDetail } from '@/features/applicants/hooks/useApplicantDetail';
import { ApplicantBasicInfo } from '@/features/applicants/components/ApplicantBasicInfo';
import { SelectionStageAccordion } from '@/features/selection-stages/components/SelectionStageAccordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  FileText, 
  Mail, 
  FileArchive,
  CheckCircle,
  Plus,
  Save,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { mockEvaluationForms } from '@/shared/data/mockData';
import { EvaluationForm } from '@/features/applicants/types/applicant';

export function ApplicantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { applicant, history, stageDetails, loading } = useApplicantDetail(id!);
  const [activeTab, setActiveTab] = useState('selection-history');
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 編集モードかどうか
  const [editingFormId, setEditingFormId] = useState<string | null>(null); // 編集中のフォームID
  const [viewingFormId, setViewingFormId] = useState<string | null>(null); // 閲覧中のフォームID
  const [showPdfForm, setShowPdfForm] = useState(false); // PDFフォームの表示/非表示
  
  // 評定表の状態管理
  const [evaluationForms, setEvaluationForms] = useState<EvaluationForm[]>(
    mockEvaluationForms.filter(form => form.applicantId === id)
  );
  
  // フォームデータの状態
  const [formData, setFormData] = useState({
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

  // PDFフォームデータの状態
  const [pdfFormData, setPdfFormData] = useState({
    category: '',
    file: null as File | null
  });

  // 評定表の保存機能
  const handleSaveEvaluation = () => {
    const newForm: EvaluationForm = {
      id: `eval-${Date.now()}`,
      applicantId: id!,
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
    setShowEvaluationForm(false); // 保存後にフォームを非表示
  };

  // フォームデータの更新
  const handleFormDataChange = (section: string, field: string, value: string) => {
    setFormData(prev => {
      if (section === 'evaluator' || section === 'overallRating') {
        return {
          ...prev,
          [section]: value
        };
      }
      
      // 型安全な方法でセクションを更新
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

  // PDFフォームデータの更新
  const handlePdfFormDataChange = (field: string, value: string | File | null) => {
    setPdfFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 編集機能
  const handleEditForm = (form: EvaluationForm) => {
    setEditingFormId(form.id);
    setViewingFormId(null);
    setShowEvaluationForm(false);
    setIsEditing(true);
    
    // フォームデータを編集中のフォームで初期化
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

  // キャンセル機能
  const handleCancelEdit = () => {
    setEditingFormId(null);
    setViewingFormId(null);
    setIsEditing(false);
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

  // PDF保存機能
  const handleSavePdf = () => {
    // ここでPDFデータを保存する処理を実装
    console.log('PDF保存:', pdfFormData);
    
    // フォームをリセット
    setPdfFormData({
      category: '',
      file: null
    });
    setShowPdfForm(false);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">応募者が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{applicant.name}</h1>
          <p className="text-muted-foreground mt-1">
            {applicant.nameKana} - {applicant.currentStage}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：応募者基本情報（3分の1） */}
        <div className="lg:col-span-1">
          <ApplicantBasicInfo applicant={applicant} />
        </div>
        
        {/* 右側：タブコンテンツ（3分の2） */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="selection-history" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">選考履歴</span>
              </TabsTrigger>
              <TabsTrigger value="evaluations" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">評定表</span>
              </TabsTrigger>
              <TabsTrigger value="pdf-management" className="flex items-center space-x-2">
                <FileArchive className="h-4 w-4" />
                <span className="hidden sm:inline">PDF管理</span>
              </TabsTrigger>
              <TabsTrigger value="email-history" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">メール履歴</span>
              </TabsTrigger>
            </TabsList>

            {/* 選考履歴タブ */}
            <TabsContent value="selection-history" className="mt-6">
              <SelectionStageAccordion 
                applicant={applicant} 
                history={history}
                stageDetails={stageDetails}
              />
            </TabsContent>

            {/* 評定表タブ */}
            <TabsContent value="evaluations" className="mt-6">
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
                        onClick={() => setShowEvaluationForm(!showEvaluationForm)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {showEvaluationForm ? 'フォームを閉じる' : '評定表追加'}
                      </Button>
                      {showEvaluationForm && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={handleSaveEvaluation}
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
                                  onClick={() => handleViewForm(form.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditForm(form)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteForm(form.id)}
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
                          onClick={() => setViewingFormId(null)}
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
                                  <Label className="text-sm font-medium">なぜ当社を志望しましたか？</Label>
                                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                    {form.sections.motivation.companyMotivation || '未入力'}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">この業界を選んだ理由は？</Label>
                                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                    {form.sections.motivation.industryMotivation || '未入力'}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">この職種を選んだ理由は？</Label>
                                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                    {form.sections.motivation.jobMotivation || '未入力'}
                                  </p>
                                </div>
                                <div className="bg-muted p-3 rounded-md">
                                  <Label className="text-sm font-medium flex items-center">
                                    📌 判断基準
                                  </Label>
                                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                                    {form.sections.motivation.criteria.map((criterion, index) => (
                                      <li key={index}>• {criterion}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* 経歴・経験系 */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold border-b pb-2">経歴・経験系</h3>
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-sm font-medium">これまでどんな経験をしてきましたか？</Label>
                                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                    {form.sections.experience.pastExperience || '未入力'}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">学生時代・前職で一番力を入れたことは？</Label>
                                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                    {form.sections.experience.focusedActivity || '未入力'}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">アルバイトや活動で学んだことは？</Label>
                                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                    {form.sections.experience.learnedFromActivities || '未入力'}
                                  </p>
                                </div>
                                <div className="bg-muted p-3 rounded-md">
                                  <Label className="text-sm font-medium flex items-center">
                                    📌 判断基準
                                  </Label>
                                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                                    {form.sections.experience.criteria.map((criterion, index) => (
                                      <li key={index}>• {criterion}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* 自己理解系 */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold border-b pb-2">自己理解系</h3>
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-sm font-medium">あなたの強みと弱みは？</Label>
                                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                    {form.sections.selfUnderstanding.strengthsWeaknesses || '未入力'}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">周りからどんな人だと言われますか？</Label>
                                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                    {form.sections.selfUnderstanding.othersOpinion || '未入力'}
                                  </p>
                                </div>
                                <div className="bg-muted p-3 rounded-md">
                                  <Label className="text-sm font-medium flex items-center">
                                    📌 判断基準
                                  </Label>
                                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                                    {form.sections.selfUnderstanding.criteria.map((criterion, index) => (
                                      <li key={index}>• {criterion}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* 課題対応・行動特性系 */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold border-b pb-2">課題対応・行動特性系</h3>
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-sm font-medium">失敗した経験は？ どう乗り越えましたか？</Label>
                                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                    {form.sections.problemSolving.failureExperience || '未入力'}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">困難な状況でどう行動しましたか？</Label>
                                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                    {form.sections.problemSolving.difficultSituation || '未入力'}
                                  </p>
                                </div>
                                <div className="bg-muted p-3 rounded-md">
                                  <Label className="text-sm font-medium flex items-center">
                                    📌 判断基準
                                  </Label>
                                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                                    {form.sections.problemSolving.criteria.map((criterion, index) => (
                                      <li key={index}>• {criterion}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* 将来像系 */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold border-b pb-2">将来像系</h3>
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-sm font-medium">将来どんなキャリアを描いていますか？</Label>
                                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                    {form.sections.futureVision.careerVision || '未入力'}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">3年後・5年後はどんな立場で働いていたいですか？</Label>
                                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                    {form.sections.futureVision.futurePosition || '未入力'}
                                  </p>
                                </div>
                                <div className="bg-muted p-3 rounded-md">
                                  <Label className="text-sm font-medium flex items-center">
                                    📌 判断基準
                                  </Label>
                                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                                    {form.sections.futureVision.criteria.map((criterion, index) => (
                                      <li key={index}>• {criterion}</li>
                                    ))}
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
                                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                                    {form.sections.reverseQuestion.questions || '未入力'}
                                  </p>
                                </div>
                                <div className="bg-muted p-3 rounded-md">
                                  <Label className="text-sm font-medium flex items-center">
                                    📌 判断基準
                                  </Label>
                                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                                    {form.sections.reverseQuestion.criteria.map((criterion, index) => (
                                      <li key={index}>• {criterion}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* 編集モード */}
                  {isEditing && editingFormId && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold border-b pb-2">評定表編集</h3>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            キャンセル
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={handleSaveEdit}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            保存
                          </Button>
                        </div>
                      </div>
                    
                    {/* 評定者・総合評価 */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        基本情報
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm font-semibold text-blue-900">評定者</Label>
                            <Input 
                              placeholder="評定者名を入力してください" 
                              className="mt-1 border-blue-200 focus:border-blue-400"
                              value={formData.evaluator}
                              onChange={(e) => handleFormDataChange('evaluator', '', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm font-semibold text-green-900">総合評価</Label>
                            <Select 
                              value={formData.overallRating} 
                              onValueChange={(value) => handleFormDataChange('overallRating', '', value)}
                            >
                              <SelectTrigger className="mt-1 border-green-200 focus:border-green-400">
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
                      </div>
                      
                      {/* 総合評価の説明 */}
                      <div className="mt-4 p-4 bg-white rounded-md border-l-4 border-blue-500">
                        <Label className="text-sm font-semibold text-gray-900">評価基準</Label>
                        <div className="mt-2 space-y-2 text-sm text-gray-700">
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">A</span>
                            <span>優秀：志望動機が明確で一貫性があり、即戦力として期待できる</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">B</span>
                            <span>良好：基本的な能力を備えており、育成次第で活躍できる</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">C</span>
                            <span>普通：基本的な能力はあるが、さらなる成長が必要</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">D</span>
                            <span>不適格：基本的な能力や意欲に疑問があり、採用は推奨しない</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 志望理由系 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">志望理由系</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">なぜ当社を志望しましたか？</Label>
                          <Textarea 
                            placeholder="志望理由を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.motivation.companyMotivation}
                            onChange={(e) => handleFormDataChange('motivation', 'companyMotivation', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">この業界を選んだ理由は？</Label>
                          <Textarea 
                            placeholder="業界選択の理由を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.motivation.industryMotivation}
                            onChange={(e) => handleFormDataChange('motivation', 'industryMotivation', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">この職種を選んだ理由は？</Label>
                          <Textarea 
                            placeholder="職種選択の理由を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.motivation.jobMotivation}
                            onChange={(e) => handleFormDataChange('motivation', 'jobMotivation', e.target.value)}
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

                    {/* 経歴・経験系 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">経歴・経験系</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">これまでどんな経験をしてきましたか？</Label>
                          <Textarea 
                            placeholder="これまでの経験を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.experience.pastExperience}
                            onChange={(e) => handleFormDataChange('experience', 'pastExperience', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">学生時代・前職で一番力を入れたことは？</Label>
                          <Textarea 
                            placeholder="力を入れた活動や仕事を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.experience.focusedActivity}
                            onChange={(e) => handleFormDataChange('experience', 'focusedActivity', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">アルバイトや活動で学んだことは？</Label>
                          <Textarea 
                            placeholder="アルバイトや活動で学んだことを入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.experience.learnedFromActivities}
                            onChange={(e) => handleFormDataChange('experience', 'learnedFromActivities', e.target.value)}
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
                          <Label className="text-sm font-medium">あなたの強みと弱みは？</Label>
                          <Textarea 
                            placeholder="強みと弱みを入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.selfUnderstanding.strengthsWeaknesses}
                            onChange={(e) => handleFormDataChange('selfUnderstanding', 'strengthsWeaknesses', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">周りからどんな人だと言われますか？</Label>
                          <Textarea 
                            placeholder="周りからの評価を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.selfUnderstanding.othersOpinion}
                            onChange={(e) => handleFormDataChange('selfUnderstanding', 'othersOpinion', e.target.value)}
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

                    {/* 課題対応・行動特性系 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">課題対応・行動特性系</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">失敗した経験は？ どう乗り越えましたか？</Label>
                          <Textarea 
                            placeholder="失敗経験と克服方法を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.problemSolving.failureExperience}
                            onChange={(e) => handleFormDataChange('problemSolving', 'failureExperience', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">困難な状況でどう行動しましたか？</Label>
                          <Textarea 
                            placeholder="困難な状況での行動を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.problemSolving.difficultSituation}
                            onChange={(e) => handleFormDataChange('problemSolving', 'difficultSituation', e.target.value)}
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

                    {/* 将来像系 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">将来像系</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">将来どんなキャリアを描いていますか？</Label>
                          <Textarea 
                            placeholder="将来のキャリアビジョンを入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.futureVision.careerVision}
                            onChange={(e) => handleFormDataChange('futureVision', 'careerVision', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">3年後・5年後はどんな立場で働いていたいですか？</Label>
                          <Textarea 
                            placeholder="3年後・5年後の目標を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.futureVision.futurePosition}
                            onChange={(e) => handleFormDataChange('futureVision', 'futurePosition', e.target.value)}
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
                            onChange={(e) => handleFormDataChange('reverseQuestion', 'questions', e.target.value)}
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

                  {/* 新規評定表フォーム */}
                  {showEvaluationForm && !isEditing && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        新規評定表作成
                      </h3>
                    
                    {/* 評定者・総合評価 */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        基本情報
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm font-semibold text-blue-900">評定者</Label>
                            <Input 
                              placeholder="評定者名を入力してください" 
                              className="mt-1 border-blue-200 focus:border-blue-400"
                              value={formData.evaluator}
                              onChange={(e) => handleFormDataChange('evaluator', '', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm font-semibold text-green-900">総合評価</Label>
                            <Select 
                              value={formData.overallRating} 
                              onValueChange={(value) => handleFormDataChange('overallRating', '', value)}
                            >
                              <SelectTrigger className="mt-1 border-green-200 focus:border-green-400">
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
                      </div>
                      
                      {/* 総合評価の説明 */}
                      <div className="mt-4 p-4 bg-white rounded-md border-l-4 border-blue-500">
                        <Label className="text-sm font-semibold text-gray-900">評価基準</Label>
                        <div className="mt-2 space-y-2 text-sm text-gray-700">
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">A</span>
                            <span>優秀：志望動機が明確で一貫性があり、即戦力として期待できる</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">B</span>
                            <span>良好：基本的な能力を備えており、育成次第で活躍できる</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">C</span>
                            <span>普通：基本的な能力はあるが、さらなる成長が必要</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">D</span>
                            <span>不適格：基本的な能力や意欲に疑問があり、採用は推奨しない</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 志望理由系 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">志望理由系</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">なぜ当社を志望しましたか？</Label>
                          <Textarea 
                            placeholder="志望理由を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.motivation.companyMotivation}
                            onChange={(e) => handleFormDataChange('motivation', 'companyMotivation', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">この業界を選んだ理由は？</Label>
                          <Textarea 
                            placeholder="業界選択の理由を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.motivation.industryMotivation}
                            onChange={(e) => handleFormDataChange('motivation', 'industryMotivation', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">この職種を選んだ理由は？</Label>
                          <Textarea 
                            placeholder="職種選択の理由を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.motivation.jobMotivation}
                            onChange={(e) => handleFormDataChange('motivation', 'jobMotivation', e.target.value)}
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

                    {/* 経歴・経験系 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">経歴・経験系</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">これまでどんな経験をしてきましたか？</Label>
                          <Textarea 
                            placeholder="これまでの経験を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.experience.pastExperience}
                            onChange={(e) => handleFormDataChange('experience', 'pastExperience', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">学生時代・前職で一番力を入れたことは？</Label>
                          <Textarea 
                            placeholder="力を入れた活動や仕事を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.experience.focusedActivity}
                            onChange={(e) => handleFormDataChange('experience', 'focusedActivity', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">アルバイトや活動で学んだことは？</Label>
                          <Textarea 
                            placeholder="アルバイトや活動で学んだことを入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.experience.learnedFromActivities}
                            onChange={(e) => handleFormDataChange('experience', 'learnedFromActivities', e.target.value)}
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
                          <Label className="text-sm font-medium">あなたの強みと弱みは？</Label>
                          <Textarea 
                            placeholder="強みと弱みを入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.selfUnderstanding.strengthsWeaknesses}
                            onChange={(e) => handleFormDataChange('selfUnderstanding', 'strengthsWeaknesses', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">周りからどんな人だと言われますか？</Label>
                          <Textarea 
                            placeholder="周りからの評価を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.selfUnderstanding.othersOpinion}
                            onChange={(e) => handleFormDataChange('selfUnderstanding', 'othersOpinion', e.target.value)}
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

                    {/* 課題対応・行動特性系 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">課題対応・行動特性系</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">失敗した経験は？ どう乗り越えましたか？</Label>
                          <Textarea 
                            placeholder="失敗経験と克服方法を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.problemSolving.failureExperience}
                            onChange={(e) => handleFormDataChange('problemSolving', 'failureExperience', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">困難な状況でどう行動しましたか？</Label>
                          <Textarea 
                            placeholder="困難な状況での行動を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.problemSolving.difficultSituation}
                            onChange={(e) => handleFormDataChange('problemSolving', 'difficultSituation', e.target.value)}
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

                    {/* 将来像系 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">将来像系</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">将来どんなキャリアを描いていますか？</Label>
                          <Textarea 
                            placeholder="将来のキャリアビジョンを入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.futureVision.careerVision}
                            onChange={(e) => handleFormDataChange('futureVision', 'careerVision', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">3年後・5年後はどんな立場で働いていたいですか？</Label>
                          <Textarea 
                            placeholder="3年後・5年後の目標を入力してください" 
                            className="mt-1"
                            rows={3}
                            value={formData.futureVision.futurePosition}
                            onChange={(e) => handleFormDataChange('futureVision', 'futurePosition', e.target.value)}
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
                            onChange={(e) => handleFormDataChange('reverseQuestion', 'questions', e.target.value)}
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
            </TabsContent>

            {/* PDF管理タブ */}
            <TabsContent value="pdf-management" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <FileArchive className="h-5 w-5" />
                      <span>PDF管理</span>
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowPdfForm(!showPdfForm)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {showPdfForm ? 'フォームを閉じる' : 'PDF追加'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showPdfForm ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold border-b pb-2">PDF追加</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">カテゴリ</Label>
                          <Select value={pdfFormData.category} onValueChange={(value) => handlePdfFormDataChange('category', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="カテゴリを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="resume">履歴書</SelectItem>
                              <SelectItem value="cover-letter">職務経歴書</SelectItem>
                              <SelectItem value="evaluation">評価資料</SelectItem>
                              <SelectItem value="contract">契約書類</SelectItem>
                              <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">PDFファイル</Label>
                          <Input 
                            type="file" 
                            accept=".pdf"
                            onChange={(e) => handlePdfFormDataChange('file', e.target.files?.[0] || null)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setShowPdfForm(false)}>
                          キャンセル
                        </Button>
                        <Button onClick={handleSavePdf}>
                          追加
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileArchive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">PDF管理機能</h3>
                      <p className="text-muted-foreground mb-4">
                        PDF管理機能は現在開発中です。<br />
                        応募者の書類や評価資料をPDFで管理できます。
                      </p>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>PDFファイルのアップロード</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>カテゴリ別の整理</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>検索・フィルタリング</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* メール履歴タブ */}
            <TabsContent value="email-history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>メール履歴</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">メール履歴機能</h3>
                    <p className="text-muted-foreground mb-4">
                      メール履歴機能は現在開発中です。<br />
                      応募者に送信したメールの履歴を管理できます。
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>送信メールの履歴</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>メールテンプレート管理</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>送信状況の追跡</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
