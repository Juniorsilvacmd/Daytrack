import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import { Logo } from './Logo';
import djangoApiService from '../services/djangoApiService';

interface LoginFormProps {
  onLoginSuccess: (user: any) => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    twoFactorToken: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await djangoApiService.login(
        formData.username,
        formData.password,
        formData.twoFactorToken || undefined
      );

      onLoginSuccess(response.user);
    } catch (err: any) {
      if (err.message.includes('Token 2FA')) {
        setShowTwoFactor(true);
        setError('Token 2FA necessário');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row shadow-2xl rounded-lg overflow-hidden">
        {/* Left Side - Logo and Branding */}
        <div className="flex-1 bg-gray-800 flex items-center justify-center p-6 lg:p-12">
          <div className="text-center">
            <div className="flex flex-col items-center justify-center space-y-6 mb-8">
              <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="DayTrack Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center">
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg">Sistema de Gestão Financeira</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-96 bg-gray-700 flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-md p-4">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10 pr-8 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 h-12 rounded-full"
                    placeholder="Nome de usuário"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 h-12 rounded-full"
                    placeholder="Senha"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-8 flex items-center justify-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {showTwoFactor && (
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="twoFactorToken"
                      name="twoFactorToken"
                      type="text"
                      value={formData.twoFactorToken}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 h-12"
                      placeholder="Token 2FA"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    Digite o código de 6 dígitos do seu aplicativo autenticador
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors h-12 text-lg"
              >
                {loading ? 'Entrando...' : 'Acessar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={onSwitchToRegister}
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                Não tem uma conta? <span className="text-blue-400 hover:text-blue-300">Criar conta</span>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">© 2025 DayTrack.</p>
              <p className="text-xs text-gray-400">Ver. 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};