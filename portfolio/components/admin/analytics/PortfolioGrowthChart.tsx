'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartContainer } from './ChartContainer';
import type { GrowthPoint } from '@/lib/analytics/queries';

export interface PortfolioGrowthChartProps {
  data: GrowthPoint[];
}

function formatMonth(month: string) {
  const [year, m] = month.split('-');
  const date = new Date(Number(year), Number(m) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'short' });
}

export function PortfolioGrowthChart({ data }: PortfolioGrowthChartProps) {
  const isEmpty = data.length === 0 || data.every((d) => d.count === 0);

  return (
    <ChartContainer
      title="Portfolio growth"
      description="Content items added per month"
      isEmpty={isEmpty}
      emptyLabel="No content added yet"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent-500)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-accent-500)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonth}
            tick={{ fill: 'var(--color-faint)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: 'var(--color-faint)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            cursor={{ stroke: 'var(--color-border)' }}
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              fontSize: 12,
              color: 'var(--color-ink)',
            }}
            labelFormatter={(label) => formatMonth(String(label))}
          />
          <Area
            type="monotone"
            dataKey="count"
            name="Items added"
            stroke="var(--color-accent-500)"
            strokeWidth={2}
            fill="url(#growthFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
