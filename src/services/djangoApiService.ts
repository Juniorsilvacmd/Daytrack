import { Transaction, BankAccount, MonthlyReport, DashboardStats } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Interface para resposta da API Django
interface DjangoResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Interface para tokens JWT
interface AuthTokens {
  access: string;
  refresh: string;
}

// Interface para usuário
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_active: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  last_login: string;
}

class DjangoApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Carregar tokens do localStorage
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  // Métodos de autenticação
  async register(userData: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro no registro');
    }

    const data = await response.json();
    
    // Salvar tokens
    this.accessToken = data.tokens.access;
    this.refreshToken = data.tokens.refresh;
    localStorage.setItem('access_token', this.accessToken);
    localStorage.setItem('refresh_token', this.refreshToken);

    return data;
  }

  async login(username: string, password: string, twoFactorToken?: string): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        two_factor_token: twoFactorToken || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro no login');
    }

    const data = await response.json();
    
    // Salvar tokens
    this.accessToken = data.tokens.access;
    this.refreshToken = data.tokens.refresh;
    localStorage.setItem('access_token', this.accessToken);
    localStorage.setItem('refresh_token', this.refreshToken);

    return data;
  }

  async logout(): Promise<void> {
    if (!this.refreshToken) return;

    try {
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          refresh: this.refreshToken,
        }),
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar tokens
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: this.refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.accessToken = data.access;
        localStorage.setItem('access_token', this.accessToken);
        return true;
      }
    } catch (error) {
      console.error('Erro ao renovar token:', error);
    }

    // Se falhou, fazer logout
    await this.logout();
    return false;
  }

  // Método para fazer requisições autenticadas
  private async authenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Se token expirou, tentar renovar
    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Tentar novamente com novo token
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        response = await fetch(url, {
          ...options,
          headers,
        });
      }
    }

    return response;
  }

  // Métodos para conta bancária
  async getBankAccount(): Promise<BankAccount> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/bank-account/`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar conta bancária');
    }

    const data = await response.json();
    return {
      id: data.id.toString(),
      currentBalance: Number(data.current_balance),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async updateBankAccount(bankAccount: BankAccount): Promise<BankAccount> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/bank-account/`, {
      method: 'PUT',
      body: JSON.stringify({
        current_balance: bankAccount.currentBalance,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar conta bancária');
    }

    const data = await response.json();
    return {
      id: data.id.toString(),
      currentBalance: Number(data.current_balance),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  // Métodos para transações
  async getTransactions(): Promise<Transaction[]> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/transactions/`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar transações');
    }

    const data = await response.json();
    return data.results.map((t: any) => ({
      id: t.id.toString(),
      type: t.type,
      amount: Number(t.amount),
      description: t.description,
      date: t.date,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/transactions/`, {
      method: 'POST',
      body: JSON.stringify({
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar transação');
    }

    const data = await response.json();
    return {
      id: data.id.toString(),
      type: data.type,
      amount: Number(data.amount),
      description: data.description,
      date: data.date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/transactions/${id}/`, {
      method: 'PUT',
      body: JSON.stringify({
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar transação');
    }

    const data = await response.json();
    return {
      id: data.id.toString(),
      type: data.type,
      amount: Number(data.amount),
      description: data.description,
      date: data.date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async deleteTransaction(id: string): Promise<void> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/transactions/${id}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar transação');
    }
  }

  // Métodos para estatísticas
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/dashboard-stats/`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas');
    }

    const data = await response.json();
    return {
      currentBalance: Number(data.current_balance),
      dailyProfitLoss: Number(data.daily_profit_loss),
      monthlyAccumulated: Number(data.monthly_accumulated),
      growthPercentage: Number(data.growth_percentage),
      totalTransactions: data.total_transactions,
    };
  }

  async getMonthlyReports(): Promise<MonthlyReport[]> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/monthly-reports/`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar relatórios mensais');
    }

    const data = await response.json();
    return data.results.map((r: any) => ({
      month: r.month_name,
      year: r.year,
      initialValue: Number(r.initial_value),
      finalValue: Number(r.final_value),
      netProfit: Number(r.net_profit),
      growthPercentage: Number(r.growth_percentage),
      totalGains: Number(r.total_gains),
      totalLosses: Number(r.total_losses),
      transactionCount: r.transaction_count,
    }));
  }

  // Métodos para 2FA
  async get2FASetup(): Promise<{ qr_code: string; secret: string }> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/auth/2fa/setup/`);
    
    if (!response.ok) {
      throw new Error('Erro ao configurar 2FA');
    }

    return await response.json();
  }

  async enable2FA(token: string): Promise<{ message: string; backup_codes: string[] }> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/auth/2fa/setup/`, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao habilitar 2FA');
    }

    return await response.json();
  }

  async disable2FA(password: string, token: string): Promise<{ message: string }> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/auth/2fa/disable/`, {
      method: 'POST',
      body: JSON.stringify({ password, token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao desabilitar 2FA');
    }

    return await response.json();
  }

  // Verificar se usuário está logado
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Obter usuário atual
  async getCurrentUser(): Promise<User | null> {
    if (!this.accessToken) return null;

    try {
      const response = await this.authenticatedRequest(`${API_BASE_URL}/auth/profile/`);
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    }

    return null;
  }
}

export default new DjangoApiService();
