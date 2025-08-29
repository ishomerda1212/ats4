import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApplicantDataAccess } from '../applicantDataAccess'
import { supabase } from '@/lib/supabase'

// Supabaseのモック
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('ApplicantDataAccess', () => {
  const mockSupabase = vi.mocked(supabase)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllApplicants', () => {
    it('should return transformed applicants', async () => {
      const mockData = [
        {
          id: '1',
          source: 'マイナビ',
          name: '田中太郎',
          name_kana: 'タナカタロウ',
          gender: '男性',
          school_name: '東京大学',
          faculty: '工学部',
          department: '情報工学科',
          graduation_year: '2025',
          current_address: '東京都',
          birthplace: '東京都',
          phone: '090-1234-5678',
          email: 'tanaka@example.com',
          current_stage: 'エントリー',
          experience: 'プログラミング',
          other_company_status: '応募中',
          appearance: '面接予定',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ]

      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: mockData,
          error: null,
        }),
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await ApplicantDataAccess.getAllApplicants()

      expect(mockSupabase.from).toHaveBeenCalledWith('applicants')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: '1',
        source: 'マイナビ',
        name: '田中太郎',
        nameKana: 'タナカタロウ',
        gender: '男性',
        schoolName: '東京大学',
        faculty: '工学部',
        department: '情報工学科',
        graduationYear: '2025',
        currentAddress: '東京都',
        birthplace: '東京都',
        phone: '090-1234-5678',
        email: 'tanaka@example.com',
        currentStage: 'エントリー',
        experience: 'プログラミング',
        otherCompanyStatus: '応募中',
        appearance: '面接予定',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      })
    })

    it('should throw error when database error occurs', async () => {
      const mockError = new Error('Database error')
      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any)

      await expect(ApplicantDataAccess.getAllApplicants()).rejects.toThrow('Database error')
    })
  })

  describe('getApplicantById', () => {
    it('should return transformed applicant', async () => {
      const mockData = {
        id: '1',
        source: 'マイナビ',
        name: '田中太郎',
        name_kana: 'タナカタロウ',
        gender: '男性',
        school_name: '東京大学',
        faculty: '工学部',
        department: '情報工学科',
        graduation_year: '2025',
        current_address: '東京都',
        birthplace: '東京都',
        phone: '090-1234-5678',
        email: 'tanaka@example.com',
        current_stage: 'エントリー',
        experience: 'プログラミング',
        other_company_status: '応募中',
        appearance: '面接予定',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockData,
            error: null,
          }),
        }),
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await ApplicantDataAccess.getApplicantById('1')

      expect(mockSupabase.from).toHaveBeenCalledWith('applicants')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(result).toEqual({
        id: '1',
        source: 'マイナビ',
        name: '田中太郎',
        nameKana: 'タナカタロウ',
        gender: '男性',
        schoolName: '東京大学',
        faculty: '工学部',
        department: '情報工学科',
        graduationYear: '2025',
        currentAddress: '東京都',
        birthplace: '東京都',
        phone: '090-1234-5678',
        email: 'tanaka@example.com',
        currentStage: 'エントリー',
        experience: 'プログラミング',
        otherCompanyStatus: '応募中',
        appearance: '面接予定',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      })
    })

    it('should return null when applicant not found', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await ApplicantDataAccess.getApplicantById('999')

      expect(result).toBeNull()
    })
  })

  describe('getSelectionHistory', () => {
    it('should return transformed selection history', async () => {
      const mockData = [
        {
          id: '1',
          applicant_id: '1',
          stage: 'エントリー',
          status: '完了',
          notes: '新規応募者登録',
          session_type: 'オンライン',
          result: '合格',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ]

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockData,
            error: null,
          }),
        }),
      })

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await ApplicantDataAccess.getSelectionHistory('1')

      expect(mockSupabase.from).toHaveBeenCalledWith('selection_histories')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: '1',
        applicantId: '1',
        stage: 'エントリー',
        status: '完了',
        notes: '新規応募者登録',
        sessionType: 'オンライン',
        result: '合格',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      })
    })
  })

  describe('createApplicant', () => {
    it('should create and return transformed applicant', async () => {
      const mockData = {
        id: '1',
        source: 'マイナビ',
        name: '田中太郎',
        name_kana: 'タナカタロウ',
        gender: '男性',
        school_name: '東京大学',
        faculty: '工学部',
        department: '情報工学科',
        graduation_year: '2025',
        current_address: '東京都',
        birthplace: '東京都',
        phone: '090-1234-5678',
        email: 'tanaka@example.com',
        current_stage: 'エントリー',
        experience: 'プログラミング',
        other_company_status: '応募中',
        appearance: '面接予定',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockData,
            error: null,
          }),
        }),
      })

      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
      } as any)

      const applicantData = {
        source: 'マイナビ' as any,
        name: '田中太郎',
        nameKana: 'タナカタロウ',
        gender: '男性' as any,
        schoolName: '東京大学',
        faculty: '工学部',
        department: '情報工学科',
        graduationYear: 2025,
        currentAddress: '東京都',
        birthplace: '東京都',
        phone: '090-1234-5678',
        email: 'tanaka@example.com',
        currentStage: 'エントリー' as any,
        experience: 'プログラミング',
        otherCompanyStatus: '応募中',
        appearance: '面接予定',
      }

      const result = await ApplicantDataAccess.createApplicant(applicantData)

      expect(mockSupabase.from).toHaveBeenCalledWith('applicants')
      expect(mockInsert).toHaveBeenCalledWith([{
        source: 'マイナビ',
        name: '田中太郎',
        name_kana: 'タナカタロウ',
        gender: '男性',
        school_name: '東京大学',
        faculty: '工学部',
        department: '情報工学科',
        graduation_year: 2025,
        current_address: '東京都',
        birthplace: '東京都',
        phone: '090-1234-5678',
        email: 'tanaka@example.com',
        current_stage: 'エントリー',
        experience: 'プログラミング',
        other_company_status: '応募中',
        appearance: '面接予定',
      }])
      expect(result).toEqual({
        id: '1',
        source: 'マイナビ',
        name: '田中太郎',
        nameKana: 'タナカタロウ',
        gender: '男性',
        schoolName: '東京大学',
        faculty: '工学部',
        department: '情報工学科',
        graduationYear: '2025',
        currentAddress: '東京都',
        birthplace: '東京都',
        phone: '090-1234-5678',
        email: 'tanaka@example.com',
        currentStage: 'エントリー',
        experience: 'プログラミング',
        otherCompanyStatus: '応募中',
        appearance: '面接予定',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      })
    })
  })
})
