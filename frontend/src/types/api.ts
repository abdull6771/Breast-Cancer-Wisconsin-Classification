export type Diagnosis = 'BENIGN' | 'MALIGNANT';

export type UserCorrection = 'Benign' | 'Malignant';

export interface HealthResponse {
  status: 'ok' | 'degraded';
  service: string;
}

export interface ConfigResponse {
  geminiConfigured: boolean;
}

export interface PopulationStatsResponse {
  benign: number[];
  malignant: number[];
  categories: string[];
}

export interface PredictRequest {
  features: number[];
}

export interface PredictResponse {
  diagnosis: Diagnosis;
  message: string;
  contributions: number[] | null;
  featureNames: string[];
}

export interface RecommendRequest {
  diagnosis: string;
  features: Record<string, number>;
}

export interface RecommendResponse {
  markdown: string;
}

export interface ReportRequest {
  features: number[];
  predictionText: string;
  recommendation?: string;
}

export interface FeedbackRequest {
  inputs: number[];
  modelPrediction: string;
  userCorrection: UserCorrection;
  comments: string;
}

export interface FeedbackResponse {
  ok: true;
}

export type ApiErrorCode = 'timeout' | 'network' | 'http' | 'unknown';

export interface ApiFailure {
  code: ApiErrorCode;
  status?: number;
  message: string;
}
