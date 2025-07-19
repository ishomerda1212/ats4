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
import { CalendarIcon, Building2, Users, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface StageCompanyInfoProps {
  applicantId: string;
  onComplete?: (data: any) => void;
  onNext?: () => void;
}

export function StageCompanyInfo({ applicantId, onComplete, onNext }: StageCompanyInfoProps) {
  const [eventDate, setEventDate] = useState<Date>();
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');
  const [attendees, setAttendees] = useState('');
  const [impression, setImpression] = useState('');
  const [hasAttended, setHasAttended] = useState(false);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);

  const handleComplete = () => {
    const data = {
      eventDate,
      eventType,
      location,
      attendees,
      impression,
      attendance: hasAttended,
      feedbackSubmitted: hasSubmittedFeedback
    };
    onComplete?.(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            会社説明会
          </CardTitle>
          <Badge variant="secondary">必須</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="eventDate">開催日</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventDate ? format(eventDate, 'PPP', { locale: ja }) : '日付を選択'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventType">説明会種別</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue placeholder="種別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">オンライン</SelectItem>
                <SelectItem value="offline">対面</SelectItem>
                <SelectItem value="hybrid">ハイブリッド</SelectItem>
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
            placeholder="例：本社ビル3階会議室、Zoom"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attendees">参加者</Label>
          <Input
            id="attendees"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            placeholder="例：人事部 田中、技術部 佐藤"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="impression">印象・感想</Label>
          <Textarea
            id="impression"
            value={impression}
            onChange={(e) => setImpression(e.target.value)}
            placeholder="会社説明会での印象や感想を入力してください"
            rows={4}
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
                説明会に参加
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="feedback"
                checked={hasSubmittedFeedback}
                onCheckedChange={(checked: boolean) => setHasSubmittedFeedback(checked)}
              />
              <Label htmlFor="feedback" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
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