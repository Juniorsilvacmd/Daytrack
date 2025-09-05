import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { MonthlyReport } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface MonthlyReportsProps {
  reports: MonthlyReport[];
}

export const MonthlyReports: React.FC<MonthlyReportsProps> = ({ reports }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const filteredReports = reports.filter(report => report.year === selectedYear);
  const availableYears = [...new Set(reports.map(r => r.year))].sort((a, b) => b - a);

  const chartData = filteredReports.map(report => ({
    month: report.month.substring(0, 3),
    profit: report.netProfit,
    percentage: report.growthPercentage
  }));

  const exportToCSV = () => {
    const headers = ['Mês', 'Valor Inicial', 'Valor Final', 'Lucro Líquido', 'Crescimento %', 'Operações'];
    const csvContent = [
      headers.join(','),
      ...filteredReports.map(report => [
        `${report.month} ${report.year}`,
        report.initialValue.toFixed(2),
        report.finalValue.toFixed(2),
        report.netProfit.toFixed(2),
        report.growthPercentage.toFixed(2),
        report.transactionCount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-mensal-${selectedYear}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Year Filter and Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <Button variant="secondary" onClick={exportToCSV} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>

      {/* Charts */}
      {filteredReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal - {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
                  <XAxis dataKey="month" stroke="#6b7280" className="dark:stroke-gray-400" fontSize={12} />
                  <YAxis stroke="#6b7280" className="dark:stroke-gray-400" fontSize={12} tickFormatter={formatCurrency} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Lucro Líquido']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    className="dark:bg-gray-800 dark:border-gray-600"
                  />
                  <Bar 
                    dataKey="profit" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <Card key={`${report.month}-${report.year}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>{report.month} {report.year}</span>
                </CardTitle>
                {report.netProfit >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Valor Inicial:</span>
                  <span className="font-medium dark:text-white">{formatCurrency(report.initialValue)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Valor Final:</span>
                  <span className="font-medium dark:text-white">{formatCurrency(report.finalValue)}</span>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-600" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Lucro Líquido:</span>
                  <span className={`font-bold ${
                    report.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(report.netProfit)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Crescimento:</span>
                  <span className={`font-bold ${
                    report.growthPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatPercentage(report.growthPercentage)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Operações:</span>
                  <span className="font-medium dark:text-white">{report.transactionCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum relatório disponível para {selectedYear}</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Os relatórios são gerados automaticamente conforme você adiciona operações
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};