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
import { CalendarIcon, Users, UserCheck, Clock, CheckCircle, Star, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface StageGroupInterviewProps {
  applicantId: string;
  onComplete?: (data: any) => void;
  onNext?: () => void;
}

export function StageGroupInterview({ applicantId, onComplete, onNext }: StageGroupInterviewProps) {
  const [interviewDate, setInterviewDate] = useState<Date>();
  const [interviewType, setInterviewType] = useState('');
  const [location, setLocation] = useState('');
  const [interviewers, setInterviewers] = useState('');
  const [participants, setParticipants] = useState('');
  const [duration, setDuration] = useState('');
  const [topic, setTopic] = useState('');
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
      participants,
      duration,
      topic,
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
            <Users className="h-5 w-5" />
            グループ面接
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
                <SelectItem value="group_discussion">グループディスカッション</SelectItem>
                <SelectItem value="group_interview">グループ面接</SelectItem>
                <SelectItem value="presentation">プレゼンテーション</SelectItem>
                <SelectItem value="case_study">ケーススタディ</SelectItem>
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
              placeholder="例：人事部 田中、技術部 佐藤"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants">参加者数</Label>
            <Input
              id="participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="例：5名、3-4名"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">面接時間</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="例：90分、2時間"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">テーマ・課題</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例：働き方改革、新商品企画"
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
            placeholder="グループ面接での評価やコメントを入力してください"
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