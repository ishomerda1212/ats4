// 色スキーム選択コンポーネント

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COLOR_SCHEME_DISPLAY } from '@/features/system-config/types';
import type { ColorScheme } from '@/features/system-config/types';

interface ColorSchemeSelectProps {
  value?: ColorScheme;
  onValueChange: (value: ColorScheme) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ColorSchemeSelect = ({ 
  value, 
  onValueChange, 
  placeholder = "色を選択", 
  disabled = false 
}: ColorSchemeSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {value && (
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${COLOR_SCHEME_DISPLAY[value].preview}`} />
              <span>{COLOR_SCHEME_DISPLAY[value].name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(COLOR_SCHEME_DISPLAY).map(([colorKey, colorInfo]) => (
          <SelectItem key={colorKey} value={colorKey}>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${colorInfo.preview}`} />
              <span>{colorInfo.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};