import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Send, Mail } from 'lucide-react';
import { EmailSender } from './EmailSender';

interface EmailTaskButtonProps {
  taskName: string;
  applicantId?: string;
  applicantName?: string;
  applicantEmail?: string;
  stage?: string;
  onEmailSent?: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function EmailTaskButton({
  taskName,
  applicantId,
  applicantName,
  applicantEmail,
  stage,
  onEmailSent,
  variant = 'outline',
  size = 'sm'
}: EmailTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmailSent = () => {
    setIsOpen(false);
    onEmailSent?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Mail className="h-4 w-4" />
          {taskName}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            {taskName}
          </DialogTitle>
        </DialogHeader>
        <EmailSender
          applicantId={applicantId}
          applicantName={applicantName}
          applicantEmail={applicantEmail}
          stage={stage}
          onEmailSent={handleEmailSent}
        />
      </DialogContent>
    </Dialog>
  );
} 