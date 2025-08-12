// フォーマット関連のユーティリティ

// 数値のフォーマット
export const formatNumber = (num: number, locale = 'ja-JP'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

// 通貨のフォーマット
export const formatCurrency = (amount: number, currency = 'JPY', locale = 'ja-JP'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
};

// パーセンテージのフォーマット
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// ファイルサイズのフォーマット
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 電話番号のフォーマット
export const formatPhoneNumber = (phone: string): string => {
  // ハイフンを除去して数字のみにする
  const cleaned = phone.replace(/\D/g, '');
  
  // 日本の電話番号形式にフォーマット
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

// 名前のフォーマット（姓 名）
export const formatName = (lastName: string, firstName: string): string => {
  return `${lastName} ${firstName}`.trim();
};

// 住所のフォーマット
export const formatAddress = (prefecture: string, city: string, address?: string): string => {
  const parts = [prefecture, city, address].filter(Boolean);
  return parts.join('');
};

// 文字列の省略表示
export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + suffix;
};

// カテゴリ名のフォーマット
export const formatCategory = (category: string): string => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// ステータスのフォーマット
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': '保留',
    'completed': '完了',
    'cancelled': 'キャンセル',
    'in_progress': '進行中',
    'not_started': '未着手'
  };
  
  return statusMap[status] || status;
};

// 日付の相対表示（例：3日前、1時間前）
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return '今';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}分前`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}時間前`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}日前`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}ヶ月前`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years}年前`;
  }
};

// リストのフォーマット
export const formatList = (items: string[], conjunction = '、'): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(conjunction);
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  return `${otherItems.join(conjunction)}${conjunction}${lastItem}`;
};

// 時間のフォーマット（分を時間:分に変換）
export const formatMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}分`;
  } else if (remainingMinutes === 0) {
    return `${hours}時間`;
  } else {
    return `${hours}時間${remainingMinutes}分`;
  }
};
