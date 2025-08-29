import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Phone, School, User, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Applicant } from '../types/applicant';
import { StatusBadge } from '@/shared/components/common/StatusBadge';
import { formatDate } from '@/shared/utils/date';
import { TaskStatus } from '@/features/tasks/types/task';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// 次のタスク用の拡張されたTaskInstance型
interface ExtendedTaskInstance {
  id: string;
  applicantId: string;
  taskId: string;
  status: TaskStatus;
  dueDate?: Date;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  type: string;
}

interface ApplicantCardProps {
  applicant: Applicant;
}

export function ApplicantCard({ applicant }: ApplicantCardProps) {
  const [nextTask, setNextTask] = useState<ExtendedTaskInstance | null>(null);
  const [, setLoading] = useState(false);

  // 次のタスクを取得する関数
  const fetchNextTask = async () => {
    try {
      setLoading(true);
      
      // 応募者の現在の選考段階を取得
      const { data: applicantData } = await supabase
        .from('applicants')
        .select('current_stage')
        .eq('id', applicant.id)
        .single();

      if (!applicantData?.current_stage) {
        setNextTask(null);
        return;
      }

      // 現在の選考段階のステータスを確認
      const { data: currentStageHistory } = await supabase
        .from('selection_histories')
        .select('status')
        .eq('applicant_id', applicant.id)
        .eq('stage', applicantData.current_stage)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // 現在の選考段階が「完了」の場合は次のタスクを表示しない
      if (currentStageHistory?.status === '完了') {
        setNextTask(null);
        return;
      }

      // 現在の選考段階のfixed_tasksを取得
      const { data: fixedTasks } = await supabase
        .from('fixed_tasks')
        .select('id')
        .eq('stage', applicantData.current_stage)
        .order('order_num', { ascending: true });

      if (!fixedTasks || fixedTasks.length === 0) {
        setNextTask(null);
        return;
      }

      // 現在の選考段階のタスクインスタンスを取得（完了していないもの）
      const fixedTaskIds = fixedTasks.map(task => task.id);
      const { data: tasks } = await supabase
        .from('task_instances')
        .select(`
          *,
          fixed_tasks (
            title,
            description,
            type
          )
        `)
        .eq('applicant_id', applicant.id)
        .in('task_id', fixedTaskIds)
        .neq('status', '完了')
        .order('created_at', { ascending: true });

      if (tasks && tasks.length > 0) {
        // 最初の未完了タスクを次のタスクとして設定
        const nextTaskData = tasks[0];
        const nextTaskObj = {
          id: nextTaskData.id,
          applicantId: nextTaskData.applicant_id,
          taskId: nextTaskData.task_id,
          status: nextTaskData.status,
          dueDate: nextTaskData.due_date ? new Date(nextTaskData.due_date) : undefined,
          completedAt: nextTaskData.completed_at ? new Date(nextTaskData.completed_at) : undefined,
          notes: nextTaskData.notes,
          createdAt: new Date(nextTaskData.created_at),
          updatedAt: new Date(nextTaskData.updated_at),
          title: nextTaskData.fixed_tasks?.title || '',
          description: nextTaskData.fixed_tasks?.description || '',
          type: nextTaskData.fixed_tasks?.type || 'general'
        };
        
        setNextTask(nextTaskObj);
      } else {
        setNextTask(null);
      }
    } catch (error) {
      console.error('Failed to fetch next task:', error);
      setNextTask(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextTask();
  }, [applicant.id]);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case '完了':
        return 'bg-green-100 text-green-800';
      case '未着手':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">{applicant.name}</h3>
              <Badge className="bg-green-100 text-green-800 text-xs">{applicant.source}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{applicant.nameKana}</p>
          </div>
          <StatusBadge stage={applicant.currentStage} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <School className="h-4 w-4 text-muted-foreground" />
            <span>{applicant.schoolName}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{applicant.faculty} {applicant.department}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{applicant.email}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{applicant.phone}</span>
          </div>
        </div>
        
        {/* 次のタスク表示 */}
        {nextTask && (
          <div className="border-t pt-3">
            <div className="flex items-center space-x-2 mb-2">
              <CheckSquare className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">次のタスク</span>
            </div>
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-sm text-blue-900">{nextTask.title}</h5>
                <Badge className={`text-xs ${getStatusColor(nextTask.status)}`}>
                  {nextTask.status}
                </Badge>
              </div>
              <p className="text-xs text-blue-700 mb-2">{nextTask.description}</p>
              {nextTask.dueDate && (
                <p className="text-xs text-blue-600">
                  期限: {formatDate(nextTask.dueDate)}
                </p>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>更新: {formatDate(applicant.updatedAt)}</span>
          </div>
          
          <Link to={`/applicants/${applicant.id}`}>
            <Button variant="outline" size="sm">
              詳細を見る
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}