import { Transaction, BankAccount, MonthlyReport, DashboardStats } from '../types';

const resolvedBaseUrl = (() => {
  const envUrl = (import.meta.env.VITE_API_URL as string) || '';
  if (envUrl) return envUrl;
  if (typeof window !== 'undefined') {
    const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isLocalhost) return 'http://127.0.0.1:8000/api/v1';
    return `${window.location.origin}/api/v1`;
  }
  return 'http://127.0.0.1:8000/api/v1';
})();

const API_BASE_URL = resolvedBaseUrl;

export const getBackendOrigin = (): string => {
  // Remove sufixo /api/v1 do base URL para obter a origem do backend
  try {
    return API_BASE_URL.replace(/\/api\/v1\/?$/, '');
  } catch {
    return 'http://127.0.0.1:8000';
  }
};

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

  // Parser seguro para lidar com respostas que não são JSON (HTML/erro proxy)
  private async parseJsonSafely<T = any>(response: Response): Promise<T> {
    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch (_) {
      throw new Error(`Resposta inválida da API (status ${response.status}). Verifique VITE_API_URL e o servidor.`);
    }
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
    const response = await fetch(`${API_BASE_URL}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await this.parseJsonSafely(response);
      throw new Error(error.message || 'Erro no registro');
    }

    const data = await this.parseJsonSafely(response);
    
    // Salvar tokens
    this.accessToken = (data.tokens.access ?? '') as string;
    this.refreshToken = (data.tokens.refresh ?? '') as string;
    localStorage.setItem('access_token', this.accessToken);
    localStorage.setItem('refresh_token', this.refreshToken);

    return data;
  }

  async login(username: string, password: string, twoFactorToken?: string): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${API_BASE_URL}/login/`, {
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
      const error = await this.parseJsonSafely(response);
      throw new Error(error.message || 'Erro no login');
    }

    const data = await this.parseJsonSafely(response);
    
    // Salvar tokens
    this.accessToken = (data.tokens?.access ?? '') as string;
    this.refreshToken = (data.tokens?.refresh ?? '') as string;
    localStorage.setItem('access_token', this.accessToken);
    localStorage.setItem('refresh_token', this.refreshToken);

    return data;
  }

  async logout(): Promise<void> {
    if (!this.refreshToken) return;

    try {
      await fetch(`${API_BASE_URL}/logout/`, {
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
      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: this.refreshToken,
        }),
      });

      if (response.ok) {
        const data = await this.parseJsonSafely(response);
        this.accessToken = (data.access ?? '') as string;
        localStorage.setItem('access_token', this.accessToken as string);
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
    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const incoming = (options.headers || {}) as Record<string, string>;
    if (this.accessToken) baseHeaders.Authorization = `Bearer ${this.accessToken}`;
    const headers: Record<string, string> = { ...baseHeaders, ...incoming };

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Se token expirou, tentar renovar
    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed && this.accessToken) {
        // Tentar novamente com novo token
        headers.Authorization = `Bearer ${this.accessToken}`;
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

    const data = await this.parseJsonSafely(response);
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

    const data = await this.parseJsonSafely(response);
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

    const data = await this.parseJsonSafely(response);
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
      const error = await this.parseJsonSafely(response);
      throw new Error(error.message || 'Erro ao criar transação');
    }

    const data = await this.parseJsonSafely(response);
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

    const data = await this.parseJsonSafely(response);
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

    const data = await this.parseJsonSafely(response);
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

    const data = await this.parseJsonSafely(response);
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

  // Admin (apenas staff/superuser)
  async adminListUsers(): Promise<any[]> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/admin/users/`);
    if (!response.ok) throw new Error('Erro ao listar usuários');
    return await this.parseJsonSafely(response);
  }

  async adminCreateUser(payload: any): Promise<any> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/admin/users/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await this.parseJsonSafely(response);
      throw new Error(err.message || 'Erro ao criar usuário');
    }
    return await this.parseJsonSafely(response);
  }

  async adminUpdateUser(userId: number, payload: any): Promise<any> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/admin/users/${userId}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Erro ao atualizar usuário');
    return await this.parseJsonSafely(response);
  }

  async adminDeleteUser(userId: number): Promise<void> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/admin/users/${userId}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir usuário');
  }

  async adminStats(): Promise<{ total_users: number; active_users: number; staff_users: number; superusers: number; }> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/admin/stats/`);
    if (!response.ok) throw new Error('Erro ao buscar estatísticas');
    return await this.parseJsonSafely(response);
  }

  // Métodos para 2FA
  async get2FASetup(): Promise<{ qr_code: string; secret: string }> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/auth/2fa/setup/`);
    
    if (!response.ok) {
      throw new Error('Erro ao configurar 2FA');
    }

    return await this.parseJsonSafely(response);
  }

  async enable2FA(token: string): Promise<{ message: string; backup_codes: string[] }> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/auth/2fa/setup/`, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await this.parseJsonSafely(response);
      throw new Error(error.message || 'Erro ao habilitar 2FA');
    }

    return await this.parseJsonSafely(response);
  }

  async disable2FA(password: string, token: string): Promise<{ message: string }> {
    const response = await this.authenticatedRequest(`${API_BASE_URL}/auth/2fa/disable/`, {
      method: 'POST',
      body: JSON.stringify({ password, token }),
    });

    if (!response.ok) {
      const error = await this.parseJsonSafely(response);
      throw new Error(error.message || 'Erro ao desabilitar 2FA');
    }

    return await this.parseJsonSafely(response);
  }

  // Verificar se usuário está logado
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Obter usuário atual
  async getCurrentUser(): Promise<User | null> {
    if (!this.accessToken) return null;

    try {
      const response = await this.authenticatedRequest(`${API_BASE_URL}/profile/`);
      
      if (response.ok) {
        return await this.parseJsonSafely(response);
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    }

    return null;
  }
}

export default new DjangoApiService();
