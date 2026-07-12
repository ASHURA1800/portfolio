'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';
import type { DistributionSlice } from '@/lib/analytics/queries';

export interface ContentDistributionChartProps {
  data: DistributionSlice[];
}

// Reuses the two brand hues + a spread of opacities rather than inventing
// a new categorical palette.
const COLORS = [
  'var(--color-accent-500)',
  'var(--color-accent2-500)',
  'var(--color-accent-300)',
  'var(--color-accent2-400)',
  'var(--color-accent-700)',
  'var(--color-accent2-600)',
  'var(--color-accent-400)',
];

export function ContentDistributionChart({ data }: ContentDistributionChartProps) {
  const isEmpty = data.length === 0;

  return (
    <ChartContainer
      title="Content distribution"
      description="Live items by section"
      isEmpty={isEmpty}
      emptyLabel="No content yet"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              fontSize: 12,
              color: 'var(--color-ink)',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={32}
            wrapperStyle={{ fontSize: 11, color: 'var(--color-faint)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
