import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search,
  SortAsc,
  SortDesc,
  Edit,
  ExternalLink
} from 'lucide-react';
import { useTaskManagement } from '../hooks/useTaskManagement';
import { useApplicants } from '@/features/applicants/hooks/useApplicants';
import { TaskStatus, TaskInstance, FixedTask } from '../types/task';
import { Applicant } from '@/features/applicants/types/applicant';
import { formatDate } from '@/shared/utils/date';

type FilterStatus = 'all' | 'pending' | 'in-progress' | 'completed' | 'overdue' | 'upcoming';
type SortBy = 'dueDate' | 'applicant' | 'stage' | 'status';
type SortOrder = 'asc' | 'desc';

interface FilterOptions {
  status: FilterStatus;
  source: string;
  stage: string;
  dueDateFrom: string;
  dueDateTo: string;
  assignedTo: string;
}

export function TaskListPage() {
  const { getDaysUntilDue, getDueStatus, getApplicantTasksByStage } = useTaskManagement();
  const { applicants } = useApplicants();
  
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: 'all',
    source: 'all',
    stage: 'all',
    dueDateFrom: '',
    dueDateTo: '',
    assignedTo: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
    switch (filterOptions.status) {
      case 'pending':
        filtered = filtered.filter(({ task }) => task.status === '未着手');
        break;
      case 'in-progress':
        filtered = filtered.filter(({ task }) => task.status === '返信待ち');
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

    // 反響元フィルター
    if (filterOptions.source !== 'all') {
      filtered = filtered.filter(({ applicant }) => applicant.source === filterOptions.source);
    }

    // 選考段階フィルター
    if (filterOptions.stage !== 'all') {
      filtered = filtered.filter(({ applicant }) => applicant.currentStage === filterOptions.stage);
    }

    // 期日範囲フィルター
    if (filterOptions.dueDateFrom) {
      const fromDate = new Date(filterOptions.dueDateFrom);
      filtered = filtered.filter(({ task }) => task.dueDate && task.dueDate >= fromDate);
    }

    if (filterOptions.dueDateTo) {
      const toDate = new Date(filterOptions.dueDateTo);
      toDate.setHours(23, 59, 59, 999); // その日の終わりまで
      filtered = filtered.filter(({ task }) => task.dueDate && task.dueDate <= toDate);
    }

    // 担当者フィルター
    if (filterOptions.assignedTo) {
      filtered = filtered.filter(({ task }) => task.assignedTo === filterOptions.assignedTo);
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
  }, [allTasks, filterOptions, searchQuery, sortBy, sortOrder]);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case '完了':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case '返信待ち':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case '提出待ち':
        return <Clock className="h-4 w-4 text-orange-600" />;
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
      case '返信待ち':
        return 'bg-yellow-100 text-yellow-800';
      case '提出待ち':
        return 'bg-orange-100 text-orange-800';
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
          <div className="space-y-4">
            {/* 基本フィルター */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">ステータス</label>
                <Select 
                  value={filterOptions.status} 
                  onValueChange={(value: FilterStatus) => setFilterOptions(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全タスク</SelectItem>
                    <SelectItem value="pending">未着手</SelectItem>
                    <SelectItem value="in-progress">返信待ち</SelectItem>
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

            {/* 詳細フィルター */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">詳細フィルター</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  {showAdvancedFilters ? '詳細フィルターを閉じる' : '詳細フィルターを開く'}
                </Button>
              </div>

              {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">反響元</label>
                    <Select 
                      value={filterOptions.source} 
                      onValueChange={(value) => setFilterOptions(prev => ({ ...prev, source: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="反響元を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        <SelectItem value="マイナビ">マイナビ</SelectItem>
                        <SelectItem value="学情">学情</SelectItem>
                        <SelectItem value="オファーボックス">オファーボックス</SelectItem>
                        <SelectItem value="その他">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">選考段階</label>
                    <Select 
                      value={filterOptions.stage} 
                      onValueChange={(value) => setFilterOptions(prev => ({ ...prev, stage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選考段階を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        <SelectItem value="エントリー">エントリー</SelectItem>
                        <SelectItem value="書類選考">書類選考</SelectItem>
                        <SelectItem value="会社説明会">会社説明会</SelectItem>
                        <SelectItem value="適性検査体験">適性検査体験</SelectItem>
                        <SelectItem value="職場見学">職場見学</SelectItem>
                        <SelectItem value="仕事体験">仕事体験</SelectItem>
                        <SelectItem value="人事面接">人事面接</SelectItem>
                        <SelectItem value="集団面接">集団面接</SelectItem>
                        <SelectItem value="最終選考">最終選考</SelectItem>
                        <SelectItem value="CEOセミナー">CEOセミナー</SelectItem>
                        <SelectItem value="内定面談">内定面談</SelectItem>
                        <SelectItem value="不採用">不採用</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">担当者</label>
                    <Input
                      placeholder="担当者名を入力"
                      value={filterOptions.assignedTo}
                      onChange={(e) => setFilterOptions(prev => ({ ...prev, assignedTo: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">期日（開始）</label>
                    <Input
                      type="date"
                      value={filterOptions.dueDateFrom}
                      onChange={(e) => setFilterOptions(prev => ({ ...prev, dueDateFrom: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">期日（終了）</label>
                    <Input
                      type="date"
                      value={filterOptions.dueDateTo}
                      onChange={(e) => setFilterOptions(prev => ({ ...prev, dueDateTo: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => setFilterOptions({
                        status: 'all',
                        source: 'all',
                        stage: 'all',
                        dueDateFrom: '',
                        dueDateTo: '',
                        assignedTo: ''
                      })}
                      className="w-full"
                    >
                      フィルターをリセット
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* タスク一覧テーブル */}
      <Card>
        <CardContent className="p-0">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">該当するタスクがありません</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ステータス</TableHead>
                    <TableHead>タスク名</TableHead>
                    <TableHead>応募者名</TableHead>
                    <TableHead>選考段階</TableHead>
                    <TableHead>期日</TableHead>
                    <TableHead>メモ</TableHead>
                    <TableHead>反響元</TableHead>
                    <TableHead>電話番号</TableHead>
                    <TableHead>メールアドレス</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedTasks.map(({ applicant, task, daysUntilDue, dueStatus }) => (
                    <TableRow key={task.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(task.status)}
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground">{task.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{applicant.name}</div>
                          <div className="text-sm text-muted-foreground">{applicant.nameKana}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge>{applicant.currentStage}</Badge>
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? (
                          <div>
                            <div className="text-sm">{formatDate(task.dueDate)}</div>
                            {dueStatus && dueStatus !== 'normal' && (
                              <Badge className={getDueStatusColor(dueStatus)}>
                                {getDueStatusText(dueStatus, daysUntilDue)}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">未設定</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {task.notes || <span className="text-muted-foreground">なし</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{applicant.source}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{applicant.phone || <span className="text-muted-foreground">未設定</span>}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{applicant.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // タスク編集機能（実装予定）
                              // console.log('Edit task:', task.id);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/applicants/${applicant.id}`, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 