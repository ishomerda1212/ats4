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
import { CalendarIcon, Handshake, Users, Clock, CheckCircle, Star, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';

interface StageOfferProps {
  applicantId: string;
  onComplete?: (data: any) => void;
  onNext?: () => void;
}

export function StageOffer({ applicantId, onComplete, onNext }: StageOfferProps) {
  const [offerDate, setOfferDate] = useState<Date>();
  const [offerType, setOfferType] = useState('');
  const [salary, setSalary] = useState('');
  const [position, setPosition] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [response, setResponse] = useState('');
  const [hasOffered, setHasOffered] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  const handleComplete = () => {
    const data = {
      offerDate,
      offerType,
      salary: salary ? parseInt(salary) : null,
      position,
      startDate,
      location,
      notes,
      response,
      offered: hasOffered,
      accepted: hasAccepted
    };
    onComplete?.(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Handshake className="h-5 w-5" />
            内定
          </CardTitle>
          <Badge variant="default">最終段階</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="offerDate">内定日</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {offerDate ? format(offerDate, 'PPP', { locale: ja }) : '日付を選択'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={offerDate}
                  onSelect={setOfferDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="offerType">内定種別</Label>
            <Select value={offerType} onValueChange={setOfferType}>
              <SelectTrigger>
                <SelectValue placeholder="種別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">正社員</SelectItem>
                <SelectItem value="contract">契約社員</SelectItem>
                <SelectItem value="part_time">パートタイム</SelectItem>
                <SelectItem value="intern">インターン</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salary">年収（万円）</Label>
            <Input
              id="salary"
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="例：400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">ポジション</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="例：エンジニア、営業職"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">入社予定日</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP', { locale: ja }) : '日付を選択'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">勤務地</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="例：東京本社、大阪支社"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">内定内容・特記事項</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="内定内容や特記事項があれば入力してください"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="response">応募者の反応</Label>
          <Select value={response} onValueChange={setResponse}>
            <SelectTrigger>
              <SelectValue placeholder="反応を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accept">内定承諾</SelectItem>
              <SelectItem value="decline">内定辞退</SelectItem>
              <SelectItem value="considering">検討中</SelectItem>
              <SelectItem value="negotiating">条件交渉中</SelectItem>
              <SelectItem value="pending">未回答</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>内定状況</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="offered"
                checked={hasOffered}
                onCheckedChange={(checked: boolean) => setHasOffered(checked)}
              />
              <Label htmlFor="offered" className="flex items-center gap-2">
                <Handshake className="h-4 w-4" />
                内定通知済み
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="accepted"
                checked={hasAccepted}
                onCheckedChange={(checked: boolean) => setHasAccepted(checked)}
              />
              <Label htmlFor="accepted" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                内定承諾済み
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