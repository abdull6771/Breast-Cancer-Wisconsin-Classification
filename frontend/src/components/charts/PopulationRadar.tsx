import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CHART_CATEGORIES, CHART_COLORS } from '@/lib/constants';
import { formatScore } from '@/lib/formatters';
import { Skeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import type { PopulationStatsResponse } from '@/types/api';

interface PopulationRadarProps {
  patient?: number[] | null;
  stats?: PopulationStatsResponse;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
}

interface RadarRow {
  category: string;
  patient?: number;
  benign: number;
  malignant: number;
}

export function PopulationRadar({
  patient,
  stats,
  isLoading,
  errorMessage,
  onRetry,
}: PopulationRadarProps) {
  if (isLoading) {
    return <Skeleton className="h-[360px] w-full" />;
  }

  if (errorMessage) {
    return (
      <ErrorState
        title="Population comparison unavailable"
        message={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (!stats) {
    return (
      <EmptyState
        title="No population profile loaded"
        description="Typical benign and malignant averages will appear here once the analytics service is available."
      />
    );
  }

  const categories = stats.categories.length === 8 ? stats.categories : CHART_CATEGORIES;
  const data: RadarRow[] = categories.map((category, index) => ({
    category,
    patient: patient?.[index],
    benign: stats.benign[index] ?? 0,
    malignant: stats.malignant[index] ?? 0,
  }));

  return (
    <div>
      <div className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
            <PolarGrid stroke="hsl(var(--line))" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: 'hsl(var(--muted))', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ fill: 'hsl(var(--muted))', fontSize: 10 }}
            />
            <Tooltip
              formatter={(value, name) => [
                typeof value === 'number' ? formatScore(value) : String(value),
                String(name),
              ]}
            />
            <Legend />
            {patient ? (
              <Radar
                name="Current Patient"
                dataKey="patient"
                stroke={CHART_COLORS.patient}
                fill={CHART_COLORS.patient}
                fillOpacity={0.22}
                strokeWidth={2}
              />
            ) : null}
            <Radar
              name="Avg Malignant"
              dataKey="malignant"
              stroke={CHART_COLORS.malignant}
              fill="none"
              strokeDasharray="5 4"
              strokeWidth={2}
            />
            <Radar
              name="Avg Benign"
              dataKey="benign"
              stroke={CHART_COLORS.benign}
              fill="none"
              strokeDasharray="5 4"
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-center text-xs leading-5 text-muted">
        Compare the patient's pattern (Blue) against typical Benign (Green) and
        Malignant (Red) profiles.
      </p>
    </div>
  );
}
