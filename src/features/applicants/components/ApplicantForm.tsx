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
}

export function ApplicantForm({ applicant, mode }: ApplicantFormProps) {
  const { form, onSubmit, loading } = useApplicantForm(applicant, mode);

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
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基本情報 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">基本情報</h3>
                
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>反響元 *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>氏名 *</FormLabel>
                      <FormControl>
                        <Input placeholder="山田 太郎" {...field} />
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
                        <Input placeholder="ヤマダ タロウ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>性別 *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  name="currentStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>現在の選考段階 *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              </div>

              {/* 学校情報 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">学校情報</h3>
                
                <FormField
                  control={form.control}
                  name="schoolName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>学校名 *</FormLabel>
                      <FormControl>
                        <Input placeholder="○○大学" {...field} />
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
                      <FormLabel>学部 *</FormLabel>
                      <FormControl>
                        <Input placeholder="工学部" {...field} />
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
                      <FormLabel>学科・コース *</FormLabel>
                      <FormControl>
                        <Input placeholder="情報工学科" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      <FormLabel>メールアドレス *</FormLabel>
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
                      <FormLabel>電話番号 *</FormLabel>
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>住所 *</FormLabel>
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
            </div>

            {/* 詳細情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">詳細情報</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 志望動機・就活の軸・他社状況・将来像 */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="motivation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>志望動機</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="御社を志望した理由や動機を記入してください" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jobSearchAxis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>就活の軸</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="就職活動で重視している軸や条件を記入してください" 
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
                            placeholder="他社の選考状況や内定状況を記入してください" 
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
                    name="futureVision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>将来像</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="将来のキャリアビジョンや目標を記入してください" 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 長所・短所・経験・活動歴 */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="strengths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>長所</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="自分の長所や強みを記入してください" 
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
                    name="weaknesses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>短所</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="自分の短所や改善点を記入してください" 
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
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>経験・活動歴</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="趣味、サークル活動、アルバイト、ボランティアなどの経験を記入してください" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link to={mode === 'create' ? '/applicants' : `/applicants/${applicant?.id}`}>
                <Button type="button" variant="outline">
                  キャンセル
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
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