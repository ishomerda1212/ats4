import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Mail } from 'lucide-react';
import { EmailTemplateForm } from '../components/EmailTemplateForm';
import { useTasks } from '../hooks/useTasks';
import { EmailTemplate } from '../types/task';
import { formatDate } from '@/shared/utils/date';

export function EmailTemplateManagementPage() {
  const { emailTemplates, deleteEmailTemplate } = useTasks();
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = emailTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.stage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowTemplateForm(true);
  };

  const handleDeleteTemplate = (template: EmailTemplate) => {
    if (window.confirm(`「${template.name}」を削除しますか？`)) {
      deleteEmailTemplate(template.id);
    }
  };

  const handleTemplateFormSuccess = () => {
    setShowTemplateForm(false);
    setEditingTemplate(null);
  };

  const handleTemplateFormCancel = () => {
    setShowTemplateForm(false);
    setEditingTemplate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">メールテンプレート管理</h1>
          <p className="text-muted-foreground mt-1">選考段階別のメールテンプレートを管理します</p>
        </div>
        
        <Button onClick={() => setShowTemplateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新規テンプレート作成
        </Button>
      </div>

      {showTemplateForm && (
        <div className="mb-6">
          <EmailTemplateForm
            template={editingTemplate || undefined}
            onCancel={handleTemplateFormCancel}
            onSuccess={handleTemplateFormSuccess}
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>検索・絞り込み</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="テンプレート名または選考段階で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {filteredTemplates.length}件のテンプレート
        </span>
      </div>

      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm ? '条件に一致するテンプレートが見つかりませんでした。' : 'メールテンプレートがありません。'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{template.name}</span>
                    </CardTitle>
                    <Badge variant="outline">{template.stage}</Badge>
                    {template.isDefault && (
                      <Badge variant="default" className="text-xs">デフォルト</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">件名</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {template.subject}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">本文（抜粋）</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.body}
                  </p>
                </div>

                {template.variables.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">使用変数</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 3).map((variable) => (
                        <Badge key={variable} variant="secondary" className="text-xs">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                      {template.variables.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.variables.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    作成日: {formatDate(template.createdAt)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditTemplate(template)}>
                      <Edit className="h-3 w-3 mr-1" />
                      編集
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteTemplate(template)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      削除
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}