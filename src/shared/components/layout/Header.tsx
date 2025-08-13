import { Building2, Users, Calendar, FileText, Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="border-b bg-background shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">採用管理システム</span>
            </Link>
            
            <nav className="flex space-x-4">
              <Link to="/dashboard">
                <Button 
                  variant={isActive('/dashboard') || isActive('/') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>ダッシュボード</span>
                </Button>
              </Link>
              
              <Link to="/applicants">
                <Button 
                  variant={isActive('/applicants') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>応募者管理</span>
                </Button>
              </Link>
              
              <Link to="/events">
                <Button 
                  variant={isActive('/events') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>イベント管理</span>
                </Button>
              </Link>
              
              <Link to="/reports">
                <Button 
                  variant={isActive('/reports') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>レポート</span>
                </Button>
              </Link>
              
              <Link to="/tasks">
                <Button 
                  variant={isActive('/tasks') ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <Clock className="h-4 w-4" />
                  <span>タスク管理</span>
                </Button>
              </Link>
              
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}