import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthWrapper } from './components/AuthWrapper';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TransactionHistory } from './components/TransactionHistory';
import { MonthlyReports } from './components/MonthlyReports';
import { TransactionForm } from './components/TransactionForm';
import { BankAccountEdit } from './components/BankAccountEdit';
import { SettingsModal } from './components/SettingsModal';
import { useBankData } from './hooks/useBankData';
import { usePWA } from './hooks/usePWA';

function App() {
  const {
    bankAccount,
    transactions,
    dashboardStats,
    monthlyReports,
    chartData,
    isLoading,
    createBankAccount,
    addTransaction,
    deleteTransaction,
    updateBankAccount
  } = useBankData();

  // Initialize PWA
  usePWA();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [isBankAccountEditOpen, setIsBankAccountEditOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </ThemeProvider>
    );
  }

  // Se não tem conta bancária, mostrar configuração inicial
  if (!bankAccount) {
    return (
      <ThemeProvider>
        <AuthWrapper>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">D</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Configuração Inicial
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Informe o saldo atual da sua banca para começar
                </p>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const balance = parseFloat(formData.get('balance') as string);
                if (balance > 0) {
                  createBankAccount({ currentBalance: balance });
                }
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Saldo Atual
                  </label>
                  <input
                    type="number"
                    name="balance"
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ex: 10000.00"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Criar Banca
                </button>
              </form>
            </div>
          </div>
        </AuthWrapper>
      </ThemeProvider>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return dashboardStats ? (
          <Dashboard stats={dashboardStats} chartData={chartData} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Carregando estatísticas...</p>
          </div>
        );
      
      case 'history':
        return (
          <TransactionHistory
            transactions={transactions}
            onDeleteTransaction={deleteTransaction}
          />
        );
      
      case 'reports':
        return <MonthlyReports reports={monthlyReports} />;
      
      default:
        return dashboardStats ? (
          <Dashboard stats={dashboardStats} chartData={chartData} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Carregando estatísticas...</p>
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      <AuthWrapper>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddTransaction={() => setIsTransactionFormOpen(true)}
            onEditBankAccount={() => setIsBankAccountEditOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </main>

          <TransactionForm
            isOpen={isTransactionFormOpen}
            onClose={() => setIsTransactionFormOpen(false)}
            onSubmit={addTransaction}
          />

          <BankAccountEdit
            isOpen={isBankAccountEditOpen}
            onClose={() => setIsBankAccountEditOpen(false)}
            bankAccount={bankAccount}
            onUpdate={updateBankAccount}
          />

          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </div>
      </AuthWrapper>
    </ThemeProvider>
  );
}

export default App;