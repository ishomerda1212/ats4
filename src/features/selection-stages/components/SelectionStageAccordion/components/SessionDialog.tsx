import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Users as UsersIcon, Monitor, Plus, Calendar, Clock } from 'lucide-react';
import { formatDateTime } from '@/shared/utils/date';
import { SESSION_TYPE_OPTIONS, STAGE_RESULT_OPTIONS } from '@/shared/utils/constants';
import { EventSession } from '@/features/events/types/event';
import { useState, useEffect } from 'react';

type Session = EventSession;

interface SessionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingStage: string;
  sessionFormData: {
    selectedSessionId: string;
    sessionFormat: string; // 実施形式: 対面/オンライン/ハイブリッド
    recruiter: string; // 担当者
    result: string;
    // 新しいセッション作成用のフィールド
    newSessionName: string;
    newSessionStart: string;
    newSessionEnd: string;
    newSessionVenue: string;
    newSessionFormat: string;
    newSessionMaxParticipants: string;
  };
  availableSessions: Session[];
  onSessionSelection: (sessionId: string) => void;
  onSessionFormChange: (field: string, value: string) => void;
  onSave: (isCreatingNewSession: boolean) => void;
}

// 30分単位の時間オプションを生成
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(timeString);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

export function SessionDialog({
  isOpen,
  onOpenChange,
  editingStage,
  sessionFormData,
  availableSessions,
  onSessionSelection,
  onSessionFormChange,
  onSave
}: SessionDialogProps) {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('10:00');
  const [activeTab, setActiveTab] = useState('selection'); // 'selection' または 'creation'

  // ダイアログが開かれたときに初期値を設定
  useEffect(() => {
    if (isOpen) {
      // 既存のセッション情報がある場合は、それを使用
      if (sessionFormData.selectedSessionId) {
        // 既存のセッションが選択されている場合は、新規作成の初期値を設定しない
        return;
      }

      // セッション作成タブの場合のみ初期値を設定
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${Math.floor(now.getMinutes() / 30) * 30 === 0 ? '00' : '30'}`;
      
      setStartDate(today);
      setStartTime(currentTime);
      setEndDate(today);
      
      // 1時間後の時間を計算
      const endHour = (now.getHours() + 1) % 24;
      const endTimeStr = `${endHour.toString().padStart(2, '0')}:${Math.floor(now.getMinutes() / 30) * 30 === 0 ? '00' : '30'}`;
      setEndTime(endTimeStr);
      
      // フォームデータを更新
      onSessionFormChange('newSessionStart', `${today}T${currentTime}`);
      onSessionFormChange('newSessionEnd', `${today}T${endTimeStr}`);
    }
  }, [isOpen, sessionFormData.selectedSessionId, onSessionFormChange]);

  // 開始日時が変更されたときに終了日時を自動調整
  useEffect(() => {
    if (startDate && startTime) {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1時間後
      
      const endDateStr = endDateTime.toISOString().split('T')[0];
      const endTimeStr = `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`;
      
      setEndDate(endDateStr);
      setEndTime(endTimeStr);
      
      onSessionFormChange('newSessionStart', `${startDate}T${startTime}`);
      onSessionFormChange('newSessionEnd', `${endDateStr}T${endTimeStr}`);
    }
  }, [startDate, startTime, onSessionFormChange]);

  // 終了日時が手動で変更されたときの処理
  const handleEndDateTimeChange = (date: string, time: string) => {
    setEndDate(date);
    setEndTime(time);
    onSessionFormChange('newSessionEnd', `${date}T${time}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" aria-describedby="session-dialog-description">
        <DialogHeader>
          <DialogTitle>
            {editingStage} - セッション情報登録
          </DialogTitle>
        </DialogHeader>
        <div id="session-dialog-description" className="sr-only">
          {editingStage}のセッション情報を登録するダイアログです。既存のセッションを選択するか、新しいセッションを作成できます。
        </div>
        
        <Tabs defaultValue="selection" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="selection" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>セッション選択</span>
            </TabsTrigger>
            <TabsTrigger value="creation" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>セッション作成</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="selection" className="space-y-4">
            {/* セッション選択タブの内容 */}
            <div>
              <Label htmlFor="sessionSelect">セッション選択</Label>
              <Select 
                value={sessionFormData.selectedSessionId} 
                onValueChange={onSessionSelection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="セッションを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {availableSessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      <div className="flex flex-col">
                        <span className="font-medium text-base">
                          {formatDateTime(session.start)} - {formatDateTime(session.end)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {session.venue} • {session.format}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                イベント管理で登録されているセッションから選択してください
              </p>
            </div>

            {/* 実施形式 */}
            <div>
              <Label htmlFor="sessionTypeSelect">実施形式</Label>
              <Select 
                value={sessionFormData.sessionFormat} 
                onValueChange={(value) => onSessionFormChange('sessionFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="実施形式を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="対面">
                    <div className="flex items-center space-x-2">
                      <UsersIcon className="h-4 w-4" />
                      <span>対面</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="オンライン">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4" />
                      <span>オンライン</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ハイブリッド">
                    <div className="flex items-center space-x-2">
                      <UsersIcon className="h-4 w-4" />
                      <span>ハイブリッド</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                セッションの実施形式を選択してください
              </p>
            </div>

            {/* 合否選択 */}
            <div>
              <Label htmlFor="resultSelect">合否</Label>
              <Select 
                value={sessionFormData.result} 
                onValueChange={(value) => onSessionFormChange('result', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="合否を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    const resultOptions = STAGE_RESULT_OPTIONS[editingStage as keyof typeof STAGE_RESULT_OPTIONS] || [];
                    return resultOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ));
                  })()}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {editingStage}の結果を選択してください
              </p>
            </div>
          </TabsContent>

          <TabsContent value="creation" className="space-y-4">
            {/* セッション作成タブの内容 */}
            <div className="grid grid-cols-2 gap-4">
              {/* 開始日時 */}
              <div>
                <Label htmlFor="startDate">開始日</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="startTime">開始時刻</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 終了日時 */}
              <div>
                <Label htmlFor="endDate">終了日</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">終了時刻</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 会場 */}
              <div className="col-span-2">
                <Label htmlFor="newSessionVenue">会場</Label>
                <Input
                  id="newSessionVenue"
                  value={sessionFormData.newSessionVenue}
                  onChange={(e) => onSessionFormChange('newSessionVenue', e.target.value)}
                  placeholder="会場を入力してください"
                />
              </div>

              {/* 実施形式 */}
              <div>
                <Label htmlFor="newSessionFormat">実施形式</Label>
                <Select 
                  value={sessionFormData.newSessionFormat} 
                  onValueChange={(value) => onSessionFormChange('newSessionFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="実施形式を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="対面">
                      <div className="flex items-center space-x-2">
                        <UsersIcon className="h-4 w-4" />
                        <span>対面</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="オンライン">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4" />
                        <span>オンライン</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ハイブリッド">
                      <div className="flex items-center space-x-2">
                        <UsersIcon className="h-4 w-4" />
                        <span>ハイブリッド</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 参加者上限 */}
              <div>
                <Label htmlFor="newSessionMaxParticipants">参加者上限</Label>
                <Input
                  id="newSessionMaxParticipants"
                  type="number"
                  value={sessionFormData.newSessionMaxParticipants}
                  onChange={(e) => onSessionFormChange('newSessionMaxParticipants', e.target.value)}
                  placeholder="参加者上限数"
                />
              </div>
            </div>

            {/* 合否選択（作成タブでも共通） */}
            <div>
              <Label htmlFor="resultSelect">合否</Label>
              <Select 
                value={sessionFormData.result} 
                onValueChange={(value) => onSessionFormChange('result', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="合否を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    const resultOptions = STAGE_RESULT_OPTIONS[editingStage as keyof typeof STAGE_RESULT_OPTIONS] || [];
                    return resultOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ));
                  })()}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {editingStage}の結果を選択してください
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={() => onSave(activeTab === 'creation')}>
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
