import { BankAccount, Transaction, MonthlyReport, DashboardStats } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

class DjangoBankService {
  private async getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Bank Account operations
  async getBankAccount(): Promise<BankAccount | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/bank-accounts/my_account/`, {
        headers: await this.getAuthHeaders(),
      });

      if (response.status === 404) {
        return null;
      }

      const data = await this.handleResponse(response);
      return {
        id: data.id.toString(),
        currentBalance: Number(data.current_balance) || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao buscar conta bancária:', error);
      return null;
    }
  }

  async createBankAccount(bankAccount: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<BankAccount | null> {
    try {
      // Always try to create a new account
      const response = await fetch(`${API_BASE_URL}/bank-accounts/`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({
          current_balance: bankAccount.currentBalance
        }),
      });

      if (response.status === 400) {
        // If account already exists, try to get the existing one
        const existingAccount = await this.getBankAccount();
        if (existingAccount) {
          // Update the existing account with new balance
          const updatedAccount = {
            ...existingAccount,
            currentBalance: bankAccount.currentBalance
          };
          return await this.updateBankAccount(updatedAccount);
        }
      }

      const data = await this.handleResponse(response);
      return {
        id: data.id.toString(),
        currentBalance: Number(data.current_balance) || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao criar conta bancária:', error);
      return null;
    }
  }

  async updateBankAccount(bankAccount: BankAccount): Promise<BankAccount | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/bank-accounts/${bankAccount.id}/`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({
          current_balance: bankAccount.currentBalance
        }),
      });

      const data = await this.handleResponse(response);
      return {
        id: data.id.toString(),
        currentBalance: Number(data.current_balance) || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao atualizar conta bancária:', error);
      return null;
    }
  }

  // Transaction operations
  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/`, {
        headers: await this.getAuthHeaders(),
      });

      const data = await this.handleResponse(response);
      return data.results.map((transaction: any) => ({
        id: transaction.id.toString(),
        date: transaction.date,
        type: transaction.type,
        amount: Number(transaction.amount) || 0,
        observations: transaction.description,
        createdAt: transaction.created_at
      }));
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.observations,
          date: transaction.date
        }),
      });

      const data = await this.handleResponse(response);
      return {
        id: data.id.toString(),
        date: data.date,
        type: data.type,
        amount: Number(data.amount) || 0,
        observations: data.description,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      return null;
    }
  }

  async deleteTransaction(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}/`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      return false;
    }
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const updateData: any = {};
      if (transaction.type) updateData.type = transaction.type;
      if (transaction.amount !== undefined) updateData.amount = transaction.amount;
      if (transaction.observations !== undefined) updateData.description = transaction.observations;
      if (transaction.date) updateData.date = transaction.date;

      const response = await fetch(`${API_BASE_URL}/transactions/${id}/`, {
        method: 'PATCH',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await this.handleResponse(response);
      return {
        id: data.id.toString(),
        date: data.date,
        type: data.type,
        amount: Number(data.amount) || 0,
        observations: data.description,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      return null;
    }
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard-stats/my_stats/`, {
        headers: await this.getAuthHeaders(),
      });

      if (response.status === 404) {
        return null;
      }

      const data = await this.handleResponse(response);
      return {
        currentBalance: Number(data.current_balance) || 0,
        dailyProfitLoss: Number(data.daily_profit_loss) || 0,
        monthlyAccumulated: Number(data.monthly_accumulated) || 0,
        growthPercentage: Number(data.growth_percentage) || 0,
        totalTransactions: Number(data.total_transactions) || 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return null;
    }
  }

  // Monthly Reports
  async getMonthlyReports(): Promise<MonthlyReport[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/monthly-reports/`, {
        headers: await this.getAuthHeaders(),
      });

      const data = await this.handleResponse(response);
      return data.results.map((report: any) => ({
        month: report.month,
        year: report.year,
        monthName: report.month_name,
        initialValue: Number(report.initial_value) || 0,
        finalValue: Number(report.final_value) || 0,
        netProfit: Number(report.net_profit) || 0,
        growthPercentage: Number(report.growth_percentage) || 0,
        totalGains: Number(report.total_gains) || 0,
        totalLosses: Number(report.total_losses) || 0,
        transactionCount: Number(report.transaction_count) || 0
      }));
    } catch (error) {
      console.error('Erro ao buscar relatórios mensais:', error);
      return [];
    }
  }
}

export const djangoBankService = new DjangoBankService();
