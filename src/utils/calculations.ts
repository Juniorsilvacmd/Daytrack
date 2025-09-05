import { Transaction, BankAccount, MonthlyReport, DashboardStats } from '../types';
import { format, startOfMonth, endOfMonth, isSameMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const CalculationService = {
  calculateCurrentBalance(initialValue: number, transactions: Transaction[]): number {
    return transactions.reduce((balance, transaction) => {
      return transaction.type === 'gain' 
        ? balance + transaction.amount
        : balance - transaction.amount;
    }, initialValue);
  },

  calculateDailyProfitLoss(transactions: Transaction[], date: Date = new Date()): number {
    // Usar a data local para evitar problemas de timezone
    const today = new Date(date);
    const todayString = today.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    
    const todayTransactions = transactions.filter(t => {
      // Usar a data original diretamente se já estiver no formato YYYY-MM-DD
      let transactionDateString;
      if (typeof t.date === 'string' && t.date.includes('-')) {
        transactionDateString = t.date.split('T')[0]; // Remove time se houver
      } else {
        const transactionDate = new Date(t.date);
        transactionDateString = transactionDate.toLocaleDateString('en-CA');
      }
      
      return transactionDateString === todayString;
    });

    return todayTransactions.reduce((total, transaction) => {
      return transaction.type === 'gain'
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);
  },

  calculateMonthlyAccumulated(transactions: Transaction[], date: Date = new Date()): number {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    return monthTransactions.reduce((total, transaction) => {
      return transaction.type === 'gain'
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);
  },

  calculateGrowthPercentage(initialValue: number, currentValue: number): number {
    if (initialValue === 0) return 0;
    return ((currentValue - initialValue) / initialValue) * 100;
  },

  generateMonthlyReport(
    bankAccount: BankAccount, 
    transactions: Transaction[], 
    month: number, 
    year: number
  ): MonthlyReport {
    const monthStart = startOfMonth(new Date(year, month - 1));
    const monthEnd = endOfMonth(new Date(year, month - 1));

    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const totalGains = monthTransactions
      .filter(t => t.type === 'gain')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalLosses = monthTransactions
      .filter(t => t.type === 'loss')
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalGains - totalLosses;

    // Calculate initial value for the month (bank value at the start of month)
    const transactionsBeforeMonth = transactions.filter(t => 
      new Date(t.date) < monthStart
    );
    
    // Calcular o valor inicial real da banca (antes de todas as transações)
    let initialBankValue = bankAccount.currentBalance;
    transactions.forEach(transaction => {
      if (transaction.type === 'gain') {
        initialBankValue -= transaction.amount;
      } else {
        initialBankValue += transaction.amount;
      }
    });
    
    // Calcular o valor inicial do mês baseado no valor inicial da banca + transações anteriores
    const initialValueForMonth = initialBankValue + transactionsBeforeMonth.reduce((total, t) => {
      return t.type === 'gain' ? total + t.amount : total - t.amount;
    }, 0);

    const finalValue = initialValueForMonth + netProfit;
    const growthPercentage = this.calculateGrowthPercentage(initialValueForMonth, finalValue);

    return {
      month: format(monthStart, 'MMMM', { locale: ptBR }),
      year,
      initialValue: initialValueForMonth,
      finalValue,
      netProfit,
      growthPercentage,
      totalGains,
      totalLosses,
      transactionCount: monthTransactions.length
    };
  },

  getDashboardStats(bankAccount: BankAccount, transactions: Transaction[]): DashboardStats {
    // Usar o saldo atual da conta bancária
    const currentBalance = Number(bankAccount.currentBalance) || 0;
    const dailyProfitLoss = this.calculateDailyProfitLoss(transactions);
    const monthlyAccumulated = this.calculateMonthlyAccumulated(transactions);
    
    // Para simplificar, vamos mostrar o crescimento baseado no mês atual
    const growthPercentage = currentBalance > 0 && monthlyAccumulated !== 0 ? 
      (monthlyAccumulated / currentBalance) * 100 : 0;

    return {
      currentBalance,
      dailyProfitLoss,
      monthlyAccumulated,
      growthPercentage,
      totalTransactions: transactions.length
    };
  },

  getChartData(bankAccount: BankAccount, transactions: Transaction[]): Array<{date: string, balance: number}> {
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const chartData: Array<{date: string, balance: number}> = [];
    
    // Start with the initial balance (before any transactions)
    let runningBalance = bankAccount.currentBalance;
    
    // Subtract all transactions to get the initial balance
    sortedTransactions.forEach(transaction => {
      if (transaction.type === 'gain') {
        runningBalance -= transaction.amount;
      } else {
        runningBalance += transaction.amount;
      }
    });

    // Calculate balance for each day with transactions
    const groupedByDate = sortedTransactions.reduce((acc, transaction) => {
      const dateKey = transaction.date; // Already in YYYY-MM-DD format
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);

    // Get all unique dates (including bank creation date)
    const allDates = new Set<string>();
    allDates.add(bankAccount.createdAt.split('T')[0]); // Add bank creation date
    Object.keys(groupedByDate).forEach(date => allDates.add(date));
    
    // Sort dates
    const sortedDates = Array.from(allDates).sort();

    sortedDates.forEach(date => {
      const dayTransactions = groupedByDate[date] || [];
      
      if (dayTransactions.length > 0) {
        const dayChange = dayTransactions.reduce((total, t) => {
          return t.type === 'gain' ? total + t.amount : total - t.amount;
        }, 0);
        runningBalance += dayChange;
      }
      
      // Formatar data corretamente (YYYY-MM-DD para DD/MM)
      const [year, month, day] = date.split('-');
      chartData.push({
        date: `${day}/${month}`,
        balance: runningBalance
      });
    });

    return chartData;
  }
};