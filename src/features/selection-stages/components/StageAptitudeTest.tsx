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
import { CalendarIcon, Brain, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface StageAptitudeTestProps {
  applicantId: string;
  onComplete?: (data: any) => void;
  onNext?: () => void;
}

export function StageAptitudeTest({ applicantId, onComplete, onNext }: StageAptitudeTestProps) {
  const [testDate, setTestDate] = useState<Date>();
  const [testType, setTestType] = useState('');
  const [testProvider, setTestProvider] = useState('');
  const [score, setScore] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [result, setResult] = useState('');
  const [notes, setNotes] = useState('');
  const [hasCompleted, setHasCompleted] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);

  const handleComplete = () => {
    const data = {
      testDate,
      testType,
      testProvider,
      score: score ? parseInt(score) : null,
      maxScore: maxScore ? parseInt(maxScore) : null,
      result,
      notes,
      completed: hasCompleted,
      passed: hasPassed
    };
    onComplete?.(data);
  };

  const getScorePercentage = () => {
    if (!score || !maxScore) return null;
    return Math.round((parseInt(score) / parseInt(maxScore)) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            適性検査
          </CardTitle>
          <Badge variant="secondary">必須</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="testDate">検査日</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {testDate ? format(testDate, 'PPP', { locale: ja }) : '日付を選択'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={testDate}
                  onSelect={setTestDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testType">検査種別</Label>
            <Select value={testType} onValueChange={setTestType}>
              <SelectTrigger>
                <SelectValue placeholder="種別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spi">SPI</SelectItem>
                <SelectItem value="web_cab">Web-CAB</SelectItem>
                <SelectItem value="tg_web">TG-Web</SelectItem>
                <SelectItem value="cubic">CUBIC</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="testProvider">検査提供会社</Label>
          <Input
            id="testProvider"
            value={testProvider}
            onChange={(e) => setTestProvider(e.target.value)}
            placeholder="例：リクルート、日本エス・エイチ・エル"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="score">得点</Label>
            <Input
              id="score"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="例：85"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxScore">満点</Label>
            <Input
              id="maxScore"
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              placeholder="例：100"
            />
          </div>

          <div className="space-y-2">
            <Label>得点率</Label>
            <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
              {getScorePercentage() ? `${getScorePercentage()}%` : '-'}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="result">結果</Label>
          <Select value={result} onValueChange={setResult}>
            <SelectTrigger>
              <SelectValue placeholder="結果を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pass">合格</SelectItem>
              <SelectItem value="fail">不合格</SelectItem>
              <SelectItem value="pending">判定中</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">備考</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="検査に関する特記事項があれば入力してください"
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label>検査状況</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={hasCompleted}
                onCheckedChange={(checked: boolean) => setHasCompleted(checked)}
              />
              <Label htmlFor="completed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                検査完了
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="passed"
                checked={hasPassed}
                onCheckedChange={(checked: boolean) => setHasPassed(checked)}
              />
              <Label htmlFor="passed" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
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