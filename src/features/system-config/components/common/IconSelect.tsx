// アイコン選択コンポーネント

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AVAILABLE_ICONS } from '@/features/system-config/types';

interface IconSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const IconSelect = ({ 
  value, 
  onValueChange, 
  placeholder = "アイコンを選択", 
  disabled = false 
}: IconSelectProps) => {
  const selectedIcon = AVAILABLE_ICONS.find(icon => icon.value === value);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {selectedIcon && (
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedIcon.icon}</span>
              <span>{selectedIcon.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {AVAILABLE_ICONS.map((icon) => (
          <SelectItem key={icon.value} value={icon.value}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{icon.icon}</span>
              <span>{icon.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};