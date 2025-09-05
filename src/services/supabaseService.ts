import { supabase } from '../lib/supabase';
import { BankAccount, Transaction } from '../types';

export class SupabaseService {
  // Bank Account operations
  static async getBankAccount(): Promise<BankAccount | null> {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar conta bancária:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      // Converter do formato Supabase para o formato da aplicação
      return {
        id: data.id,
        currentBalance: Number(data.current_balance) || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao buscar conta bancária:', error);
      return null;
    }
  }

  static async createBankAccount(bankAccount: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<BankAccount | null> {
    try {
      // Primeiro, deletar qualquer conta existente
      await supabase.from('bank_accounts').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      const { data, error } = await supabase
        .from('bank_accounts')
        .insert({
          current_balance: bankAccount.currentBalance
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar conta bancária:', error);
        return null;
      }

      return {
        id: data.id,
        currentBalance: Number(data.current_balance) || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao criar conta bancária:', error);
      return null;
    }
  }

  static async updateBankAccount(bankAccount: BankAccount): Promise<BankAccount | null> {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .update({
          current_balance: bankAccount.currentBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', bankAccount.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar conta bancária:', error);
        return null;
      }

      return {
        id: data.id,
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
  static async getTransactions(): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar transações:', error);
        return [];
      }

      return data.map(transaction => ({
        id: transaction.id,
        date: transaction.date,
        type: transaction.type,
        amount: Number(transaction.amount) || 0,
        observations: transaction.observations,
        createdAt: transaction.created_at
      }));
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }
  }

  static async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          date: transaction.date,
          type: transaction.type,
          amount: transaction.amount,
          observations: transaction.observations
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar transação:', error);
        return null;
      }

      return {
        id: data.id,
        date: data.date,
        type: data.type,
        amount: Number(data.amount) || 0,
        observations: data.observations,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      return null;
    }
  }

  static async deleteTransaction(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar transação:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      return false;
    }
  }

  static async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction | null> {
    try {
      const updateData: any = {};
      if (transaction.date) updateData.date = transaction.date;
      if (transaction.type) updateData.type = transaction.type;
      if (transaction.amount !== undefined) updateData.amount = transaction.amount;
      if (transaction.observations !== undefined) updateData.observations = transaction.observations;

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar transação:', error);
        return null;
      }

      return {
        id: data.id,
        date: data.date,
        type: data.type,
        amount: Number(data.amount) || 0,
        observations: data.observations,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      return null;
    }
  }

  // Utility operations
  static async clearAllData(): Promise<boolean> {
    try {
      const { error: bankError } = await supabase.from('bank_accounts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error: transactionError } = await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (bankError || transactionError) {
        console.error('Erro ao limpar dados:', { bankError, transactionError });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      return false;
    }
  }

  // Real-time subscriptions
  static subscribeToTransactions(callback: (transaction: Transaction) => void) {
    return supabase
      .channel('transactions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const transaction = payload.new as any;
            callback({
              id: transaction.id,
              date: transaction.date,
              type: transaction.type,
              amount: Number(transaction.amount) || 0,
              observations: transaction.observations,
              createdAt: transaction.created_at
            });
          }
        }
      )
      .subscribe();
  }

  static subscribeToBankAccount(callback: (bankAccount: BankAccount) => void) {
    return supabase
      .channel('bank_accounts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bank_accounts' },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const bankAccount = payload.new as any;
            callback({
              id: bankAccount.id,
              currentBalance: Number(bankAccount.current_balance) || 0,
              createdAt: bankAccount.created_at,
              updatedAt: bankAccount.updated_at
            });
          }
        }
      )
      .subscribe();
  }
}
