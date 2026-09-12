import { generateMedicalReportPdf } from '@/features/reports/generateMedicalReport';
import { FEATURES } from '@/lib/constants';
import {
  MOCK_CONFIG,
  MOCK_HEALTH,
  MOCK_POPULATION,
  SAMPLE_BENIGN_MARKDOWN,
  SAMPLE_MALIGNANT_MARKDOWN,
} from '@/mocks/fixtures';
import type {
  ConfigResponse,
  FeedbackRequest,
  FeedbackResponse,
  HealthResponse,
  PopulationStatsResponse,
  PredictRequest,
  PredictResponse,
  RecommendRequest,
  RecommendResponse,
  ReportRequest,
} from '@/types/api';

const CONTRIBUTION_WEIGHTS = [0.35, 0.55, 0.48, 0.28, 0.22, 0.4, 0.38, 0.18];
const recordedFeedback: FeedbackRequest[] = [];

function delay(ms = 420): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function classify(features: number[]): PredictResponse {
  const score = features.reduce((sum, value, index) => {
    const weight = CONTRIBUTION_WEIGHTS[index] ?? 0;
    return sum + weight * (value - 4);
  }, 0);

  const contributions = features.map((value, index) => {
    const weight = CONTRIBUTION_WEIGHTS[index] ?? 0;
    return Number((weight * (value - 4)).toFixed(2));
  });

  const malignant = score > 0;
  return {
    diagnosis: malignant ? 'MALIGNANT' : 'BENIGN',
    message: malignant ? 'The tumor is MALIGNANT' : 'The tumor is BENIGN',
    contributions,
    featureNames: FEATURES.map((feature) => feature.shortLabel),
  };
}

function createMockPdf(request: ReportRequest): Blob {
  return generateMedicalReportPdf({
    features: request.features,
    predictionText: request.predictionText,
    recommendation: request.recommendation,
  });
}

export const mockApi = {
  async getHealth(): Promise<HealthResponse> {
    await delay(180);
    return MOCK_HEALTH;
  },

  async getConfig(): Promise<ConfigResponse> {
    await delay(180);
    return MOCK_CONFIG;
  },

  async getPopulationStats(): Promise<PopulationStatsResponse> {
    await delay(280);
    return MOCK_POPULATION;
  },

  async predict(body: PredictRequest): Promise<PredictResponse> {
    await delay(700);
    return classify(body.features);
  },

  async recommend(body: RecommendRequest): Promise<RecommendResponse> {
    await delay(900);
    const malignant = body.diagnosis.toUpperCase().includes('MALIGNANT');
    return {
      markdown: malignant ? SAMPLE_MALIGNANT_MARKDOWN : SAMPLE_BENIGN_MARKDOWN,
    };
  },

  async report(body: ReportRequest): Promise<Blob> {
    await delay(600);
    return createMockPdf(body);
  },

  async feedback(body: FeedbackRequest): Promise<FeedbackResponse> {
    await delay(400);
    recordedFeedback.push(body);
    return { ok: true };
  },
};
