// バリデーション関連のユーティリティ

// メールアドレスのバリデーション
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 電話番号のバリデーション（日本の電話番号）
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^0\d{1,4}-\d{1,4}-\d{4}$/;
  return phoneRegex.test(phone);
};

// 必須項目のバリデーション
export const validateRequired = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// 最小文字数のバリデーション
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

// 最大文字数のバリデーション
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

// 数値の範囲バリデーション
export const validateNumberRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// 日付のバリデーション
export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

// ファイルサイズのバリデーション
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// ファイルタイプのバリデーション
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

// 複合バリデーション
export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'numberRange' | 'date' | 'fileSize' | 'fileType';
  value?: unknown;
  message?: string;
}

export const validateField = (value: unknown, rules: ValidationRule[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  for (const rule of rules) {
    let isValid = true;

    switch (rule.type) {
      case 'required':
        isValid = validateRequired(value);
        break;
      case 'email':
        isValid = validateEmail(value as string);
        break;
      case 'phone':
        isValid = validatePhone(value as string);
        break;
      case 'minLength':
        isValid = validateMinLength(value as string, rule.value as number);
        break;
      case 'maxLength':
        isValid = validateMaxLength(value as string, rule.value as number);
        break;
      case 'numberRange':
        isValid = validateNumberRange(value as number, (rule.value as { min: number; max: number }).min, (rule.value as { min: number; max: number }).max);
        break;
      case 'date':
        isValid = validateDate(value as string);
        break;
      case 'fileSize':
        isValid = validateFileSize(value as File, rule.value as number);
        break;
      case 'fileType':
        isValid = validateFileType(value as File, rule.value as string[]);
        break;
    }

    if (!isValid && rule.message) {
      errors.push(rule.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// フォーム全体のバリデーション
export const validateForm = (data: Record<string, unknown>, validationSchema: Record<string, ValidationRule[]>): {
  isValid: boolean;
  errors: Record<string, string[]>;
} => {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(validationSchema)) {
    const fieldValue = data[field];
    const validation = validateField(fieldValue, rules);
    
    if (!validation.isValid) {
      errors[field] = validation.errors;
      isValid = false;
    }
  }

  return { isValid, errors };
};
