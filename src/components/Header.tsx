import React from 'react';
import { Button } from './ui/Button';
import { Plus, History, Settings, Sun, Moon, Edit, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import djangoApiService from '../services/djangoApiService';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddTransaction: () => void;
  onEditBankAccount: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onAddTransaction, onEditBankAccount, onOpenSettings }) => {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await djangoApiService.getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await djangoApiService.logout();
    window.location.reload();
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
              <img 
                src="/logo.png" 
                alt="DayTrack Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onTabChange('history')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Histórico
              </button>
              <button
                onClick={() => onTabChange('reports')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'reports'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Relatórios
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={onEditBankAccount}
              className="flex items-center space-x-1"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Editar Banca</span>
            </Button>

            <Button
              variant="primary"
              onClick={onAddTransaction}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Operação</span>
            </Button>

            {/* Settings and Logout */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenSettings}
                className="flex items-center space-x-1"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Configurações</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-1 p-2">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="w-4 h-4 mr-1 rounded flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Dashboard" className="w-full h-full object-contain" />
              </div>
              Dashboard
            </button>
            <button
              onClick={() => onTabChange('history')}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <History className="w-4 h-4 mr-1" />
              Histórico
            </button>
            <button
              onClick={() => onTabChange('reports')}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 mr-1" />
              Relatórios
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};