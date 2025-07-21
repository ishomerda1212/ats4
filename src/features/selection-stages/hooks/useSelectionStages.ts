import { SelectionStageTemplate, DefaultTask, SelectionStageProgress } from '../types/selectionStage';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { generateId } from '@/shared/utils/date';
import { toast } from '@/hooks/use-toast';

// デフォルトの選考段階テンプレート
const defaultStageTemplates: SelectionStageTemplate[] = [
  {
    id: generateId(),
    name: 'エントリー',
    description: '応募書類の受付と基本要件の確認',
    order: 1,
    isActive: true,
    defaultTasks: [
      {
        id: generateId(),
        title: 'エントリーシート確認',
        description: '提出されたエントリーシートの内容確認',
        type: 'document',
        priority: '高',
        dueOffsetDays: 1,
        isRequired: true
      },
      {
        id: generateId(),
        title: '基本要件チェック',
        description: '学歴、専攻、卒業予定年度の確認',
        type: 'general',
        priority: '高',
        dueOffsetDays: 1,
        isRequired: true
      }
    ],
    emailTemplates: [],
    estimatedDuration: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: generateId(),
    name: '会社説明会',
    description: '会社概要と事業内容の説明',
    order: 2,
    isActive: true,
    defaultTasks: [
      {
        id: generateId(),
        title: '参加者名簿作成',
        description: '説明会参加者の名簿作成',
        type: 'document',
        priority: '中',
        dueOffsetDays: 2,
        isRequired: true
      },
      {
        id: generateId(),
        title: '参加確認メール送信',
        description: '説明会の詳細と参加確認のメール送信',
        type: 'email',
        priority: '高',
        dueOffsetDays: 1,
        isRequired: true
      }
    ],
    emailTemplates: [],
    estimatedDuration: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function useSelectionStages() {
  const [stageTemplates, setStageTemplates] = useLocalStorage<SelectionStageTemplate[]>('stageTemplates', defaultStageTemplates);
  const [stageProgress, setStageProgress] = useLocalStorage<SelectionStageProgress>('stageProgress', []);

  const addStageTemplate = (template: Omit<SelectionStageTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: SelectionStageTemplate = {
      ...template,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStageTemplates(current => [...current, newTemplate].sort((a, b) => a.order - b.order));
    
    toast({
      title: "選考段階を追加しました",
      description: `${template.name}が正常に追加されました。`,
    });
    
    return newTemplate;
  };

  const updateStageTemplate = (id: string, updates: Partial<SelectionStageTemplate>) => {
    setStageTemplates(current =>
      current.map(template =>
        template.id === id
          ? { ...template, ...updates, updatedAt: new Date().toISOString() }
          : template
      ).sort((a, b) => a.order - b.order)
    );
    
    toast({
      title: "選考段階を更新しました",
      description: "選考段階が正常に更新されました。",
    });
  };

  const deleteStageTemplate = (id: string) => {
    setStageTemplates(current => current.filter(template => template.id !== id));
    
    toast({
      title: "選考段階を削除しました",
      description: "選考段階が正常に削除されました。",
    });
  };

  const addDefaultTask = (stageId: string, task: Omit<DefaultTask, 'id'>) => {
    const newTask: DefaultTask = {
      ...task,
      id: generateId(),
    };
    
    updateStageTemplate(stageId, {
      defaultTasks: [...(stageTemplates.find(s => s.id === stageId)?.defaultTasks || []), newTask]
    });
    
    return newTask;
  };

  const updateDefaultTask = (stageId: string, taskId: string, updates: Partial<DefaultTask>) => {
    const stage = stageTemplates.find(s => s.id === stageId);
    if (!stage) return;
    
    const updatedTasks = stage.defaultTasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    updateStageTemplate(stageId, { defaultTasks: updatedTasks });
  };

  const deleteDefaultTask = (stageId: string, taskId: string) => {
    const stage = stageTemplates.find(s => s.id === stageId);
    if (!stage) return;
    
    const updatedTasks = stage.defaultTasks.filter(task => task.id !== taskId);
    updateStageTemplate(stageId, { defaultTasks: updatedTasks });
  };

  const createTasksFromTemplate = (applicantId: string, stageTemplateId: string, selectionHistoryId: string) => {
    const template = stageTemplates.find(t => t.id === stageTemplateId);
    if (!template) return [];

    return template.defaultTasks.map(defaultTask => ({
      id: generateId(),
      selectionHistoryId,
      title: defaultTask.title,
      description: defaultTask.description,
      type: defaultTask.type,
      status: '未着手' as const,
      priority: defaultTask.priority,
      assignee: defaultTask.assignee,
      dueDate: defaultTask.dueOffsetDays 
        ? new Date(Date.now() + defaultTask.dueOffsetDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      emailTemplateId: defaultTask.emailTemplateId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  };

  const getActiveStageTemplates = () => {
    return stageTemplates.filter(template => template.isActive).sort((a, b) => a.order - b.order);
  };

  const getStageProgress = (applicantId: string) => {
    return stageProgress.filter(progress => progress.applicantId === applicantId);
  };

  const updateStageProgress = (id: string, updates: Partial<SelectionStageProgress>) => {
    setStageProgress(current =>
      current.map(progress =>
        progress.id === id
          ? { ...progress, ...updates, updatedAt: new Date().toISOString() }
          : progress
      )
    );
  };

  const addStageProgress = (progress: Omit<SelectionStageProgress, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProgress: SelectionStageProgress = {
      ...progress,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStageProgress(current => [...current, newProgress]);
    return newProgress;
  };

  return {
    stageTemplates,
    stageProgress,
    loading,
    addStageTemplate,
    updateStageTemplate,
    deleteStageTemplate,
    addDefaultTask,
    updateDefaultTask,
    deleteDefaultTask,
    createTasksFromTemplate,
    getActiveStageTemplates,
    getStageProgress,
    updateStageProgress,
    addStageProgress,
  };
}