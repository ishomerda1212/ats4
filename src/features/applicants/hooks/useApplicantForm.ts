import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Applicant } from '../types/applicant';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export function useApplicantForm(
  applicant?: Applicant, 
  mode: 'create' | 'edit' = 'create',
  onRefresh?: () => void
) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 新規作成時と編集時で異なるバリデーションスキーマを使用
  const createSchema = z.object({
    source: z.string().min(1, '反響元を選択してください'),
    name: z.string().min(1, '氏名を入力してください'),
    nameKana: z.string().min(1, 'フリガナを入力してください'),
    gender: z.string().optional(),
    schoolName: z.string().optional(),
    faculty: z.string().optional(),
    department: z.string().optional(),
    graduationYear: z.coerce.number().min(2020, '有効な卒業年度を入力してください'),
    currentAddress: z.string().optional(),
    birthplace: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('有効なメールアドレスを入力してください').optional().or(z.literal('')),
    currentStage: z.string().optional(), // 新規作成時は固定でエントリー
    // 詳細情報（オプション）
    experience: z.string().optional(),
    otherCompanyStatus: z.string().optional(),
    appearance: z.string().optional(),
  });

  const editSchema = z.object({
    source: z.string().min(1, '反響元を選択してください'),
    name: z.string().min(1, '氏名を入力してください'),
    nameKana: z.string().min(1, 'フリガナを入力してください'),
    gender: z.string().optional(),
    schoolName: z.string().optional(),
    faculty: z.string().optional(),
    department: z.string().optional(),
    graduationYear: z.coerce.number().min(2020, '有効な卒業年度を入力してください'),
    currentAddress: z.string().optional(),
    birthplace: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('有効なメールアドレスを入力してください').optional().or(z.literal('')),
    currentStage: z.string().min(1, '選考段階を選択してください'),
    // 詳細情報（オプション）
    experience: z.string().optional(),
    otherCompanyStatus: z.string().optional(),
    appearance: z.string().optional(),
  });

  const schema = mode === 'create' ? createSchema : editSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      source: '',
      name: '',
      nameKana: '',
      gender: '',
      schoolName: '',
      faculty: '',
      department: '',
      graduationYear: 2025,
      currentAddress: '',
      birthplace: '',
      phone: '',
      email: '',
      currentStage: mode === 'create' ? 'エントリー' : 'エントリー',
      // 詳細情報
      experience: '',
      otherCompanyStatus: '',
      appearance: '',
    },
  });

  // applicantデータが読み込まれた後にフォームの値を設定
  useEffect(() => {
    console.log('🔄 useEffect triggered');
    console.log('👤 Applicant data:', applicant);
    console.log('📝 Mode:', mode);
    
    if (applicant && mode === 'edit') {
      console.log('✅ Setting form values for edit mode');
      const formData = {
        source: applicant.source,
        name: applicant.name,
        nameKana: applicant.nameKana,
        gender: applicant.gender,
        schoolName: applicant.schoolName,
        faculty: applicant.faculty || '',
        department: applicant.department || '',
        graduationYear: applicant.graduationYear,
        currentAddress: applicant.currentAddress,
        birthplace: applicant.birthplace || '',
        phone: applicant.phone,
        email: applicant.email,
        currentStage: applicant.currentStage,
        // 詳細情報
        experience: applicant.experience || '',
        otherCompanyStatus: applicant.otherCompanyStatus || '',
        appearance: applicant.appearance || '',
      };
      console.log('📋 Form data to set:', formData);
      
      // 必須フィールドの確認
      const requiredFields = ['source', 'name', 'nameKana', 'gender', 'schoolName', 'graduationYear', 'currentAddress', 'phone', 'email', 'currentStage'];
      requiredFields.forEach(field => {
        const value = formData[field as keyof typeof formData];
        console.log(`🔍 Required field ${field}:`, value, typeof value);
        if (!value) {
          console.warn(`⚠️ Missing required field: ${field}`);
        }
      });
      
      form.reset(formData);
      
      // フォームの状態を確認
      setTimeout(() => {
        console.log('🔍 Form state after reset:');
        console.log('✅ Form is valid:', form.formState.isValid);
        console.log('❌ Form errors:', form.formState.errors);
        console.log('📋 Current form values:', form.getValues());
        console.log('🔍 Form dirty:', form.formState.isDirty);
        console.log('🔍 Form touched:', form.formState.touchedFields);
        
        // バリデーションを手動で実行
        form.trigger().then(isValid => {
          console.log('🔍 Manual validation result:', isValid);
          console.log('❌ Validation errors after trigger:', form.formState.errors);
        });
      }, 500);
    }
  }, [applicant, mode, form]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.log('🚀 onSubmit called with data:', data);
    console.log('📝 Mode:', mode);
    console.log('👤 Applicant:', applicant);
    
    setLoading(true);
    try {
      if (mode === 'create') {
        console.log('➕ Creating new applicant...');
        // 応募者データを挿入
        const { data: applicant, error: insertError } = await supabase
          .from('applicants')
          .insert([{
            source: data.source,
            name: data.name,
            name_kana: data.nameKana,
            gender: data.gender || null,
            school_name: data.schoolName || null,
            faculty: data.faculty || null,
            department: data.department || null,
            graduation_year: data.graduationYear,
            current_address: data.currentAddress || null,
            birthplace: data.birthplace || null,
            phone: data.phone || null,
            email: data.email || null,
            current_stage: 'エントリー',
            experience: data.experience || null,
            other_company_status: data.otherCompanyStatus || null,
            appearance: data.appearance || null,
          }])
          .select()
          .single();

        if (insertError) {
          console.error('❌ Failed to insert applicant:', insertError);
          return { success: false, message: '応募者の登録に失敗しました' };
        }

        console.log('✅ Applicant created successfully:', applicant);

        // 選考履歴にエントリー段階を登録
        const { error: historyError } = await supabase
          .from('selection_histories')
          .insert([{
            applicant_id: applicant.id,
            stage: 'エントリー',
            status: '完了',
            notes: '新規応募者登録',
          }]);
          
        if (historyError) {
          console.error('❌ Failed to create selection history:', historyError);
          // 履歴作成に失敗しても応募者登録は成功とする
        } else {
          console.log('✅ Selection history created successfully');
        }
        
        // エントリー段階のタスクインスタンスを作成
        const { data: fixedTasks } = await supabase
          .from('fixed_tasks')
          .select('*')
          .eq('stage', 'エントリー')
          .order('order_num', { ascending: true });
          
        if (fixedTasks && fixedTasks.length > 0) {
          // 登録日時を基準として一度だけ取得
          const registrationDate = new Date();
          let approachIndex = 0; // アプローチタスクのインデックス
          
          const taskInstances = fixedTasks.map((task) => {
            const baseData = {
              applicant_id: applicant.id,
              task_id: task.id,
              status: '未着手' as const,
              notes: '',
            };
            
            // アプローチタスクのみ期限を設定
            if (task.title.startsWith('アプローチ')) {
              const dueDate = new Date(registrationDate);
              dueDate.setDate(registrationDate.getDate() + approachIndex); // アプローチ1は登録日、アプローチ2は+1日、アプローチ3は+2日...
              
              approachIndex++; // 次のアプローチタスクのためにインデックスを増加
              
              return {
                ...baseData,
                due_date: dueDate.toISOString(),
              };
            }
            
            // アプローチ以外のタスクは期限なし
            return baseData;
          });
          
          const { error: taskError } = await supabase
            .from('task_instances')
            .insert(taskInstances);
            
          if (taskError) {
            console.error('❌ Failed to create task instances:', taskError);
            // タスク作成に失敗しても応募者登録は成功とする
          }
        }
        
        // データをリフレッシュ
        if (onRefresh) {
          onRefresh();
        }
        
        toast({
          title: "応募者を登録しました",
          description: `${data.name}さんの情報が正常に登録されました。`,
        });

        navigate('/applicants');
      } else if (applicant) {
        console.log('✏️ Updating existing applicant...');
        console.log('🆔 Applicant ID:', applicant.id);
        
        // 更新
        const { error } = await supabase
          .from('applicants')
          .update({
            source: data.source,
            name: data.name,
            name_kana: data.nameKana,
            gender: data.gender,
            school_name: data.schoolName,
            faculty: data.faculty || null,
            department: data.department || null,
            graduation_year: data.graduationYear,
            current_address: data.currentAddress,
            birthplace: data.birthplace || null,
            phone: data.phone,
            email: data.email || null, // メールアドレスが空の場合はnull
            current_stage: data.currentStage,
            experience: data.experience || null,
            other_company_status: data.otherCompanyStatus || null,
            appearance: data.appearance || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', applicant.id);

        if (error) {
          console.error('❌ Supabase update error:', error);
          throw error;
        }
        
        console.log('✅ Applicant updated successfully');
        
        // データをリフレッシュ
        if (onRefresh) {
          console.log('🔄 Calling onRefresh...');
          onRefresh();
        }
        
        toast({
          title: "応募者情報を更新しました",
          description: `${data.name}さんの情報が正常に更新されました。`,
        });

        navigate(`/applicants/${applicant.id}`);
      }
    } catch (error) {
      console.error('❌ Error saving applicant:', error);
      toast({
        title: "エラーが発生しました",
        description: "応募者情報の保存に失敗しました。",
        variant: "destructive",
      });
    } finally {
      console.log('🏁 onSubmit completed, setting loading to false');
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    loading,
  };
}