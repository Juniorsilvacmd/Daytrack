import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Wallet } from 'lucide-react';

interface InitialSetupProps {
  onSetup: (currentBalance: number) => void;
}

export const InitialSetup: React.FC<InitialSetupProps> = ({ onSetup }) => {
  const [currentBalance, setCurrentBalance] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(currentBalance);
    if (value > 0) {
      onSetup(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">
            Daytrack - Configuração Inicial
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Informe o saldo atual da sua banca para começar
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Saldo Atual"
              type="number"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(e.target.value)}
              placeholder="Ex: 10000.00"
              step="0.01"
              min="0.01"
              required
            />
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full"
              disabled={!currentBalance || parseFloat(currentBalance) <= 0}
            >
              Criar Banca
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};