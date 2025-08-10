import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Applicant } from '../types/applicant';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const applicantSchema = z.object({
  source: z.string().min(1, '反響元を選択してください'),
  name: z.string().min(1, '氏名を入力してください'),
  nameKana: z.string().min(1, 'フリガナを入力してください'),
  gender: z.string().min(1, '性別を選択してください'),
  schoolName: z.string().min(1, '学校名を入力してください'),
  faculty: z.string().min(1, '学部を入力してください'),
  department: z.string().min(1, '学科・コースを入力してください'),
  graduationYear: z.number().min(2020, '有効な卒業年度を入力してください'),
  address: z.string().min(1, '住所を入力してください'),
  phone: z.string().min(1, '電話番号を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  currentStage: z.string().min(1, '選考段階を選択してください'),
  // 詳細情報（オプション）
  motivation: z.string().optional(),
  jobSearchAxis: z.string().optional(),
  otherCompanyStatus: z.string().optional(),
  futureVision: z.string().optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  experience: z.string().optional(),
});

type ApplicantFormData = z.infer<typeof applicantSchema>;

export function useApplicantForm(applicant?: Applicant, mode: 'create' | 'edit' = 'create') {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ApplicantFormData>({
    resolver: zodResolver(applicantSchema),
    defaultValues: applicant ? {
      source: applicant.source,
      name: applicant.name,
      nameKana: applicant.nameKana,
      gender: applicant.gender,
      schoolName: applicant.schoolName,
      faculty: applicant.faculty,
      department: applicant.department,
      graduationYear: applicant.graduationYear,
      address: applicant.address,
      phone: applicant.phone,
      email: applicant.email,
      currentStage: applicant.currentStage,
      // 詳細情報
      motivation: applicant.motivation || '',
      jobSearchAxis: applicant.jobSearchAxis || '',
      otherCompanyStatus: applicant.otherCompanyStatus || '',
      futureVision: applicant.futureVision || '',
      strengths: applicant.strengths || '',
      weaknesses: applicant.weaknesses || '',
      experience: applicant.experience || '',
    } : {
      source: '',
      name: '',
      nameKana: '',
      gender: '',
      schoolName: '',
      faculty: '',
      department: '',
      graduationYear: 2025,
      address: '',
      phone: '',
      email: '',
      currentStage: 'エントリー',
      // 詳細情報
      motivation: '',
      jobSearchAxis: '',
      otherCompanyStatus: '',
      futureVision: '',
      strengths: '',
      weaknesses: '',
      experience: '',
    },
  });

  const onSubmit = async (data: ApplicantFormData) => {
    setLoading(true);
    try {
      if (mode === 'create') {
        // const newApplicant: Applicant = {
        //   id: generateId(),
        //   ...data,
        //   createdAt: new Date().toISOString(),
        //   updatedAt: new Date().toISOString(),
        // };
        
        toast({
          title: "応募者を登録しました",
          description: `${data.name}さんの情報が正常に登録されました。`,
        });

        navigate('/applicants');
      } else if (applicant) {
        // const updatedApplicant: Applicant = {
        //   ...applicant,
        //   ...data,
        //   updatedAt: new Date().toISOString(),
        // };
        
        toast({
          title: "応募者情報を更新しました",
          description: `${data.name}さんの情報が正常に更新されました。`,
        });

        navigate(`/applicants/${applicant.id}`);
      }
    } catch {
      toast({
        title: "エラーが発生しました",
        description: "応募者情報の保存に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    loading,
  };
}