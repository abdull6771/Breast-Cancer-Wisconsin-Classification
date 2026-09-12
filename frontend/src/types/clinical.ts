import type { Diagnosis } from '@/types/api';

export type FeatureId =
  | 'clumpThickness'
  | 'uniformityCellSize'
  | 'uniformityCellShape'
  | 'marginalAdhesion'
  | 'singleEpithelialCellSize'
  | 'blandChromatin'
  | 'normalNucleoli'
  | 'mitoses';

export interface FeatureDefinition {
  id: FeatureId;
  index: number;
  label: string;
  shortLabel: string;
  recommendKey: string;
  definition: string;
  highScoreHint: string;
}

export interface AnalysisSession {
  features: number[];
  diagnosis: Diagnosis;
  message: string;
  contributions: number[] | null;
  featureNames: string[];
  analyzedAt: string;
}

export interface AnalyzeFormValues {
  clumpThickness: number;
  uniformityCellSize: number;
  uniformityCellShape: number;
  marginalAdhesion: number;
  singleEpithelialCellSize: number;
  blandChromatin: number;
  normalNucleoli: number;
  mitoses: number;
}

export interface FeedbackFormValues {
  userCorrection: 'Benign' | 'Malignant';
  comments: string;
}
