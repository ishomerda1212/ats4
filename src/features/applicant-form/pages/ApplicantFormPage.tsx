import React from 'react';
import { useParams } from 'react-router-dom';
import { ApplicantEventForm } from '../components/ApplicantEventForm';

export const ApplicantFormPage: React.FC = () => {
  const { applicantId, eventId } = useParams<{
    applicantId: string;
    eventId: string;
  }>();

  // デバッグ情報をコンソールに出力
  // console.log('ApplicantFormPage - URL Parameters:', { applicantId, eventId });

  if (!applicantId || !eventId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">無効なURL</h2>
          <p className="text-gray-600">
            応募者IDまたはイベントIDが指定されていません。
            正しいURLでアクセスしてください。
          </p>
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
            <p>Debug Info:</p>
            <p>applicantId: {applicantId || 'undefined'}</p>
            <p>eventId: {eventId || 'undefined'}</p>
          </div>
        </div>
      </div>
    );
  }

  return <ApplicantEventForm applicantId={applicantId} eventId={eventId} />;
};