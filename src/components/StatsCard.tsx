import React from 'react';
import { Card, CardContent } from './ui/Card';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = 'neutral',
  className = ''
}) => {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 truncate">{title}</p>
            <p className={`text-2xl font-bold ${trendColors[trend]} mb-2 break-words`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ml-4 flex-shrink-0 ${trendColors[trend]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};