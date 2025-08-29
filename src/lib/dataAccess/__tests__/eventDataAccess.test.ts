import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EventDataAccess } from '../eventDataAccess'
import { supabase } from '@/lib/supabase'

// Supabaseのモック
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('EventDataAccess', () => {
  const mockSupabase = vi.mocked(supabase)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllEvents', () => {
    it('should return transformed events', async () => {
      const mockData = [
        {
          id: '1',
          name: '会社説明会',
          description: '会社の概要を説明します',
          stage: '会社説明会',
          venue: 'オンライン',
          max_participants: 50,
          status: 'active',
          sort_order: 1,
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

      const result = await EventDataAccess.getAllEvents()

      expect(mockSupabase.from).toHaveBeenCalledWith('events')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: '1',
        name: '会社説明会',
        description: '会社の概要を説明します',
        stage: '会社説明会',
        venue: 'オンライン',
        maxParticipants: 50,
        status: 'active',
        sortOrder: 1,
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

      await expect(EventDataAccess.getAllEvents()).rejects.toThrow('Database error')
    })
  })

  describe('getEventById', () => {
    it('should return transformed event', async () => {
      const mockData = {
        id: '1',
        name: '会社説明会',
        description: '会社の概要を説明します',
        stage: '会社説明会',
        venue: 'オンライン',
        max_participants: 50,
        status: 'active',
        sort_order: 1,
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

      const result = await EventDataAccess.getEventById('1')

      expect(mockSupabase.from).toHaveBeenCalledWith('events')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(result).toEqual({
        id: '1',
        name: '会社説明会',
        description: '会社の概要を説明します',
        stage: '会社説明会',
        venue: 'オンライン',
        maxParticipants: 50,
        status: 'active',
        sortOrder: 1,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      })
    })

    it('should return null when event not found', async () => {
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

      const result = await EventDataAccess.getEventById('999')

      expect(result).toBeNull()
    })
  })

  describe('getAllEventSessions', () => {
    it('should return transformed event sessions', async () => {
      const mockData = [
        {
          id: '1',
          event_id: '1',
          name: '第1回セッション',
          start_time: '2024-01-01T10:00:00Z',
          end_time: '2024-01-01T12:00:00Z',
          venue: 'オンライン',
          format: 'オンライン',
          max_participants: null,
          zoom_url: 'https://zoom.us/j/123456789',
          notes: 'Zoomで実施',
          recruiter: null,
          status: '',
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

      const result = await EventDataAccess.getAllEventSessions()

      expect(mockSupabase.from).toHaveBeenCalledWith('event_sessions')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: '1',
        eventId: '1',
        name: '第1回セッション',
        sessionDate: new Date('2024-01-01T10:00:00Z'),
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T12:00:00Z',
        venue: 'オンライン',
        format: 'オンライン',
        maxParticipants: 0,
        zoomUrl: 'https://zoom.us/j/123456789',
        notes: 'Zoomで実施',
        recruiter: undefined,
        status: '',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      })
    })
  })

  describe('getSessionParticipants', () => {
    it('should return transformed participants', async () => {
      const mockData = [
        {
          id: '1',
          session_id: '1',
          applicant_id: '1',
          status: '参加予定',
          result: null,
          notes: '参加予定',
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

      const result = await EventDataAccess.getSessionParticipants('1')

      expect(mockSupabase.from).toHaveBeenCalledWith('event_participants')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: '1',
        sessionId: '1',
        applicantId: '1',
        status: '参加予定',
        result: null,
        notes: '参加予定',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      })
    })
  })

  describe('createEvent', () => {
    it('should create and return transformed event', async () => {
      const mockData = {
        id: '1',
        name: '会社説明会',
        description: '会社の概要を説明します',
        stage: '会社説明会',
        venue: 'オンライン',
        max_participants: 50,
        status: 'active',
        sort_order: 1,
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

      const eventData = {
        name: '会社説明会',
        description: '会社の概要を説明します',
        stage: '会社説明会',
        venue: 'オンライン',
        maxParticipants: 50,
        status: 'active' as any,
        sortOrder: 1,
      }

      const result = await EventDataAccess.createEvent(eventData)

      expect(mockSupabase.from).toHaveBeenCalledWith('events')
      expect(mockInsert).toHaveBeenCalledWith([{
        name: '会社説明会',
        description: '会社の概要を説明します',
        stage: '会社説明会',
        venue: 'オンライン',
        max_participants: 50,
        status: 'active',
        sort_order: 1,
      }])
      expect(result).toEqual({
        id: '1',
        name: '会社説明会',
        description: '会社の概要を説明します',
        stage: '会社説明会',
        venue: 'オンライン',
        maxParticipants: 50,
        status: 'active',
        sortOrder: 1,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      })
    })
  })

  describe('updateParticipantStatus', () => {
    it('should update participant status successfully', async () => {
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      })

      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
      } as any)

      await EventDataAccess.updateParticipantStatus('1', '参加')

      expect(mockSupabase.from).toHaveBeenCalledWith('event_participants')
      expect(mockUpdate).toHaveBeenCalledWith({
        status: '参加',
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

      await expect(EventDataAccess.updateParticipantStatus('1', '参加')).rejects.toThrow('Update failed')
    })
  })
})
