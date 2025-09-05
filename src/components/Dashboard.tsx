import React from 'react';
import { 
  ComposedChart, 
  Bar, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { StatsCard } from './StatsCard';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';
import { DashboardStats } from '../types';
import { 
  Wallet, 
  Calendar, 
  TrendingUp, 
  Activity 
} from 'lucide-react';

interface DashboardProps {
  stats: DashboardStats;
  chartData: Array<{date: string, balance: number}>;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, chartData }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Saldo Atual"
          value={formatCurrency(stats.currentBalance)}
          icon={Wallet}
          trend={stats.currentBalance > 0 ? 'up' : stats.currentBalance < 0 ? 'down' : 'neutral'}
        />
        
        <StatsCard
          title="Resultado Hoje"
          value={formatCurrency(stats.dailyProfitLoss)}
          subtitle="Ganho/Perda do dia"
          icon={Calendar}
          trend={stats.dailyProfitLoss > 0 ? 'up' : stats.dailyProfitLoss < 0 ? 'down' : 'neutral'}
        />
        
        <StatsCard
          title="Acumulado do Mês"
          value={formatCurrency(stats.monthlyAccumulated)}
          subtitle="Resultado mensal"
          icon={TrendingUp}
          trend={stats.monthlyAccumulated > 0 ? 'up' : stats.monthlyAccumulated < 0 ? 'down' : 'neutral'}
        />
        
        <StatsCard
          title="Crescimento"
          value={formatPercentage(stats.growthPercentage)}
          subtitle={`${stats.totalTransactions} operações`}
          icon={Activity}
          trend={stats.growthPercentage > 0 ? 'up' : stats.growthPercentage < 0 ? 'down' : 'neutral'}
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução da Banca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  className="dark:stroke-gray-400"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#6b7280"
                  className="dark:stroke-gray-400"
                  fontSize={12}
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length > 0) {
                      return (
                        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
                          <p className="text-white font-medium">{`${label}/2025`}</p>
                          <p className="text-white">
                            Saldo: <span className="text-orange-400">{formatCurrency(payload[0].value)}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="balance" 
                  fill="url(#barGradient)"
                  radius={[0, 0, 0, 0]}
                  maxBarSize={8}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2 }}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};