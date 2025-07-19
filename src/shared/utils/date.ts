import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

export const formatDate = (date: string | Date, pattern = 'yyyy/MM/dd'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, pattern, { locale: ja });
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'yyyy/MM/dd HH:mm');
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};