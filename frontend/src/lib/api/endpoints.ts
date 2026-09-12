import { REQUEST_TIMEOUT_MS } from '@/lib/constants';
import { http, throwIfApiError } from '@/lib/api/client';
import { mockApi } from '@/lib/api/mocks';
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

export function mocksEnabled(): boolean {
  return import.meta.env.VITE_USE_MOCKS === 'true';
}

export interface RecommendOptions {
  geminiKey?: string;
}

export const api = {
  async getHealth(): Promise<HealthResponse> {
    if (mocksEnabled()) return mockApi.getHealth();
    try {
      const { data } = await http.get<HealthResponse>('/api/health');
      return data;
    } catch (error) {
      throwIfApiError(error);
    }
  },

  async getConfig(): Promise<ConfigResponse> {
    if (mocksEnabled()) return mockApi.getConfig();
    try {
      const { data } = await http.get<ConfigResponse>('/api/config');
      return data;
    } catch (error) {
      throwIfApiError(error);
    }
  },

  async getPopulationStats(): Promise<PopulationStatsResponse> {
    if (mocksEnabled()) return mockApi.getPopulationStats();
    try {
      const { data } = await http.get<PopulationStatsResponse>('/api/population-stats');
      return data;
    } catch (error) {
      throwIfApiError(error);
    }
  },

  async predict(body: PredictRequest): Promise<PredictResponse> {
    if (mocksEnabled()) return mockApi.predict(body);
    try {
      const { data } = await http.post<PredictResponse>('/api/predict', body);
      return data;
    } catch (error) {
      throwIfApiError(error);
    }
  },

  async recommend(
    body: RecommendRequest,
    options: RecommendOptions = {},
  ): Promise<RecommendResponse> {
    if (mocksEnabled()) return mockApi.recommend(body);
    try {
      const { data } = await http.post<RecommendResponse>('/api/recommend', body, {
        timeout: REQUEST_TIMEOUT_MS.recommend,
        headers: options.geminiKey
          ? { 'X-Gemini-Api-Key': options.geminiKey }
          : undefined,
      });
      return data;
    } catch (error) {
      throwIfApiError(error);
    }
  },

  async report(body: ReportRequest): Promise<Blob> {
    if (mocksEnabled()) return mockApi.report(body);
    try {
      const { data } = await http.post<Blob>('/api/report', body, {
        responseType: 'blob',
        timeout: REQUEST_TIMEOUT_MS.report,
      });
      return data;
    } catch (error) {
      throwIfApiError(error);
    }
  },

  async feedback(body: FeedbackRequest): Promise<FeedbackResponse> {
    if (mocksEnabled()) return mockApi.feedback(body);
    try {
      const { data } = await http.post<FeedbackResponse>('/api/feedback', body);
      return data;
    } catch (error) {
      throwIfApiError(error);
    }
  },
};
