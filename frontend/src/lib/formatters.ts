import { FEATURES } from '@/lib/constants';
import type { AnalyzeFormValues } from '@/types/clinical';
import type { Diagnosis } from '@/types/api';

export function featuresToArray(values: AnalyzeFormValues): number[] {
  return FEATURES.map((feature) => values[feature.id]);
}

export function arrayToFormValues(features: number[]): AnalyzeFormValues {
  return {
    clumpThickness: features[0] ?? 1,
    uniformityCellSize: features[1] ?? 1,
    uniformityCellShape: features[2] ?? 1,
    marginalAdhesion: features[3] ?? 1,
    singleEpithelialCellSize: features[4] ?? 1,
    blandChromatin: features[5] ?? 1,
    normalNucleoli: features[6] ?? 1,
    mitoses: features[7] ?? 1,
  };
}

export function featuresToRecord(features: number[]): Record<string, number> {
  return FEATURES.reduce<Record<string, number>>((acc, feature, index) => {
    acc[feature.recommendKey] = features[index] ?? 1;
    return acc;
  }, {});
}

export function formatScore(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function diagnosisLabel(diagnosis: Diagnosis): 'Benign' | 'Malignant' {
  return diagnosis === 'BENIGN' ? 'Benign' : 'Malignant';
}

export function scoreTone(value: number): 'benign' | 'warning' | 'malignant' {
  if (value <= 3) return 'benign';
  if (value <= 6) return 'warning';
  return 'malignant';
}

export function meanScore(features: number[]): number {
  if (features.length === 0) return 0;
  return features.reduce((sum, value) => sum + value, 0) / features.length;
}

export function patternLean(features: number[]): {
  label: string;
  tone: 'benign' | 'warning' | 'malignant';
  intensity: number;
} {
  const mean = meanScore(features);
  const intensity = Math.min(100, Math.max(0, ((mean - 1) / 9) * 100));
  if (mean <= 3) {
    return { label: 'Benign-leaning pattern', tone: 'benign', intensity };
  }
  if (mean <= 6) {
    return { label: 'Intermediate pattern', tone: 'warning', intensity };
  }
  return { label: 'Malignant-leaning pattern', tone: 'malignant', intensity };
}
