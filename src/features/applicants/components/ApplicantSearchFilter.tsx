import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { SELECTION_STAGES } from '@/shared/utils/constants';
import { SelectionStage } from '../types/applicant';

interface ApplicantSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStage: SelectionStage | 'all';
  onStageChange: (stage: SelectionStage | 'all') => void;
  getStageCount: (stage: SelectionStage) => number;
}

export function ApplicantSearchFilter({ 
  searchTerm, 
  onSearchChange, 
  selectedStage, 
  onStageChange,
  getStageCount 
}: ApplicantSearchFilterProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="応募者名または学校名で検索..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedStage === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onStageChange('all')}
          className="flex items-center space-x-1"
        >
          <Filter className="h-3 w-3" />
          <span>全て</span>
        </Button>
        
        {SELECTION_STAGES.map((stage) => {
          const count = getStageCount(stage);
          return (
            <Button
              key={stage}
              variant={selectedStage === stage ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStageChange(stage)}
              className="flex items-center space-x-1"
            >
              <span>{stage}</span>
              <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                {count}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}