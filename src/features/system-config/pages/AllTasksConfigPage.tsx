// 全段階タスク管理ページ

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Filter, Plus, Edit, ExternalLink, Mail, FileText, CheckSquare, Users, Star } from 'lucide-react';
import { useIntegratedTaskConfig } from '../hooks/useIntegratedTaskConfig';
import { useIntegratedStageConfig } from '../hooks/useIntegratedStageConfig';
import type { IntegratedTaskDefinition, TaskType } from '@/lib/dataAccess/integratedTaskDataAccess';

const TASK_TYPE_ICONS: Record<TaskType, React.ComponentType<any>> = {
  email: Mail,
  document: FileText, 
  general: CheckSquare,
  interview: Users,
  evaluation: Star
};

const TASK_TYPE_LABELS: Record<TaskType, string> = {
  email: 'メール',
  document: '書類',
  general: '一般',
  interview: '面接',
  evaluation: '評価'
};

const TASK_TYPE_COLORS: Record<TaskType, string> = {
  email: 'bg-blue-100 text-blue-800',
  document: 'bg-green-100 text-green-800',
  general: 'bg-gray-100 text-gray-800',
  interview: 'bg-purple-100 text-purple-800',
  evaluation: 'bg-yellow-100 text-yellow-800'
};

export const AllTasksConfigPage = () => {
  const navigate = useNavigate();
  
  const { stages } = useIntegratedStageConfig();
  const { 
    tasks, 
    loading, 
    error 
  } = useIntegratedTaskConfig(); // stageIdを指定しない = 全タスク取得

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('all');

  // フィルタリングされたタスク一覧
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'all' || task.stageId === selectedStage;
    const matchesType = selectedTaskType === 'all' || task.taskType === selectedTaskType;
    
    return matchesSearch && matchesStage && matchesType;
  });

  // 統計データ
  const stats = {
    total: tasks.length,
    active: tasks.filter(t => t.isActive).length,
    byType: Object.entries(TASK_TYPE_LABELS).reduce((acc, [type]) => {
      acc[type as TaskType] = tasks.filter(t => t.taskType === type).length;
      return acc;
    }, {} as Record<TaskType, number>),
    byStage: stages.reduce((acc, stage) => {
      acc[stage.id] = tasks.filter(t => t.stageId === stage.id).length;
      return acc;
    }, {} as Record<string, number>)
  };

  const renderTaskItem = (task: IntegratedTaskDefinition) => {
    const stage = stages.find(s => s.id === task.stageId);
    const IconComponent = TASK_TYPE_ICONS[task.taskType] || CheckSquare;
    const taskColor = TASK_TYPE_COLORS[task.taskType] || 'bg-gray-100 text-gray-800';
    
    return (
      <Card key={task.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <IconComponent className="h-5 w-5 text-gray-600" />
                <Badge className={taskColor}>
                  {TASK_TYPE_LABELS[task.taskType]}
                </Badge>
                <Badge variant="outline" className={`bg-${stage?.colorScheme}-100 text-${stage?.colorScheme}-800`}>
                  {stage?.displayName || task.stageName}
                </Badge>
              </div>
              
              <h3 className="font-medium text-lg mb-1">{task.displayName}</h3>
              {task.description && (
                <p className="text-gray-600 text-sm mb-2">{task.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>順序: {task.sortOrder}</span>
                {task.dueOffsetDays && <span>期限: {task.dueOffsetDays}日後</span>}
                {task.isRequired && <span className="text-blue-600">必須</span>}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={task.isActive ? 'default' : 'secondary'} className="text-xs">
                {task.isActive ? 'アクティブ' : '無効'}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/system-config/stages/${task.stageId}/tasks`)}
              >
                <ExternalLink className="h-4 w-4" />
                編集
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">エラーが発生しました</h2>
          <p className="text-red-700">{error}</p>
          <Button 
            onClick={() => navigate('/system-config')} 
            className="mt-4"
          >
            システム設定に戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/system-config')}>
              <ArrowLeft className="h-4 w-4" />
              システム設定に戻る
            </Button>
            <div>
              <h1 className="text-2xl font-bold">タスク管理（全段階）</h1>
              <p className="text-gray-600">全段階のタスクを統合管理</p>
            </div>
          </div>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">総タスク数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">アクティブ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">メールタスク</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.byType.email}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">段階数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stages.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* フィルタリング */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            フィルタリング・検索
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">キーワード検索</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="タスク名・説明で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">段階で絞り込み</label>
              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての段階</SelectItem>
                  {stages.map(stage => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.displayName} ({stats.byStage[stage.id] || 0}件)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">タスクタイプで絞り込み</label>
              <Select value={selectedTaskType} onValueChange={setSelectedTaskType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべてのタイプ</SelectItem>
                  {Object.entries(TASK_TYPE_LABELS).map(([type, label]) => (
                    <SelectItem key={type} value={type}>
                      {label} ({stats.byType[type as TaskType]}件)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* タスク一覧 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              タスク一覧
              {(searchTerm || selectedStage !== 'all' || selectedTaskType !== 'all') && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  （{filteredTasks.length}件を表示）
                </span>
              )}
            </CardTitle>
            <div className="flex gap-2">
              {(searchTerm || selectedStage !== 'all' || selectedTaskType !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStage('all');
                    setSelectedTaskType('all');
                  }}
                >
                  フィルタクリア
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredTasks.map(renderTaskItem)}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              {searchTerm || selectedStage !== 'all' || selectedTaskType !== 'all' ? (
                <>
                  <p className="text-lg font-medium">条件に一致するタスクが見つかりません</p>
                  <p className="text-sm">フィルタ条件を変更してください</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium">タスクがありません</p>
                  <p className="text-sm">各段階でタスクを設定してください</p>
                  <Button onClick={() => navigate('/system-config/stages')} className="mt-4">
                    段階管理に移動
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};