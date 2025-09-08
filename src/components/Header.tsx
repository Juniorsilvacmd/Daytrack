import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Sun, Moon, LogOut, Plus, Edit, Settings, BarChart3, History, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import djangoApiService from '../services/djangoApiService';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddTransaction: () => void;
  onEditBankAccount: () => void;
  onOpenSettings: () => void;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  two_factor_enabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onAddTransaction,
  onEditBankAccount,
  onOpenSettings
}) => {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await djangoApiService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await djangoApiService.logout();
    window.location.reload();
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'reports', label: 'Relatórios', icon: Calendar },
    ...(user && user.is_superuser ? [{ id: 'admin', label: 'Admin', icon: BarChart3 }] : []),
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="DayTrack Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${activeTab === item.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              onClick={onEditBankAccount}
              className="hidden sm:flex items-center space-x-2 px-3"
            >
              <Edit className="w-4 h-4" />
              <span>Editar Banca</span>
            </Button>

            <Button
              variant="primary"
              onClick={onAddTransaction}
              className="flex items-center space-x-2 px-3"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Operação</span>
            </Button>

            <Button
              variant="ghost"
              onClick={onOpenSettings}
              className="flex items-center space-x-2 px-3"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Configurações</span>
            </Button>

            <div className="ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>

            <div className="ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};