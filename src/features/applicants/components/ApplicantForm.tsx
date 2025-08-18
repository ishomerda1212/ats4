import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApplicantForm } from '../hooks/useApplicantForm';
import { SOURCES, GENDERS, SELECTION_STAGES } from '@/shared/utils/constants';
import { Applicant } from '../types/applicant';

interface ApplicantFormProps {
  applicant?: Applicant;
  mode: 'create' | 'edit';
  onRefresh?: () => void;
}

export function ApplicantForm({ applicant, mode, onRefresh }: ApplicantFormProps) {
  const { form, onSubmit, loading } = useApplicantForm(applicant, mode, onRefresh);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {mode === 'create' ? '新規応募者登録' : '応募者情報編集'}
          </CardTitle>
          <Link to={mode === 'create' ? '/applicants' : `/applicants/${applicant?.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {mode === 'create' ? '一覧に戻る' : '詳細に戻る'}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            console.log('📝 Form submit event triggered');
            console.log('🔍 Form state:', form.formState);
            console.log('✅ Form is valid:', form.formState.isValid);
            console.log('❌ Form errors:', form.formState.errors);
            console.log('🔍 Form values:', form.getValues());
            console.log('🔍 Form dirty:', form.formState.isDirty);
            console.log('🔍 Form touched:', form.formState.touchedFields);
            
            // バリデーションエラーの詳細を確認
            const errors = form.formState.errors;
            Object.keys(errors).forEach(key => {
              console.log(`❌ Error in ${key}:`, errors[key as keyof typeof errors]);
            });
            
            // 手動でバリデーションを実行
            const isValid = await form.trigger();
            console.log('🔍 Manual validation result:', isValid);
            console.log('❌ Validation errors after trigger:', form.formState.errors);
            
            // フォームが有効な場合のみonSubmitを実行
            if (isValid) {
              console.log('✅ Form is valid, proceeding with submission');
              onSubmit(e);
            } else {
              console.log('❌ Form is invalid, preventing submission');
            }
          }} className="space-y-6">
            {/* 基本情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">基本情報</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>反響元 *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="反響元を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SOURCES.map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>性別</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="性別を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GENDERS.map((gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>氏名 *</FormLabel>
                      <FormControl>
                        <Input placeholder="例: 山田 太郎" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nameKana"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>フリガナ *</FormLabel>
                      <FormControl>
                        <Input placeholder="例: ヤマダ タロウ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 学校情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">学校情報</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="graduationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>卒業予定年度 *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2025" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="schoolName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>学校名</FormLabel>
                      <FormControl>
                        <Input placeholder="例: 東京大学" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="faculty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>学部</FormLabel>
                      <FormControl>
                        <Input placeholder="例: 工学部" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>学科・コース</FormLabel>
                      <FormControl>
                        <Input placeholder="例: 情報工学科" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 連絡先情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">連絡先情報</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>電話番号</FormLabel>
                      <FormControl>
                        <Input placeholder="090-1234-5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="currentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>現住所</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="東京都渋谷区..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentStage"
                render={({ field }) => (
                  <FormItem className={mode === 'create' ? 'hidden' : ''}>
                    <FormLabel>現在の選考段階 *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選考段階を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SELECTION_STAGES.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthplace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>出身地</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="北海道札幌市..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 詳細情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">詳細情報</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>学業・バイト・サークル</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="例: 大学サークル（経営研究会）会長、アルバイト（塾講師2年）、ボランティア活動など" 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherCompanyStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>他社状況</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="例: 大手IT企業2社から内定、ベンチャー企業1社から最終選考中" 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appearance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>見た目</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="例: 身長165cm、体重55kg、黒髪ショート、清潔感のある服装" 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link to={mode === 'create' ? '/applicants' : `/applicants/${applicant?.id}`}>
                <Button type="button" variant="outline">
                  キャンセル
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={loading}
                onClick={() => {
                  console.log('🔘 Update button clicked');
                  console.log('⏳ Loading state:', loading);
                  console.log('📋 Form values:', form.getValues());
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? '保存中...' : mode === 'create' ? '登録' : '更新'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}