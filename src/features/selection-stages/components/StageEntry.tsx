import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileText, Mail, UserCheck, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface StageEntryProps {
  applicantId: string;
  onComplete?: (data: any) => void;
  onNext?: () => void;
}

export function StageEntry({ applicantId, onComplete, onNext }: StageEntryProps) {
  const [entryDate, setEntryDate] = useState<Date>();
  const [source, setSource] = useState('');
  const [motivation, setMotivation] = useState('');
  const [hasResume, setHasResume] = useState(false);
  const [hasCoverLetter, setHasCoverLetter] = useState(false);

  const handleComplete = () => {
    const data = {
      entryDate,
      source,
      motivation,
      documents: {
        resume: hasResume,
        coverLetter: hasCoverLetter
      }
    };
    onComplete?.(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            エントリー段階
          </CardTitle>
          <Badge variant="secondary">必須</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="entryDate">エントリー日</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {entryDate ? format(entryDate, 'PPP', { locale: ja }) : '日付を選択'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={entryDate}
                  onSelect={setEntryDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">応募経路</Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="例：リクナビ、マイナビ、直接応募"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="motivation">志望動機</Label>
          <Textarea
            id="motivation"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            placeholder="志望動機を入力してください"
            rows={4}
          />
        </div>

        <div className="space-y-3">
          <Label>提出書類</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="resume"
                checked={hasResume}
                onCheckedChange={(checked) => setHasResume(checked as boolean)}
              />
              <Label htmlFor="resume" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                履歴書
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="coverLetter"
                checked={hasCoverLetter}
                onCheckedChange={(checked) => setHasCoverLetter(checked as boolean)}
              />
              <Label htmlFor="coverLetter" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                職務経歴書
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onNext}>
            次の段階へ
          </Button>
          <Button onClick={handleComplete}>
            完了
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 