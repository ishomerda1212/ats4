import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicantResponseView } from '../hooks/useApplicantResponseView';
import { ApplicantResponseView } from '../components/ApplicantResponseView';

export const ApplicantResponseViewPage: React.FC = () => {
  const { applicantId, eventId } = useParams<{
    applicantId: string;
    eventId: string;
  }>();
  const navigate = useNavigate();

  const {
    loading,
    error,
    applicant,
    eventData,
    response
  } = useApplicantResponseView(applicantId!, eventId!);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500 bg-red-50 rounded-full flex items-center justify-center">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">エラー</h2>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  if (!applicant || !eventData || !response) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400 bg-gray-50 rounded-full flex items-center justify-center">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">データが見つかりません</h2>
          <p className="text-gray-600 text-sm mb-4">
            応募者またはイベントの情報が見つかりませんでした。
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <ApplicantResponseView
      applicant={applicant}
      eventData={eventData}
      response={response}
      isReadOnly={true}
      onBack={handleBack}
    />
  );
};