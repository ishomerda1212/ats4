import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthUser, LoginCredentials, AuthState } from '../types/auth';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // ユーザー情報を変換する関数
  const transformUser = (user: User | null): AuthUser | null => {
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email || '',
      created_at: user.created_at,
    };
  };

  // 初期認証状態をチェック
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // セッションを取得して認証状態をチェック
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('認証状態の取得に失敗しました:', error);
        }

        setState(prev => ({
          ...prev,
          user: transformUser(session?.user || null),
          loading: false,
        }));
      } catch (error: unknown) {
        console.error('認証状態の確認中にエラーが発生しました:', error);
        setState(prev => ({
          ...prev,
          loading: false,
        }));
      }
    };

    checkAuth();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          user: transformUser(session?.user || null),
          loading: false,
        }));
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ログイン関数
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        user: transformUser(data.user),
        loading: false,
        error: null,
      }));
    } catch (error: unknown) {
      console.error('ログインエラー:', error);
      const errorMessage = error instanceof Error ? error.message : 'ログインに失敗しました';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // ログアウト関数
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
        error: null,
      }));
    } catch (error: unknown) {
      console.error('ログアウトエラー:', error);
      const errorMessage = error instanceof Error ? error.message : 'ログアウトに失敗しました';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // エラーをクリアする関数
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    clearError,
  };
};
