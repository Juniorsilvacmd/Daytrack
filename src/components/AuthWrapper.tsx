import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import djangoApiService from '../services/djangoApiService';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (djangoApiService.isAuthenticated()) {
        const currentUser = await djangoApiService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          // Token inválido, fazer logout
          await djangoApiService.logout();
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      await djangoApiService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await djangoApiService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <RegisterForm
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <LoginForm
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Renderizar o app principal com o usuário autenticado
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
};
