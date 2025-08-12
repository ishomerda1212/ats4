import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save, X } from 'lucide-react';

export interface FormWrapperProps {
  title?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  showActions?: boolean;
  className?: string;
  headerActions?: React.ReactNode;
}

export function FormWrapper({
  title,
  children,
  onSubmit,
  onCancel,
  loading = false,
  submitText = '保存',
  cancelText = 'キャンセル',
  showActions = true,
  className = '',
  headerActions
}: FormWrapperProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <Card className={className}>
      {(title || headerActions) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          {title && <CardTitle>{title}</CardTitle>}
          {headerActions && <div className="flex items-center space-x-2">{headerActions}</div>}
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {children}
          
          {showActions && (
            <div className="flex items-center justify-end space-x-2 pt-4 border-t">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-2" />
                  {cancelText}
                </Button>
              )}
              {onSubmit && (
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {submitText}
                </Button>
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
