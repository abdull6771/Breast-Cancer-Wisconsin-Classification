import { http, HttpResponse } from 'msw';
import { mockApi } from '@/lib/api/mocks';
import type {
  FeedbackRequest,
  PredictRequest,
  RecommendRequest,
  ReportRequest,
} from '@/types/api';

export const handlers = [
  http.get('/api/health', async () => {
    return HttpResponse.json(await mockApi.getHealth());
  }),
  http.get('/api/config', async () => {
    return HttpResponse.json(await mockApi.getConfig());
  }),
  http.get('/api/population-stats', async () => {
    return HttpResponse.json(await mockApi.getPopulationStats());
  }),
  http.post('/api/predict', async ({ request }) => {
    const body = (await request.json()) as PredictRequest;
    return HttpResponse.json(await mockApi.predict(body));
  }),
  http.post('/api/recommend', async ({ request }) => {
    const body = (await request.json()) as RecommendRequest;
    return HttpResponse.json(await mockApi.recommend(body));
  }),
  http.post('/api/report', async ({ request }) => {
    const body = (await request.json()) as ReportRequest;
    const blob = await mockApi.report(body);
    return new HttpResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="medical_report.pdf"',
      },
    });
  }),
  http.post('/api/feedback', async ({ request }) => {
    const body = (await request.json()) as FeedbackRequest;
    return HttpResponse.json(await mockApi.feedback(body));
  }),
];
