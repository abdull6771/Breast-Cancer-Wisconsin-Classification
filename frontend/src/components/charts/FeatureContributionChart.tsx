import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatScore } from '@/lib/formatters';
import { sortContributions } from '@/features/xai/sortContributions';
import { EmptyState } from '@/components/common/EmptyState';

interface FeatureContributionChartProps {
  contributions: number[] | null;
  featureNames: string[];
}

export function FeatureContributionChart({
  contributions,
  featureNames,
}: FeatureContributionChartProps) {
  if (!contributions) {
    return (
      <EmptyState
        title="Visual explanation is not available for this model type."
        description="The classifier did not return feature contributions. The diagnosis indication above is still available."
      />
    );
  }

  const rows = sortContributions(featureNames, contributions);

  return (
    <div>
      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ left: 16, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--line))" />
            <XAxis
              type="number"
              tick={{ fill: 'hsl(var(--muted))', fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fill: 'hsl(var(--ink))', fontSize: 11 }}
            />
            <Tooltip
              formatter={(value) => [
                typeof value === 'number' ? formatScore(value) : String(value),
                'Contribution',
              ]}
            />
            <ReferenceLine x={0} stroke="hsl(var(--muted))" />
            <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
              {rows.map((row) => (
                <Cell
                  key={row.name}
                  fill={row.contribution >= 0 ? '#B91C1C' : '#15803D'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-center text-xs leading-5 text-muted">
        Positive values suggest Malignancy, negative suggest Benign.
      </p>
    </div>
  );
}
