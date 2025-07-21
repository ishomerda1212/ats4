export type Status = 'loading' | 'error' | 'success' | 'idle';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SelectOption {
  value: string;
  label: string;
}