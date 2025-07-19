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
import { CalendarIcon, UserCheck, Users, Clock, CheckCircle, MessageSquare, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface StageHRInterviewProps {
  applicantId: string;
  onComplete?: (data: any) => void;
  onNext?: () => void;
}

export function StageHRInterview({ applicantId, onComplete, onNext }: StageHRInterviewProps) {
  const [interviewDate, setInterviewDate] = useState<Date>();
  const [interviewType, setInterviewType] = useState('');
  const [location, setLocation] = useState('');
  const [interviewers, setInterviewers] = useState('');
  const [duration, setDuration] = useState('');
  const [impression, setImpression] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [result, setResult] = useState('');
  const [hasCompleted, setHasCompleted] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);

  const handleComplete = () => {
    const data = {
      interviewDate,
      interviewType,
      location,
      interviewers,
      duration,
      impression,
      evaluation,
      result,
      completed: hasCompleted,
      passed: hasPassed
    };
    onComplete?.(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            人事面接
          </CardTitle>
          <Badge variant="secondary">必須</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="interviewDate">面接日</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {interviewDate ? format(interviewDate, 'PPP', { locale: ja }) : '日付を選択'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={interviewDate}
                  onSelect={setInterviewDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewType">面接種別</Label>
            <Select value={interviewType} onValueChange={setInterviewType}>
              <SelectTrigger>
                <SelectValue placeholder="種別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">一次面接</SelectItem>
                <SelectItem value="second">二次面接</SelectItem>
                <SelectItem value="final">最終面接</SelectItem>
                <SelectItem value="online">オンライン面接</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">面接場所</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="例：本社ビル3階会議室、Zoom"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="interviewers">面接官</Label>
            <Input
              id="interviewers"
              value={interviewers}
              onChange={(e) => setInterviewers(e.target.value)}
              placeholder="例：人事部 田中、人事部長 佐藤"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">面接時間</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="例：60分、90分"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="impression">面接官の印象</Label>
          <Textarea
            id="impression"
            value={impression}
            onChange={(e) => setImpression(e.target.value)}
            placeholder="面接官から見た応募者の印象を入力してください"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="evaluation">評価・コメント</Label>
          <Textarea
            id="evaluation"
            value={evaluation}
            onChange={(e) => setEvaluation(e.target.value)}
            placeholder="面接での評価やコメントを入力してください"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="result">面接結果</Label>
          <Select value={result} onValueChange={setResult}>
            <SelectTrigger>
              <SelectValue placeholder="結果を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pass">合格</SelectItem>
              <SelectItem value="fail">不合格</SelectItem>
              <SelectItem value="pending">判定中</SelectItem>
              <SelectItem value="reconsider">再考</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>面接状況</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={hasCompleted}
                onCheckedChange={(checked: boolean) => setHasCompleted(checked)}
              />
              <Label htmlFor="completed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                面接完了
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="passed"
                checked={hasPassed}
                onCheckedChange={(checked: boolean) => setHasPassed(checked)}
              />
              <Label htmlFor="passed" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                合格判定
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