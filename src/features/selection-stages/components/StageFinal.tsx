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
import { CalendarIcon, Trophy, Users, Clock, CheckCircle, Star, Award } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface StageFinalProps {
  applicantId: string;
  onComplete?: (data: any) => void;
  onNext?: () => void;
}

export function StageFinal({ applicantId, onComplete, onNext }: StageFinalProps) {
  const [interviewDate, setInterviewDate] = useState<Date>();
  const [interviewType, setInterviewType] = useState('');
  const [location, setLocation] = useState('');
  const [interviewers, setInterviewers] = useState('');
  const [duration, setDuration] = useState('');
  const [impression, setImpression] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [result, setResult] = useState('');
  const [salary, setSalary] = useState('');
  const [position, setPosition] = useState('');
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
      salary: salary ? parseInt(salary) : null,
      position,
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
            <Trophy className="h-5 w-5" />
            最終選考
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
                <SelectItem value="final_ceo">社長面接</SelectItem>
                <SelectItem value="final_director">取締役面接</SelectItem>
                <SelectItem value="final_hr">人事最終面接</SelectItem>
                <SelectItem value="final_technical">技術最終面接</SelectItem>
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
            placeholder="例：本社ビル会議室、Zoom"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="interviewers">面接官</Label>
            <Input
              id="interviewers"
              value={interviewers}
              onChange={(e) => setInterviewers(e.target.value)}
              placeholder="例：代表取締役 田中、人事部長 佐藤"
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
            placeholder="最終面接での印象を入力してください"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="evaluation">最終評価・コメント</Label>
          <Textarea
            id="evaluation"
            value={evaluation}
            onChange={(e) => setEvaluation(e.target.value)}
            placeholder="最終選考での評価やコメントを入力してください"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salary">想定年収（万円）</Label>
            <Input
              id="salary"
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="例：400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">想定ポジション</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="例：エンジニア、営業職"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="result">最終結果</Label>
          <Select value={result} onValueChange={setResult}>
            <SelectTrigger>
              <SelectValue placeholder="結果を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pass">内定</SelectItem>
              <SelectItem value="fail">不採用</SelectItem>
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
                <Award className="h-4 w-4" />
                内定判定
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