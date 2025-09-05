import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { BankAccount } from '../types';

interface BankAccountEditProps {
  isOpen: boolean;
  onClose: () => void;
  bankAccount: BankAccount;
  onUpdate: (updatedAccount: BankAccount) => void;
}

export const BankAccountEdit: React.FC<BankAccountEditProps> = ({
  isOpen,
  onClose,
  bankAccount,
  onUpdate
}) => {
                const [formData, setFormData] = useState({
                currentBalance: bankAccount.currentBalance.toString()
              });

                const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault();
                const currentBalance = parseFloat(formData.currentBalance);

                if (currentBalance >= 0) {
                  const updatedAccount: BankAccount = {
                    ...bankAccount,
                    currentBalance,
                    updatedAt: new Date().toISOString()
                  };

                  onUpdate(updatedAccount);
                  onClose();
                }
              };

                const handleClose = () => {
                setFormData({
                  currentBalance: bankAccount.currentBalance.toString()
                });
                onClose();
              };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar Banca">
                        <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Saldo Atual"
                      type="number"
                      value={formData.currentBalance}
                      onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                      placeholder="Ex: 12500.00"
                      step="0.01"
                      min="0"
                      required
                    />

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Atenção:</strong> Alterar estes valores pode afetar os cálculos de performance e relatórios.
            Certifique-se de que os valores estão corretos antes de salvar.
          </p>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            Cancelar
          </Button>
                                <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        disabled={!formData.currentBalance || parseFloat(formData.currentBalance) < 0}
                      >
                        Salvar Alterações
                      </Button>
        </div>
      </form>
    </Modal>
  );
};
