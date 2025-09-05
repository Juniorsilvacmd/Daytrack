import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://flojrapvlpueanbpvdab.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsb2pyYXB2bHB1ZWFuYnB2ZGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTQzMDMsImV4cCI6MjA3MjU5MDMwM30.JmU9CGYlxvLrX0CnjGMNTtQ90w4NeMZ1Vm2wsg6I4CE';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para o Supabase
export interface Database {
  public: {
    Tables: {
             bank_accounts: {
         Row: {
           id: string;
           current_balance: number;
           created_at: string;
           updated_at: string;
         };
         Insert: {
           id?: string;
           current_balance: number;
           created_at?: string;
           updated_at?: string;
         };
         Update: {
           id?: string;
           current_balance?: number;
           created_at?: string;
           updated_at?: string;
         };
      };
      transactions: {
        Row: {
          id: string;
          date: string;
          type: 'gain' | 'loss';
          amount: number;
          observations?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          type: 'gain' | 'loss';
          amount: number;
          observations?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          type?: 'gain' | 'loss';
          amount?: number;
          observations?: string;
          created_at?: string;
        };
      };
    };
  };
}
