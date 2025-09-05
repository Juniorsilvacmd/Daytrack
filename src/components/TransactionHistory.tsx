import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Transaction } from '../types';

import { Search, ArrowUpCircle, ArrowDownCircle, Edit, Trash2, Activity } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onDeleteTransaction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'gain' | 'loss'>('all');

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.observations
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) || true;
      
      const matchesType = filterType === 'all' || transaction.type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    // Garantir que a data seja tratada como local, não UTC
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Operações</CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar nas observações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={filterType === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              Todas
            </Button>
            <Button
              variant={filterType === 'gain' ? 'success' : 'secondary'}
              size="sm"
              onClick={() => setFilterType('gain')}
            >
              Ganhos
            </Button>
            <Button
              variant={filterType === 'loss' ? 'danger' : 'secondary'}
              size="sm"
              onClick={() => setFilterType('loss')}
            >
              Perdas
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">Nenhuma operação encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'gain' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    {transaction.type === 'gain' ? (
                      <ArrowUpCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowDownCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDate(transaction.date)}
                      </span>
                      <span className={`font-bold ${
                        transaction.type === 'gain' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'gain' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    {transaction.observations && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {transaction.observations}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};