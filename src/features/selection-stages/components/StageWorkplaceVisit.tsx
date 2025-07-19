import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Building, MapPin, Users, Clock, CheckCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface StageWorkplaceVisitProps {
  applicantId: string;
  onComplete?: (data: any) => void;
  onNext?: () => void;
}

export function StageWorkplaceVisit({ applicantId, onComplete, onNext }: StageWorkplaceVisitProps) {
  const [visitDate, setVisitDate] = useState<Date>();
  const [visitType, setVisitType] = useState('');
  const [location, setLocation] = useState('');
  const [guide, setGuide] = useState('');
  const [duration, setDuration] = useState('');
  const [impression, setImpression] = useState('');
  const [questions, setQuestions] = useState('');
  const [hasVisited, setHasVisited] = useState(false);
  const [hasSubmittedReport, setHasSubmittedReport] = useState(false);

  const handleComplete = () => {
    const data = {
      visitDate,
      visitType,
      location,
      guide,
      duration,
      impression,
      questions,
      visited: hasVisited,
      reportSubmitted: hasSubmittedReport
    };
    onComplete?.(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            職場見学
          </CardTitle>
          <Badge variant="outline">任意</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="visitDate">見学日</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {visitDate ? format(visitDate, 'PPP', { locale: ja }) : '日付を選択'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={visitDate}
                  onSelect={setVisitDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visitType">見学種別</Label>
            <Select value={visitType} onValueChange={setVisitType}>
              <SelectTrigger>
                <SelectValue placeholder="種別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">オフィス見学</SelectItem>
                <SelectItem value="factory">工場見学</SelectItem>
                <SelectItem value="lab">研究所見学</SelectItem>
                <SelectItem value="virtual">オンライン見学</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">見学場所</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="例：本社ビル、○○工場、Zoom"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guide">案内者</Label>
            <Input
              id="guide"
              value={guide}
              onChange={(e) => setGuide(e.target.value)}
              placeholder="例：人事部 田中、技術部 佐藤"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">見学時間</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="例：2時間、半日"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="impression">印象・感想</Label>
          <Textarea
            id="impression"
            value={impression}
            onChange={(e) => setImpression(e.target.value)}
            placeholder="職場見学での印象や感想を入力してください"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="questions">質問・疑問点</Label>
          <Textarea
            id="questions"
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="見学中に感じた質問や疑問点があれば入力してください"
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label>見学状況</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="visited"
                checked={hasVisited}
                onCheckedChange={(checked: boolean) => setHasVisited(checked)}
              />
              <Label htmlFor="visited" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                見学実施
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="report"
                checked={hasSubmittedReport}
                onCheckedChange={(checked: boolean) => setHasSubmittedReport(checked)}
              />
              <Label htmlFor="report" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                見学レポート提出済み
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