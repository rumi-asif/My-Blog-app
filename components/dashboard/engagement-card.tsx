'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EngagementCardProps {
  title: string;
  current: number;
  previous: number;
  icon: React.ElementType;
  color: string;
}

export function EngagementCard({ title, current, previous, icon: Icon, color }: EngagementCardProps) {
  const change = current - previous;
  const changePercent = previous > 0 ? ((change / previous) * 100).toFixed(1) : (current > 0 ? '100.0' : '0.0');
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">{current.toLocaleString()}</div>
        <div className="flex items-center gap-2 text-sm">
          {isPositive && <TrendingUp className="h-4 w-4 text-green-600" />}
          {!isPositive && !isNeutral && <TrendingDown className="h-4 w-4 text-red-600" />}
          {isNeutral && <Minus className="h-4 w-4 text-gray-400" />}
          <span
            className={
              isPositive
                ? 'text-green-600'
                : !isNeutral
                ? 'text-red-600'
                : 'text-gray-400'
            }
          >
            {isPositive ? '+' : ''}
            {changePercent}%
          </span>
          <span className="text-gray-500 dark:text-gray-400">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
}

