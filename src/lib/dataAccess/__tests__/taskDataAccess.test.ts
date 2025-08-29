import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TaskDataAccess } from '../taskDataAccess'
import { supabase } from '@/lib/supabase'
import { Applicant } from '@/features/applicants/types/applicant'

// Supabaseのモック
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('TaskDataAccess', () => {
  const mockSupabase = vi.mocked(supabase)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllTaskInstances', () => {
    it('should return transformed task instances', async () => {
      const mockData = [
        {
          id: '1',
          applicant_id: '1',
          task_id: '1',
          status: '未着手',
          due_date: '2024-12-31T23:59:59Z',
          completed_at: null,
          notes: 'テストタスク',
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

      const result = await TaskDataAccess.getAllTaskInstances()

      expect(mockSupabase.from).toHaveBeenCalledWith('task_instances')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: '1',
        applicantId: '1',
        taskId: '1',
        status: '未着手',
        dueDate: new Date('2024-12-31T23:59:59Z'),
        completedAt: null,
        notes: 'テストタスク',
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

      await expect(TaskDataAccess.getAllTaskInstances()).rejects.toThrow('Database error')
    })
  })

  describe('getApplicantTasksByStage', () => {
    it('should return tasks with fixed task data', async () => {
      const mockFixedTasks = [
        {
          id: '1',
          title: '書類提出',
          description: '履歴書と職務経歴書を提出してください',
          stage: '書類選考',
          type: 'document',
          order_num: 1,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ]

      const mockTaskInstances = [
        {
          id: '1',
          applicant_id: '1',
          task_id: '1',
          status: '未着手',
          due_date: '2024-12-31T23:59:59Z',
          completed_at: null,
          notes: 'テストタスク',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ]

      // 最初の呼び出し（getFixedTasksByStage）
      const mockFixedTasksSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockFixedTasks,
            error: null,
          }),
        }),
      })

      // 2番目の呼び出し（getTaskInstancesByApplicant）
      const mockTaskInstancesSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({
            data: mockTaskInstances,
            error: null,
          }),
        }),
      })

      mockSupabase.from
        .mockReturnValueOnce({
          select: mockFixedTasksSelect,
        } as any)
        .mockReturnValueOnce({
          select: mockTaskInstancesSelect,
        } as any)

      const applicant: Applicant = {
        id: '1',
        source: 'マイナビ',
        name: '田中太郎',
        nameKana: 'タナカタロウ',
        gender: '男性',
        schoolName: '東京大学',
        faculty: '工学部',
        department: '情報工学科',
        graduationYear: 2025,
        currentAddress: '東京都',
        birthplace: '東京都',
        phone: '090-1234-5678',
        email: 'tanaka@example.com',
        currentStage: '書類選考',
        experience: 'プログラミング',
        otherCompanyStatus: '応募中',
        appearance: '面接予定',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      }

      const result = await TaskDataAccess.getApplicantTasksByStage(applicant, '書類選考')

      expect(mockSupabase.from).toHaveBeenCalledWith('fixed_tasks')
      expect(mockSupabase.from).toHaveBeenCalledWith('task_instances')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: '1',
        applicantId: '1',
        taskId: '1',
        status: '未着手',
        dueDate: new Date('2024-12-31T23:59:59Z'),
        completedAt: null,
        notes: 'テストタスク',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        title: '書類提出',
        description: '履歴書と職務経歴書を提出してください',
        stage: '書類選考',
        type: 'document',
        orderNum: 1,
      })
    })
  })

  describe('updateTaskStatus', () => {
    it('should update task status successfully', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      })

      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
      } as any)

      await TaskDataAccess.updateTaskStatus('1', '完了')

      expect(mockSupabase.from).toHaveBeenCalledWith('task_instances')
      expect(mockUpdate).toHaveBeenCalledWith({
        status: '完了',
        updated_at: expect.any(String),
      })
    })

    it('should throw error when update fails', async () => {
      const mockError = new Error('Update failed')
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: mockError,
        }),
      })

      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
      } as any)

      await expect(TaskDataAccess.updateTaskStatus('1', '完了')).rejects.toThrow('Update failed')
    })
  })

  describe('setTaskDueDate', () => {
    it('should set task due date successfully', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      })

      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
      } as any)

      const dueDate = new Date('2024-12-31T23:59:59Z')
      await TaskDataAccess.setTaskDueDate('1', dueDate)

      expect(mockSupabase.from).toHaveBeenCalledWith('task_instances')
      expect(mockUpdate).toHaveBeenCalledWith({
        due_date: '2024-12-31T23:59:59.000Z',
        updated_at: expect.any(String),
      })
    })
  })
})
