import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { useAuthContext } from '../context/AuthContext';

export function LoginPage() {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  // 既にログインしている場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // ローディング中は何も表示しない
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 既にログインしている場合は何も表示しない（リダイレクトされる）
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            採用管理システム
          </h1>
          <p className="text-gray-600">
            システムにログインして作業を開始してください
          </p>
        </div>
        
        <LoginForm 
          onSuccess={() => navigate('/dashboard')}
        />
      </div>
    </div>
  );
}
