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
import { CalendarIcon, Crown, Users, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface StageCEOSeminarProps {
  applicantId: string;
  onComplete?: (data: any) => void;
  onNext?: () => void;
}

export function StageCEOSeminar({ applicantId, onComplete, onNext }: StageCEOSeminarProps) {
  const [seminarDate, setSeminarDate] = useState<Date>();
  const [seminarType, setSeminarType] = useState('');
  const [location, setLocation] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [duration, setDuration] = useState('');
  const [topic, setTopic] = useState('');
  const [impression, setImpression] = useState('');
  const [questions, setQuestions] = useState('');
  const [hasAttended, setHasAttended] = useState(false);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);

  const handleComplete = () => {
    const data = {
      seminarDate,
      seminarType,
      location,
      speaker,
      duration,
      topic,
      impression,
      questions,
      attended: hasAttended,
      feedbackSubmitted: hasSubmittedFeedback
    };
    onComplete?.(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            社長セミナー
          </CardTitle>
          <Badge variant="outline">任意</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="seminarDate">開催日</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {seminarDate ? format(seminarDate, 'PPP', { locale: ja }) : '日付を選択'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={seminarDate}
                  onSelect={setSeminarDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seminarType">セミナー種別</Label>
            <Select value={seminarType} onValueChange={setSeminarType}>
              <SelectTrigger>
                <SelectValue placeholder="種別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ceo_speech">社長講演</SelectItem>
                <SelectItem value="company_vision">企業ビジョン</SelectItem>
                <SelectItem value="career_talk">キャリアトーク</SelectItem>
                <SelectItem value="q&a">質疑応答</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">開催場所</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="例：本社ビル大ホール、Zoom"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="speaker">講演者</Label>
            <Input
              id="speaker"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              placeholder="例：代表取締役 田中、社長 佐藤"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">開催時間</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="例：2時間、90分"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic">講演テーマ</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例：企業の未来ビジョン、働き方改革"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="impression">印象・感想</Label>
          <Textarea
            id="impression"
            value={impression}
            onChange={(e) => setImpression(e.target.value)}
            placeholder="セミナーでの印象や感想を入力してください"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="questions">質問・疑問点</Label>
          <Textarea
            id="questions"
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="セミナー中に感じた質問や疑問点があれば入力してください"
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label>参加状況</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="attended"
                checked={hasAttended}
                onCheckedChange={(checked: boolean) => setHasAttended(checked)}
              />
              <Label htmlFor="attended" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                セミナー参加
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="feedback"
                checked={hasSubmittedFeedback}
                onCheckedChange={(checked: boolean) => setHasSubmittedFeedback(checked)}
              />
              <Label htmlFor="feedback" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                フィードバック提出済み
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