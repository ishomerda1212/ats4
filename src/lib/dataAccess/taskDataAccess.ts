import { supabase } from '@/lib/supabase';
import { TaskInstance, FixedTask, TaskStatus } from '@/features/tasks/types/task';
import { Applicant } from '@/features/applicants/types/applicant';

// データベースから取得した生データの型
interface RawTaskInstance {
  id: string;
  applicant_id: string;
  task_id: string;
  status: string;
  due_date: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface RawFixedTask {
  id: string;
  stage: string;
  title: string;
  description: string | null;
  type: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

// データ変換関数
const transformTaskInstance = (raw: RawTaskInstance): TaskInstance => ({
  id: raw.id,
  applicantId: raw.applicant_id,
  taskId: raw.task_id,
  status: raw.status as TaskStatus,
  dueDate: raw.due_date ? new Date(raw.due_date) : undefined,
  completedAt: raw.completed_at ? new Date(raw.completed_at) : null,
  notes: raw.notes || '',
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.updated_at),
});

const transformFixedTask = (raw: RawFixedTask): FixedTask => ({
  id: raw.id,
  stage: raw.stage,
  title: raw.title,
  description: raw.description || '',
  type: raw.type,
  order: raw.order_num,
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.updated_at),
});

export class TaskDataAccess {
  /**
   * 全てのタスクインスタンスを取得
   */
  static async getAllTaskInstances(): Promise<TaskInstance[]> {
    try {
      const { data, error } = await supabase
        .from('task_instances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch task instances:', error);
        throw error;
      }

      return (data as RawTaskInstance[]).map(transformTaskInstance);
    } catch (error) {
      console.error('Error in getAllTaskInstances:', error);
      throw error;
    }
  }

  /**
   * 応募者のタスクインスタンスを取得
   */
  static async getTaskInstancesByApplicant(applicantId: string): Promise<TaskInstance[]> {
    try {
      const { data, error } = await supabase
        .from('task_instances')
        .select('*')
        .eq('applicant_id', applicantId);

      if (error) {
        console.error('Failed to fetch task instances for applicant:', error);
        throw error;
      }

      return (data as RawTaskInstance[]).map(transformTaskInstance);
    } catch (error) {
      console.error('Error in getTaskInstancesByApplicant:', error);
      throw error;
    }
  }

  /**
   * 特定段階の固定タスクを取得
   */
  static async getFixedTasksByStage(stage: string): Promise<FixedTask[]> {
    try {
      const { data, error } = await supabase
        .from('fixed_tasks')
        .select('*')
        .eq('stage', stage)
        .order('order_num', { ascending: true });

      if (error) {
        console.error('Failed to fetch fixed tasks for stage:', error);
        throw error;
      }

      return (data as RawFixedTask[]).map(transformFixedTask);
    } catch (error) {
      console.error('Error in getFixedTasksByStage:', error);
      throw error;
    }
  }

  /**
   * 応募者の特定段階のタスクを取得（FixedTask + TaskInstance）
   */
  static async getApplicantTasksByStage(
    applicant: Applicant, 
    stage: string
  ): Promise<(FixedTask & TaskInstance)[]> {
    try {
      // 並行してデータを取得
      const [taskInstances, fixedTasks] = await Promise.all([
        this.getTaskInstancesByApplicant(applicant.id),
        this.getFixedTasksByStage(stage)
      ]);

      // タスクインスタンスをマップ化
      const instanceMap = new Map(
        taskInstances.map(instance => [instance.taskId, instance])
      );

      // FixedTaskとTaskInstanceを組み合わせ
      return fixedTasks.map(fixedTask => {
        const instance = instanceMap.get(fixedTask.id);
        
        if (instance) {
          return { ...fixedTask, ...instance };
        } else {
          // 新しいタスクインスタンスを作成（データベースには保存しない）
          const newInstance: TaskInstance = {
            id: `temp-${Date.now()}-${Math.random()}`,
            applicantId: applicant.id,
            taskId: fixedTask.id,
            status: '未着手',
            dueDate: undefined,
            notes: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // 特定のタスクタイプに応じて初期ステータスを設定
          if (['日程調整連絡', 'リマインド'].includes(fixedTask.type)) {
            newInstance.status = '返信待ち';
          } else if (fixedTask.type === '提出書類') {
            newInstance.status = '提出待ち';
          }

          return { ...fixedTask, ...newInstance };
        }
      }).sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Error in getApplicantTasksByStage:', error);
      throw error;
    }
  }

  /**
   * タスクステータスを更新
   */
  static async updateTaskStatus(taskInstanceId: string, status: TaskStatus): Promise<void> {
    try {
      const { error } = await supabase
        .from('task_instances')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskInstanceId);

      if (error) {
        console.error('Failed to update task status:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateTaskStatus:', error);
      throw error;
    }
  }

  /**
   * タスクの期限を設定
   */
  static async setTaskDueDate(taskInstanceId: string, dueDate: Date): Promise<void> {
    try {
      const { error } = await supabase
        .from('task_instances')
        .update({
          due_date: dueDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', taskInstanceId);

      if (error) {
        console.error('Failed to set task due date:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in setTaskDueDate:', error);
      throw error;
    }
  }

  /**
   * タスクのメモを更新
   */
  static async updateTaskNotes(taskInstanceId: string, notes: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('task_instances')
        .update({
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskInstanceId);

      if (error) {
        console.error('Failed to update task notes:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateTaskNotes:', error);
      throw error;
    }
  }
}
