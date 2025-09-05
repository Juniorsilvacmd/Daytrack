import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Transaction } from '../types';
import { format } from 'date-fns';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('en-CA'), // Formato YYYY-MM-DD
    type: 'gain' as 'gain' | 'loss',
    amount: '',
    observations: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && parseFloat(formData.amount) > 0) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setFormData({
        date: new Date().toLocaleDateString('en-CA'), // Formato YYYY-MM-DD
        type: 'gain',
        amount: '',
        observations: ''
      });
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({
      date: new Date().toLocaleDateString('en-CA'), // Formato YYYY-MM-DD
      type: 'gain',
      amount: '',
      observations: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nova Operação">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Data"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Operação
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="gain"
                checked={formData.type === 'gain'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'gain' | 'loss' })}
                className="mr-2 text-green-600 focus:ring-green-500"
              />
              <span className="text-green-600 dark:text-green-400 font-medium">Ganho</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="loss"
                checked={formData.type === 'loss'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'gain' | 'loss' })}
                className="mr-2 text-red-600 focus:ring-red-500"
              />
              <span className="text-red-600 dark:text-red-400 font-medium">Perda</span>
            </label>
          </div>
        </div>

        <Input
          label="Valor"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="Ex: 250.00"
          step="0.01"
          min="0.01"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Observações (Opcional)
          </label>
          <textarea
            value={formData.observations}
            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            placeholder="Estratégia utilizada, mercado, etc..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            className="flex-1"
            disabled={!formData.amount || parseFloat(formData.amount) <= 0}
          >
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
};