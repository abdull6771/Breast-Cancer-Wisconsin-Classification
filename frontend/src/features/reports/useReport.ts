import { useMutation } from '@tanstack/react-query';
import { downloadBlob } from '@/lib/download';
import { generateMedicalReportPdf } from '@/features/reports/generateMedicalReport';
import { useSessionStore } from '@/store/session';
import type { ReportRequest } from '@/types/api';

export function useReport() {
  const markReportGenerated = useSessionStore((state) => state.markReportGenerated);

  return useMutation({
    mutationFn: (body: ReportRequest) => {
      const analysis = useSessionStore.getState().lastAnalysis;
      return Promise.resolve(
        generateMedicalReportPdf({
          features: body.features,
          predictionText: body.predictionText,
          recommendation: body.recommendation,
          diagnosis: analysis?.diagnosis,
          contributions: analysis?.contributions ?? null,
          featureNames: analysis?.featureNames,
          analyzedAt: analysis?.analyzedAt,
        }),
      );
    },
    onSuccess: (blob) => {
      downloadBlob(blob, 'medical_report.pdf');
      markReportGenerated();
    },
  });
}
