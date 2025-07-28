import { format, parseISO, isValid } from 'date-fns';
import { ja } from 'date-fns/locale';

export const formatDate = (date: string | Date, pattern = 'yyyy/MM/dd'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return '無効な日付';
    }
    return format(dateObj, pattern, { locale: ja });
  } catch {
    return '無効な日付';
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'yyyy/MM/dd HH:mm');
};

export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm');
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};