export type Status = 'loading' | 'error' | 'success' | 'idle';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SelectOption {
  value: string;
  label: string;
}