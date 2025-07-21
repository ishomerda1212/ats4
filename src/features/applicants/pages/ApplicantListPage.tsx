import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Grid, List, Plus } from 'lucide-react';
import { ApplicantSearchFilter } from '../components/ApplicantSearchFilter';
import { ApplicantCard } from '../components/ApplicantCard';
import { ApplicantTable } from '../components/ApplicantTable';
import { useApplicants } from '../hooks/useApplicants';

export function ApplicantListPage() {
  const {
    applicants,
    loading,
    searchTerm,
    setSearchTerm,
    selectedStage,
    setSelectedStage,
    getStageCount
  } = useApplicants();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">応募者管理</h1>
          <p className="text-muted-foreground mt-1">採用応募者の情報を管理します</p>
        </div>
        
        <Link to="/applicants/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新規登録
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>検索・絞り込み</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicantSearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedStage={selectedStage}
            onStageChange={setSelectedStage}
            getStageCount={getStageCount}
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {applicants.length}件の応募者
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">読み込み中...</p>
        </div>
      ) : applicants.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">条件に一致する応募者が見つかりませんでした。</p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((applicant) => (
            <ApplicantCard key={applicant.id} applicant={applicant} />
          ))}
        </div>
      ) : (
        <ApplicantTable applicants={applicants} />
      )}
    </div>
  );
}