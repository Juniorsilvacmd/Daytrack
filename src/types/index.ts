export interface Transaction {
  id: string;
  _id?: string; // MongoDB ObjectId
  date: string;
  type: 'gain' | 'loss';
  amount: number;
  observations?: string;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  _id?: string; // MongoDB ObjectId
  currentBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyReport {
  month: string;
  year: number;
  initialValue: number;
  finalValue: number;
  netProfit: number;
  growthPercentage: number;
  totalGains: number;
  totalLosses: number;
  transactionCount: number;
}

export interface DashboardStats {
  currentBalance: number;
  dailyProfitLoss: number;
  monthlyAccumulated: number;
  growthPercentage: number;
  totalTransactions: number;
}