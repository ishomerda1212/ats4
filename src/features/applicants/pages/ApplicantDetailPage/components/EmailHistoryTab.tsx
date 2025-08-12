import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mail,
  CheckCircle
} from 'lucide-react';

export function EmailHistoryTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5" />
          <span>メール履歴</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">メール履歴機能</h3>
          <p className="text-muted-foreground mb-4">
            メール履歴機能は現在開発中です。<br />
            応募者に送信したメールの履歴を管理できます。
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>送信メールの履歴</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>メールテンプレート管理</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>送信状況の追跡</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
