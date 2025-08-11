import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEvaluationForm } from '../hooks/useEvaluationForm';
import { EVALUATION_FIELDS } from '../types/evaluation';

interface EvaluationFormProps {
  applicantId: string;
  selectionHistoryId?: string;
}

export function EvaluationForm({ applicantId }: EvaluationFormProps) {
  console.log('EvaluationForm props:', { applicantId });
  
  const { form, onSubmit, loading } = useEvaluationForm(applicantId);
  const navigate = useNavigate();

  console.log('EvaluationForm rendered with:', { applicantId });

  const handleBackClick = (e: React.MouseEvent) => {
    console.log('=== 戻るボタンクリック開始 ===');
    console.log('戻るボタンがクリックされました', { applicantId, e });
    console.log('現在のURL:', window.location.href);
    console.log('現在のパス:', window.location.pathname);
    console.log('現在のハッシュ:', window.location.hash);
    
    e.preventDefault();
    e.stopPropagation();
    
    // 現在のURLが評定表フォームページかどうかを確認
    const currentPath = window.location.hash.replace('#', '');
    console.log('現在のパス（ハッシュ除去）:', currentPath);
    
    // 評定表フォームページから応募者詳細ページに戻る
    const targetPath = `/applicants/${applicantId}`;
    console.log('ナビゲーション先:', targetPath);
    
    try {
      console.log('ナビゲーション実行前');
      navigate(targetPath);
      console.log('ナビゲーション実行後');
    } catch (error) {
      console.error('ナビゲーションエラー:', error);
      // フォールバック: 直接URLを変更
      try {
        window.location.href = `/#${targetPath}`;
        console.log('フォールバックナビゲーション実行');
      } catch (fallbackError) {
        console.error('フォールバックナビゲーションエラー:', fallbackError);
      }
    }
    
    console.log('=== 戻るボタンクリック終了 ===');
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    console.log('=== キャンセルボタンクリック開始 ===');
    console.log('キャンセルボタンがクリックされました', { applicantId, e });
    e.preventDefault();
    e.stopPropagation();
    console.log('ナビゲーション実行前');
    try {
      navigate(`/applicants/${applicantId}`);
      console.log('ナビゲーション実行後');
    } catch (error) {
      console.error('ナビゲーションエラー:', error);
      // 代替手段としてwindow.locationを使用
      window.location.href = `/#/applicants/${applicantId}`;
    }
    console.log('=== キャンセルボタンクリック終了 ===');
  };

  console.log('EvaluationForm レンダリング開始');
  console.log('戻るボタンのhandleBackClick関数:', typeof handleBackClick);
  console.log('navigate関数:', typeof navigate);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">評定表入力</CardTitle>
          <Button 
            id="back-button"
            variant="outline" 
            size="sm" 
            onClick={handleBackClick}
            onMouseEnter={() => console.log('戻るボタンにマウスオーバー')}
            onMouseDown={() => console.log('戻るボタンがマウスダウンされました')}
            onMouseUp={() => console.log('戻るボタンがマウスアップされました')}
            style={{ cursor: 'pointer' }}
            disabled={false}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 p-4">
        <Form {...form}>
          <form onSubmit={(e) => {
            console.log('フォーム送信イベントが発生しました');
            onSubmit(e);
          }} className="flex-1 flex flex-col space-y-4">
            <div className="flex-1 space-y-4 overflow-y-auto">
              <FormField
                control={form.control}
                name="evaluatorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>評価者名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="評価者の氏名を入力してください" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {EVALUATION_FIELDS.map((fieldConfig) => (
                <FormField
                  key={fieldConfig.key}
                  control={form.control}
                  name={fieldConfig.key as keyof typeof form.control._defaultValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldConfig.label} *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={fieldConfig.placeholder}
                          className="min-h-[150px] resize-none text-sm placeholder:text-gray-400 placeholder:text-xs leading-relaxed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="flex-shrink-0 flex justify-end space-x-4 pt-4 border-t">
              <Button 
                id="cancel-button"
                type="button" 
                variant="outline" 
                onClick={handleCancelClick}
                onMouseEnter={() => console.log('キャンセルボタンにマウスオーバー')}
                onMouseDown={() => console.log('キャンセルボタンがマウスダウンされました')}
                onMouseUp={() => console.log('キャンセルボタンがマウスアップされました')}
                style={{ cursor: 'pointer' }}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? '保存中...' : '評定表を保存'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}