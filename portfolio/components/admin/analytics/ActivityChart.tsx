'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartContainer } from './ChartContainer';
import type { ActivityPoint } from '@/lib/analytics/queries';

export interface ActivityChartProps {
  data: ActivityPoint[];
}

function formatDay(day: string) {
  const date = new Date(`${day}T00:00:00`);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function ActivityChart({ data }: ActivityChartProps) {
  const isEmpty = data.length === 0 || data.every((d) => d.count === 0);

  return (
    <ChartContainer
      title="Site activity"
      description="Analytics events, last 14 days"
      isEmpty={isEmpty}
      emptyLabel="No events recorded yet"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="day"
            tickFormatter={formatDay}
            interval={1}
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
            cursor={{ fill: 'var(--color-border)' }}
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              fontSize: 12,
              color: 'var(--color-ink)',
            }}
            labelFormatter={(label) =>
              new Date(`${String(label)}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
          />
          <Bar dataKey="count" name="Events" fill="var(--color-accent2-500)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
