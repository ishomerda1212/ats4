import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApplicantDetail } from '@/features/applicants/hooks/useApplicantDetail';
import { ApplicantBasicInfo } from '@/features/applicants/components/ApplicantBasicInfo';
import { ApplicantDetailTabs } from './components/ApplicantDetailTabs';
import { useEvaluationForms } from './hooks/useEvaluationForms';
import { usePDFStorage } from './hooks/usePDFStorage';

export function ApplicantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { applicant, history, stageDetails, loading } = useApplicantDetail(id!);
  const [activeTab, setActiveTab] = useState('selection-history');
  
  // フックを使用して状態管理を分離
  const evaluationFormsHook = useEvaluationForms(id!);
  const pdfStorageHook = usePDFStorage();

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
          <ApplicantDetailTabs
            applicant={applicant}
            history={history}
            stageDetails={stageDetails}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            // 評定表関連のprops
            evaluationForms={evaluationFormsHook.evaluationForms}
            formData={evaluationFormsHook.formData}
            showEvaluationForm={evaluationFormsHook.showEvaluationForm}
            isEditing={evaluationFormsHook.isEditing}
            editingFormId={evaluationFormsHook.editingFormId}
            viewingFormId={evaluationFormsHook.viewingFormId}
            onShowEvaluationForm={evaluationFormsHook.setShowEvaluationForm}
            onFormDataChange={evaluationFormsHook.handleFormDataChange}
            onSaveEvaluation={evaluationFormsHook.handleSaveEvaluation}
            onEditForm={evaluationFormsHook.handleEditForm}
            onViewForm={evaluationFormsHook.handleViewForm}
            onDeleteForm={evaluationFormsHook.handleDeleteForm}
            onSaveEdit={evaluationFormsHook.handleSaveEdit}
            onCancelEdit={evaluationFormsHook.handleCancelEdit}
            // PDF関連のprops
            pdfFormData={pdfStorageHook.pdfFormData}
            showPdfForm={pdfStorageHook.showPdfForm}
            onShowPdfForm={pdfStorageHook.setShowPdfForm}
            onPdfFormDataChange={pdfStorageHook.handlePdfFormDataChange}
            onSavePdf={pdfStorageHook.handleSavePdf}
          />
        </div>
      </div>
    </div>
  );
}
