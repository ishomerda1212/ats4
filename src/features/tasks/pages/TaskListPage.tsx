import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Search,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useTaskManagement } from '../hooks/useTaskManagement';
import { useApplicants } from '@/features/applicants/hooks/useApplicants';
import { TaskStatus, TaskInstance, FixedTask } from '../types/task';
import { Applicant } from '@/features/applicants/types/applicant';
import { formatDate } from '@/shared/utils/date';

type FilterStatus = 'all' | 'pending' | 'in-progress' | 'completed' | 'overdue' | 'upcoming';
type SortBy = 'dueDate' | 'applicant' | 'stage' | 'status';
type SortOrder = 'asc' | 'desc';

export function TaskListPage() {
  const { getDaysUntilDue, getDueStatus, getApplicantTasksByStage } = useTaskManagement();
  const { applicants } = useApplicants();
  
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // 全タスクを取得
  const allTasks = useMemo(() => {
    const tasks: Array<{
      applicant: Applicant;
      task: FixedTask & TaskInstance;
      daysUntilDue?: number;
      dueStatus?: string;
    }> = [];

    // すべての選考段階のタスクを取得
    const allStages = ['エントリー', '書類選考', '会社説明会', '適性検査', '職場見学', '仕事体験', '個別面接', '集団面接', 'CEOセミナー', '人事面接', '最終選考', '内定', '不採用'];

    applicants.forEach(applicant => {
      allStages.forEach(stage => {
        const stageTasks = getApplicantTasksByStage(applicant, stage);
        stageTasks.forEach(task => {
          const daysUntilDue = task.dueDate ? getDaysUntilDue(task.dueDate) : undefined;
          const dueStatus = task.dueDate ? getDueStatus(task.dueDate, task.status) : undefined;
          
          tasks.push({
            applicant,
            task,
            daysUntilDue,
            dueStatus
          });
        });
      });
    });

    return tasks;
  }, [applicants, getApplicantTasksByStage, getDaysUntilDue, getDueStatus]);

  // フィルタリングとソート
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = allTasks;

    // ステータスフィルター
    switch (filterStatus) {
      case 'pending':
        filtered = filtered.filter(({ task }) => task.status === '未着手');
        break;
      case 'in-progress':
        filtered = filtered.filter(({ task }) => task.status === '進行中');
        break;
      case 'completed':
        filtered = filtered.filter(({ task }) => task.status === '完了');
        break;
      case 'overdue':
        filtered = filtered.filter(({ dueStatus }) => dueStatus === 'overdue');
        break;
      case 'upcoming':
        filtered = filtered.filter(({ dueStatus }) => dueStatus === 'urgent' || dueStatus === 'upcoming');
        break;
    }

    // 検索フィルター
    if (searchQuery) {
      filtered = filtered.filter(({ applicant, task }) => 
        applicant.name.includes(searchQuery) ||
        task.title.includes(searchQuery) ||
        task.description.includes(searchQuery)
      );
    }

    // ソート
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'dueDate': {
          const aDate = a.task.dueDate || new Date(9999, 11, 31);
          const bDate = b.task.dueDate || new Date(9999, 11, 31);
          comparison = aDate.getTime() - bDate.getTime();
          break;
        }
        case 'applicant':
          comparison = a.applicant.name.localeCompare(b.applicant.name);
          break;
        case 'stage':
          comparison = a.applicant.currentStage.localeCompare(b.applicant.currentStage);
          break;
        case 'status':
          comparison = a.task.status.localeCompare(b.task.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [allTasks, filterStatus, searchQuery, sortBy, sortOrder]);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case '完了':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case '進行中':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case '未着手':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case '完了':
        return 'bg-green-100 text-green-800';
      case '進行中':
        return 'bg-yellow-100 text-yellow-800';
      case '未着手':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueStatusColor = (dueStatus?: string) => {
    switch (dueStatus) {
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'urgent':
        return 'bg-orange-100 text-orange-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueStatusText = (dueStatus?: string, daysUntilDue?: number) => {
    if (!dueStatus || !daysUntilDue) return '';
    
    switch (dueStatus) {
      case 'overdue':
        return `期限切れ (${Math.abs(daysUntilDue)}日前)`;
      case 'urgent':
        return `緊急 (あと${daysUntilDue}日)`;
      case 'upcoming':
        return `期限間近 (あと${daysUntilDue}日)`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">タスク一覧</h1>
          <p className="text-muted-foreground mt-1">
            全応募者のタスク進捗を管理します
          </p>
        </div>
      </div>

      {/* フィルター・ソート */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">ステータス</label>
              <Select value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全タスク</SelectItem>
                  <SelectItem value="pending">未着手</SelectItem>
                  <SelectItem value="in-progress">進行中</SelectItem>
                  <SelectItem value="completed">完了</SelectItem>
                  <SelectItem value="overdue">期限切れ</SelectItem>
                  <SelectItem value="upcoming">期限間近</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">ソート</label>
              <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">期限順</SelectItem>
                  <SelectItem value="applicant">応募者順</SelectItem>
                  <SelectItem value="stage">段階順</SelectItem>
                  <SelectItem value="status">ステータス順</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">並び順</label>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                {sortOrder === 'asc' ? '昇順' : '降順'}
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">検索</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="応募者名・タスク名で検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* タスク一覧 */}
      <div className="space-y-4">
        {filteredAndSortedTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">該当するタスクがありません</p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedTasks.map(({ applicant, task, daysUntilDue, dueStatus }) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(task.status)}
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm font-medium">{applicant.name}</span>
                                                 <Badge className="bg-gray-100 text-gray-800 border">{applicant.currentStage}</Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        {task.contactStatus && (
                          <Badge className="bg-purple-100 text-purple-800">
                            {task.contactStatus}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {task.dueDate && (
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(task.dueDate)}</span>
                        </div>
                        {dueStatus && dueStatus !== 'normal' && (
                          <Badge className={getDueStatusColor(dueStatus)}>
                            {getDueStatusText(dueStatus, daysUntilDue)}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {task.assignedTo && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">担当者</p>
                        <p className="text-sm font-medium">{task.assignedTo}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 