import { useState, useEffect, useMemo } from 'react';
import { Transaction, BankAccount, MonthlyReport, DashboardStats } from '../types';
import { djangoBankService } from '../services/djangoBankService';
import { CalculationService } from '../utils/calculations';

export const useBankData = () => {
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Verificar se há token de autenticação
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.log('Nenhum token de autenticação encontrado');
          setIsLoading(false);
          return;
        }

        const [account, transactionsList] = await Promise.all([
          djangoBankService.getBankAccount(),
          djangoBankService.getTransactions()
        ]);

        if (account) {
          const normalizedAccount = {
            ...account,
            currentBalance: Number(account.currentBalance) || 0
          };
          setBankAccount(normalizedAccount);
        }
        
        if (transactionsList) {
          const normalizedTransactions = transactionsList.map(t => ({
            ...t,
            amount: Number(t.amount) || 0
          }));
          setTransactions(normalizedTransactions);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Create initial bank account
  const createBankAccount = async (bankAccountData: { currentBalance: number }) => {
    const newAccount = await djangoBankService.createBankAccount({
      currentBalance: bankAccountData.currentBalance
    });
    
    if (newAccount) {
      setBankAccount(newAccount);
    }
  };

  // Add new transaction
  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction = await djangoBankService.createTransaction(transactionData);
    
    if (newTransaction) {
      setTransactions(prev => [...prev, newTransaction]);

      // Update bank account balance
      if (bankAccount) {
        const newBalance = bankAccount.currentBalance + 
          (newTransaction.type === 'gain' ? newTransaction.amount : -newTransaction.amount);

        const updatedAccount = {
          ...bankAccount,
          currentBalance: newBalance
        };

        const updatedBankAccount = await djangoBankService.updateBankAccount(updatedAccount);
        if (updatedBankAccount) {
          setBankAccount(updatedBankAccount);
        }
      }
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    const success = await djangoBankService.deleteTransaction(id);
    
    if (success) {
      setTransactions(prev => prev.filter(t => t.id !== id));

      // Update bank account balance
      if (bankAccount) {
        const deletedTransaction = transactions.find(t => t.id === id);
        if (deletedTransaction) {
          const newBalance = bankAccount.currentBalance - 
            (deletedTransaction.type === 'gain' ? deletedTransaction.amount : -deletedTransaction.amount);

          const updatedAccount = {
            ...bankAccount,
            currentBalance: newBalance
          };

          const updatedBankAccount = await djangoBankService.updateBankAccount(updatedAccount);
          if (updatedBankAccount) {
            setBankAccount(updatedBankAccount);
          }
        }
      }
    }
  };

  // Calculate dashboard stats
  const dashboardStats: DashboardStats | null = useMemo(() => {
    if (!bankAccount) {
      return null;
    }
    return CalculationService.getDashboardStats(bankAccount, transactions);
  }, [bankAccount, transactions]);

  // Generate monthly reports
  const monthlyReports: MonthlyReport[] = useMemo(() => {
    if (!bankAccount || transactions.length === 0) return [];

    const reports: MonthlyReport[] = [];
    const months = new Set<string>();

    // Get all unique months from transactions
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      months.add(monthKey);
    });

    // Generate reports for each month
    months.forEach(monthKey => {
      const [year, month] = monthKey.split('-').map(Number);
      const report = CalculationService.generateMonthlyReport(
        bankAccount,
        transactions,
        month,
        year
      );
      reports.push(report);
    });

    return reports.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return new Date(`${b.month} 1, ${b.year}`).getTime() - new Date(`${a.month} 1, ${a.year}`).getTime();
    });
  }, [bankAccount, transactions]);

  // Get chart data
  const chartData = useMemo(() => {
    if (!bankAccount) return [];
    return CalculationService.getChartData(bankAccount, transactions);
  }, [bankAccount, transactions]);

  // Update bank account
  const updateBankAccount = async (updatedAccount: BankAccount) => {
    const result = await djangoBankService.updateBankAccount(updatedAccount);
    if (result) {
      setBankAccount(result);
    }
  };

  // Reset all data
  const resetData = async () => {
    // Para Django, vamos apenas limpar o estado local
    setBankAccount(null);
    setTransactions([]);
  };

  return {
    bankAccount,
    transactions,
    dashboardStats,
    monthlyReports,
    chartData,
    isLoading,
    createBankAccount,
    addTransaction,
    deleteTransaction,
    updateBankAccount,
    resetData
  };
};