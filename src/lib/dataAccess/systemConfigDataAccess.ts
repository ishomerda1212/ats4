// システム設定データアクセス層

import { supabase } from '@/lib/supabase';
import type {
  SelectionStageDefinition,
  CreateSelectionStageInput,
  UpdateSelectionStageInput,
  FixedTaskDefinition,
  CreateFixedTaskInput,
  UpdateFixedTaskInput,
  StageStatusDefinition,
  CreateStageStatusInput,
  UpdateStageStatusInput,
  SystemConfigSummary
} from '@/features/system-config/types';

export class SystemConfigDataAccess {
  // ======== 選考段階関連 ========

  /**
   * 全ての選考段階定義を取得
   */
  static async getAllSelectionStages(): Promise<SelectionStageDefinition[]> {
    const { data, error } = await supabase
      .from('selection_stage_definitions')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch selection stage definitions:', error);
      throw error;
    }

    return data.map(this.transformStageFromDB);
  }

  /**
   * アクティブな選考段階定義を取得
   */
  static async getActiveSelectionStages(): Promise<SelectionStageDefinition[]> {
    const { data, error } = await supabase
      .from('selection_stage_definitions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch active selection stage definitions:', error);
      throw error;
    }

    return data.map(this.transformStageFromDB);
  }

  /**
   * 選考段階定義を作成
   */
  static async createSelectionStage(input: CreateSelectionStageInput): Promise<SelectionStageDefinition> {
    const dbData = this.transformStageToDBInsert(input);

    const { data, error } = await supabase
      .from('selection_stage_definitions')
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error('Failed to create selection stage definition:', error);
      throw error;
    }

    return this.transformStageFromDB(data);
  }

  /**
   * 選考段階定義を更新
   */
  static async updateSelectionStage(id: string, input: UpdateSelectionStageInput): Promise<void> {
    const dbData = this.transformStageToDBUpdate(input);

    const { error } = await supabase
      .from('selection_stage_definitions')
      .update(dbData)
      .eq('id', id);

    if (error) {
      console.error('Failed to update selection stage definition:', error);
      throw error;
    }
  }

  /**
   * 選考段階定義を削除
   */
  static async deleteSelectionStage(id: string): Promise<void> {
    const { error } = await supabase
      .from('selection_stage_definitions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete selection stage definition:', error);
      throw error;
    }
  }

  /**
   * 選考段階の順序を一括更新
   */
  static async updateStageOrder(stageOrders: { id: string; sortOrder: number }[]): Promise<void> {
    const updates = stageOrders.map(({ id, sortOrder }) => ({
      id,
      sort_order: sortOrder,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('selection_stage_definitions')
      .upsert(updates);

    if (error) {
      console.error('Failed to update stage order:', error);
      throw error;
    }
  }

  // ======== 固定タスク関連 ========

  /**
   * 特定段階の固定タスクを取得
   */
  static async getFixedTasksForStage(stageId: string): Promise<FixedTaskDefinition[]> {
    const { data, error } = await supabase
      .from('fixed_task_definitions')
      .select('*')
      .eq('stage_id', stageId)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch fixed task definitions:', error);
      throw error;
    }

    return data.map(this.transformTaskFromDB);
  }

  /**
   * 固定タスクを作成
   */
  static async createFixedTask(input: CreateFixedTaskInput): Promise<FixedTaskDefinition> {
    const dbData = this.transformTaskToDBInsert(input);

    const { data, error } = await supabase
      .from('fixed_task_definitions')
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error('Failed to create fixed task definition:', error);
      throw error;
    }

    return this.transformTaskFromDB(data);
  }

  /**
   * 固定タスクを更新
   */
  static async updateFixedTask(id: string, input: UpdateFixedTaskInput): Promise<void> {
    const dbData = this.transformTaskToDBUpdate(input);

    const { error } = await supabase
      .from('fixed_task_definitions')
      .update(dbData)
      .eq('id', id);

    if (error) {
      console.error('Failed to update fixed task definition:', error);
      throw error;
    }
  }

  /**
   * 固定タスクを削除
   */
  static async deleteFixedTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('fixed_task_definitions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete fixed task definition:', error);
      throw error;
    }
  }

  /**
   * タスクの順序を更新
   */
  static async updateTaskOrder(taskOrders: { id: string; sortOrder: number }[]): Promise<void> {
    const updates = taskOrders.map(({ id, sortOrder }) => ({
      id,
      sort_order: sortOrder,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('fixed_task_definitions')
      .upsert(updates);

    if (error) {
      console.error('Failed to update task order:', error);
      throw error;
    }
  }

  // ======== ステータス定義関連 ========

  /**
   * 特定段階のステータス定義を取得
   */
  static async getStatusesForStage(stageId: string): Promise<StageStatusDefinition[]> {
    const { data, error } = await supabase
      .from('stage_status_definitions')
      .select('*')
      .eq('stage_id', stageId)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch stage status definitions:', error);
      throw error;
    }

    return data.map(this.transformStatusFromDB);
  }

  /**
   * ステータス定義を作成
   */
  static async createStageStatus(input: CreateStageStatusInput): Promise<StageStatusDefinition> {
    const dbData = this.transformStatusToDBInsert(input);

    const { data, error } = await supabase
      .from('stage_status_definitions')
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error('Failed to create stage status definition:', error);
      throw error;
    }

    return this.transformStatusFromDB(data);
  }

  /**
   * ステータス定義を更新
   */
  static async updateStageStatus(id: string, input: UpdateStageStatusInput): Promise<void> {
    const dbData = this.transformStatusToDBUpdate(input);

    const { error } = await supabase
      .from('stage_status_definitions')
      .update(dbData)
      .eq('id', id);

    if (error) {
      console.error('Failed to update stage status definition:', error);
      throw error;
    }
  }

  /**
   * ステータス定義を削除
   */
  static async deleteStageStatus(id: string): Promise<void> {
    const { error } = await supabase
      .from('stage_status_definitions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete stage status definition:', error);
      throw error;
    }
  }

  /**
   * ステータスの順序を更新
   */
  static async updateStatusOrder(statusOrders: { id: string; sortOrder: number }[]): Promise<void> {
    const updates = statusOrders.map(({ id, sortOrder }) => ({
      id,
      sort_order: sortOrder,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('stage_status_definitions')
      .upsert(updates);

    if (error) {
      console.error('Failed to update status order:', error);
      throw error;
    }
  }

  // ======== システム情報関連 ========

  /**
   * システム設定のサマリーを取得
   */
  static async getSystemConfigSummary(): Promise<SystemConfigSummary> {
    const [stagesResult, tasksResult, statusesResult] = await Promise.all([
      supabase.from('selection_stage_definitions').select('id, is_active', { count: 'exact' }),
      supabase.from('fixed_task_definitions').select('id', { count: 'exact' }),
      supabase.from('stage_status_definitions').select('id', { count: 'exact' })
    ]);

    const totalStages = stagesResult.count || 0;
    const activeStages = stagesResult.data?.filter(s => s.is_active).length || 0;
    const totalTasks = tasksResult.count || 0;
    const totalStatuses = statusesResult.count || 0;

    // 最新の更新日時を取得
    const { data: lastUpdatedData } = await supabase
      .from('selection_stage_definitions')
      .select('updated_at')
      .order('updated_at', { ascending: false })
      .limit(1);

    const lastUpdated = lastUpdatedData?.[0]?.updated_at ? new Date(lastUpdatedData[0].updated_at) : new Date();

    return {
      totalStages,
      activeStages,
      totalTasks,
      totalStatuses,
      lastUpdated
    };
  }

  // ======== プライベートヘルパーメソッド ========

  private static transformStageFromDB(data: any): SelectionStageDefinition {
    return {
      id: data.id,
      name: data.name,
      displayName: data.display_name,
      description: data.description,
      stageGroup: data.stage_group,
      sortOrder: data.sort_order,
      isActive: data.is_active,
      colorScheme: data.color_scheme,
      icon: data.icon,
      estimatedDurationMinutes: data.estimated_duration_minutes,
      requiresSession: data.requires_session,
      sessionTypes: data.session_types || [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private static transformStageToDBInsert(input: CreateSelectionStageInput): any {
    return {
      name: input.name,
      display_name: input.displayName,
      description: input.description,
      stage_group: input.stageGroup,
      sort_order: input.sortOrder,
      is_active: input.isActive ?? true,
      color_scheme: input.colorScheme ?? 'blue',
      icon: input.icon,
      estimated_duration_minutes: input.estimatedDurationMinutes ?? 60,
      requires_session: input.requiresSession ?? false,
      session_types: input.sessionTypes ?? []
    };
  }

  private static transformStageToDBUpdate(input: UpdateSelectionStageInput): any {
    const updates: any = {};
    if (input.name !== undefined) updates.name = input.name;
    if (input.displayName !== undefined) updates.display_name = input.displayName;
    if (input.description !== undefined) updates.description = input.description;
    if (input.stageGroup !== undefined) updates.stage_group = input.stageGroup;
    if (input.sortOrder !== undefined) updates.sort_order = input.sortOrder;
    if (input.isActive !== undefined) updates.is_active = input.isActive;
    if (input.colorScheme !== undefined) updates.color_scheme = input.colorScheme;
    if (input.icon !== undefined) updates.icon = input.icon;
    if (input.estimatedDurationMinutes !== undefined) updates.estimated_duration_minutes = input.estimatedDurationMinutes;
    if (input.requiresSession !== undefined) updates.requires_session = input.requiresSession;
    if (input.sessionTypes !== undefined) updates.session_types = input.sessionTypes;
    return updates;
  }

  private static transformTaskFromDB(data: any): FixedTaskDefinition {
    return {
      id: data.id,
      stageId: data.stage_id,
      name: data.name,
      displayName: data.display_name,
      description: data.description,
      taskType: data.task_type,
      sortOrder: data.sort_order,
      isRequired: data.is_required,
      isActive: data.is_active,
      dueOffsetDays: data.due_offset_days,
      emailTemplateId: data.email_template_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private static transformTaskToDBInsert(input: CreateFixedTaskInput): any {
    return {
      stage_id: input.stageId,
      name: input.name,
      display_name: input.displayName,
      description: input.description,
      task_type: input.taskType,
      sort_order: input.sortOrder,
      is_required: input.isRequired ?? true,
      is_active: input.isActive ?? true,
      due_offset_days: input.dueOffsetDays,
      email_template_id: input.emailTemplateId
    };
  }

  private static transformTaskToDBUpdate(input: UpdateFixedTaskInput): any {
    const updates: any = {};
    if (input.name !== undefined) updates.name = input.name;
    if (input.displayName !== undefined) updates.display_name = input.displayName;
    if (input.description !== undefined) updates.description = input.description;
    if (input.taskType !== undefined) updates.task_type = input.taskType;
    if (input.sortOrder !== undefined) updates.sort_order = input.sortOrder;
    if (input.isRequired !== undefined) updates.is_required = input.isRequired;
    if (input.isActive !== undefined) updates.is_active = input.isActive;
    if (input.dueOffsetDays !== undefined) updates.due_offset_days = input.dueOffsetDays;
    if (input.emailTemplateId !== undefined) updates.email_template_id = input.emailTemplateId;
    return updates;
  }

  private static transformStatusFromDB(data: any): StageStatusDefinition {
    return {
      id: data.id,
      stageId: data.stage_id,
      statusValue: data.status_value,
      displayName: data.display_name,
      statusCategory: data.status_category,
      colorScheme: data.color_scheme,
      sortOrder: data.sort_order,
      isActive: data.is_active,
      isFinal: data.is_final,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private static transformStatusToDBInsert(input: CreateStageStatusInput): any {
    return {
      stage_id: input.stageId,
      status_value: input.statusValue,
      display_name: input.displayName,
      status_category: input.statusCategory,
      color_scheme: input.colorScheme ?? 'gray',
      sort_order: input.sortOrder,
      is_active: input.isActive ?? true,
      is_final: input.isFinal ?? false
    };
  }

  private static transformStatusToDBUpdate(input: UpdateStageStatusInput): any {
    const updates: any = {};
    if (input.statusValue !== undefined) updates.status_value = input.statusValue;
    if (input.displayName !== undefined) updates.display_name = input.displayName;
    if (input.statusCategory !== undefined) updates.status_category = input.statusCategory;
    if (input.colorScheme !== undefined) updates.color_scheme = input.colorScheme;
    if (input.sortOrder !== undefined) updates.sort_order = input.sortOrder;
    if (input.isActive !== undefined) updates.is_active = input.isActive;
    if (input.isFinal !== undefined) updates.is_final = input.isFinal;
    return updates;
  }
}