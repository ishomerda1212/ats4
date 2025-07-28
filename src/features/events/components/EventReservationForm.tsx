import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, Clock, MapPin, Users, Monitor, User, Check, ChevronsUpDown } from 'lucide-react';
import { Event, EventSession } from '../types/event';
import { Applicant } from '@/features/applicants/types/applicant';
import { formatDateTime } from '@/shared/utils/date';
import { cn } from '@/lib/utils';

interface EventReservationFormProps {
  event?: Event;
  events?: Event[];
  sessions?: EventSession[];
  applicants?: Applicant[];
  getEventSessions?: (eventId: string) => EventSession[];
  onSubmit: (formData: ReservationFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface ReservationFormData {
  selectedApplicantId: string;
  selectedEventId: string;
  selectedSessionId: string;
  notes?: string;
}

export function EventReservationForm({ 
  event, 
  events, 
  sessions, 
  applicants = [],
  getEventSessions,
  onSubmit, 
  onCancel, 
  loading = false 
}: EventReservationFormProps) {
  const [formData, setFormData] = useState<ReservationFormData>({
    selectedApplicantId: '',
    selectedEventId: event?.id || '',
    selectedSessionId: '',
    notes: ''
  });

  const [openApplicantSearch, setOpenApplicantSearch] = useState(false);
  const [applicantSearchValue, setApplicantSearchValue] = useState('');

  // 選択されたイベントのセッションを取得
  const selectedEventSessions = events && getEventSessions && formData.selectedEventId
    ? getEventSessions(formData.selectedEventId)
    : sessions || [];

  // 選択された応募者を取得
  const selectedApplicant = applicants.find(applicant => applicant.id === formData.selectedApplicantId);

  // 応募者検索フィルター
  const filteredApplicants = applicants.filter(applicant =>
    applicant.name.toLowerCase().includes(applicantSearchValue.toLowerCase()) ||
    applicant.nameKana.toLowerCase().includes(applicantSearchValue.toLowerCase()) ||
    applicant.email.toLowerCase().includes(applicantSearchValue.toLowerCase())
  );

  const handleApplicantSelect = (applicant: Applicant) => {
    setFormData(prev => ({
      ...prev,
      selectedApplicantId: applicant.id
    }));
    setOpenApplicantSearch(false);
    setApplicantSearchValue('');
  };

  const [errors, setErrors] = useState<Partial<ReservationFormData>>({});

  const handleInputChange = (field: keyof ReservationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ReservationFormData> = {};

    if (!formData.selectedApplicantId) {
      newErrors.selectedApplicantId = '応募者を選択してください';
    }

    if (!formData.selectedSessionId) {
      newErrors.selectedSessionId = 'セッションを選択してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getFormatBadge = (format?: string) => {
    switch (format) {
      case '対面':
        return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><Users className="w-3 h-3" />対面</Badge>;
      case 'オンライン':
        return <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1"><Monitor className="w-3 h-3" />オンライン</Badge>;
      case 'ハイブリッド':
        return <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1"><Users className="w-3 h-3" />ハイブリッド</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">未定</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          イベント予約フォーム
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {event ? `${event.name} への参加予約を行います` : 'イベントへの参加予約を行います'}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* イベント選択 */}
          {events && events.length > 0 && (
            <div className="space-y-3">
              <Label htmlFor="event">イベント選択 *</Label>
              <Select
                value={formData.selectedEventId}
                onValueChange={(value) => handleInputChange('selectedEventId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="イベントを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      <span>{event.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* イベント情報 */}
          {event && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">イベント情報</h3>
              <div className="space-y-2 text-sm">
                <p><strong>イベント名:</strong> {event.name}</p>
                <p><strong>説明:</strong> {event.description}</p>
                <p><strong>選考段階:</strong> {event.stage}</p>
              </div>
            </div>
          )}

          {/* セッション選択 */}
          {selectedEventSessions.length > 0 && (
            <div className="space-y-3">
              <Label htmlFor="session">参加セッション *</Label>
              <Select
                value={formData.selectedSessionId}
                onValueChange={(value) => handleInputChange('selectedSessionId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="セッションを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {selectedEventSessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                          <span className="font-medium">{session.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(session.start)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {getFormatBadge(session.format)}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.selectedSessionId && (
                <p className="text-sm text-red-600">{errors.selectedSessionId}</p>
              )}

              {/* 選択されたセッションの詳細 */}
              {formData.selectedSessionId && (
                <div className="p-4 border rounded-lg bg-blue-50">
                  {(() => {
                    const selectedSession = selectedEventSessions.find(s => s.id === formData.selectedSessionId);
                    if (!selectedSession) return null;
                    
                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span><strong>日時:</strong> {formatDateTime(selectedSession.start)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span><strong>終了:</strong> {formatDateTime(selectedSession.end)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span><strong>場所:</strong> {selectedSession.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                          <span><strong>形式:</strong> {selectedSession.format}</span>
                        </div>
                        {selectedSession.maxParticipants && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span><strong>定員:</strong> {selectedSession.maxParticipants}名</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* 応募者選択 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">応募者選択 *</h3>
              {applicants.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  応募者が登録されていません
                </span>
              )}
            </div>
            
            {applicants.length > 0 ? (
              <div className="space-y-3">
                <Popover open={openApplicantSearch} onOpenChange={setOpenApplicantSearch}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openApplicantSearch}
                      className="w-full justify-between"
                    >
                      {selectedApplicant ? (
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>{selectedApplicant.name}</span>
                          <span className="ml-2 text-muted-foreground">({selectedApplicant.email})</span>
                        </div>
                      ) : (
                        <>
                          <User className="mr-2 h-4 w-4" />
                          応募者を選択してください
                        </>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput 
                        placeholder="応募者を検索..." 
                        value={applicantSearchValue}
                        onValueChange={setApplicantSearchValue}
                      />
                      <CommandList>
                        <CommandEmpty>応募者が見つかりません。</CommandEmpty>
                        <CommandGroup>
                          {filteredApplicants.map((applicant) => (
                            <CommandItem
                              key={applicant.id}
                              value={applicant.name}
                              onSelect={() => handleApplicantSelect(applicant)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.selectedApplicantId === applicant.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{applicant.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {applicant.email} • {applicant.phone}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                
                {errors.selectedApplicantId && (
                  <p className="text-sm text-red-600">{errors.selectedApplicantId}</p>
                )}

                {/* 選択された応募者の詳細情報 */}
                {selectedApplicant && (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-medium mb-3">選択された応募者情報</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">氏名:</span> {selectedApplicant.name}
                      </div>
                      <div>
                        <span className="font-medium">フリガナ:</span> {selectedApplicant.nameKana}
                      </div>
                      <div>
                        <span className="font-medium">メール:</span> {selectedApplicant.email}
                      </div>
                      <div>
                        <span className="font-medium">電話:</span> {selectedApplicant.phone}
                      </div>
                      <div>
                        <span className="font-medium">学校:</span> {selectedApplicant.schoolName}
                      </div>
                      <div>
                        <span className="font-medium">現在の段階:</span> {selectedApplicant.currentStage}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 border rounded-lg bg-yellow-50">
                <p className="text-sm text-yellow-800">
                  予約を行うには、まず応募者を登録する必要があります。
                  <br />
                  <a href="/applicants/create" className="text-blue-600 hover:underline">
                    応募者登録ページへ移動
                  </a>
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">備考</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="その他ご要望やご質問がございましたらご記入ください"
                rows={3}
              />
            </div>
          </div>

          {/* ボタン */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '送信中...' : '予約を確定する'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 