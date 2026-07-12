'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartContainer } from './ChartContainer';
import type { SkillsCategoryPoint } from '@/lib/analytics/queries';

export interface SkillsChartProps {
  data: SkillsCategoryPoint[];
}

export function SkillsChart({ data }: SkillsChartProps) {
  const isEmpty = data.length === 0;
  // Taller when there are more categories so bars don't get cramped.
  const height = Math.max(220, data.length * 42);

  return (
    <ChartContainer
      title="Skills by category"
      description="Average proficiency (0–100)"
      isEmpty={isEmpty}
      emptyLabel="No skills added yet"
      height={height}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-border)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: 'var(--color-faint)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fill: 'var(--color-ink)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={110}
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
            formatter={(value, _name, item) => {
              const count = (item?.payload as SkillsCategoryPoint | undefined)?.count ?? 0;
              return [`${value} avg · ${count} skill${count === 1 ? '' : 's'}`, 'Proficiency'];
            }}
          />
          <Bar dataKey="avgProficiency" fill="var(--color-accent-500)" radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
