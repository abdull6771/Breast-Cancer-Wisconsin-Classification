import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DATASET_CITATION, DATASET_NOTES, DISCLAIMER, FEATURES } from '@/lib/constants';

export function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="About / Disclaimer"
        title="Educational use and dataset notes"
        description="BCW Clinical is a research workstation built on the Wisconsin Breast Cancer (Original) dataset. It is not a medical device."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Intended use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted">
            <p>{DISCLAIMER}</p>
            <p>
              Predictions should be treated as supplementary educational information only
              and must be validated by licensed medical practitioners. Never claim this
              output as a diagnosis.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wisconsin Breast Cancer Dataset</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted">
            <p>
              <span className="font-medium text-ink">Source. </span>
              {DATASET_NOTES.source}
            </p>
            <p>
              <span className="font-medium text-ink">Instances. </span>
              {String(DATASET_NOTES.instances)} samples. {DATASET_NOTES.classes}.
            </p>
            <p>
              <span className="font-medium text-ink">Model inputs. </span>
              {DATASET_NOTES.excludedFeature}
            </p>
            <blockquote className="border-l-2 border-teal pl-4 text-ink">
              {DATASET_CITATION}
            </blockquote>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eight FNA biomarkers</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {FEATURES.map((feature, index) => (
                <li key={feature.id} className="text-sm leading-6">
                  <span className="font-tabular text-xs text-teal">
                    0{String(index + 1)}
                  </span>
                  <span className="ml-2 font-medium text-ink">{feature.label}</span>
                  <span className="ml-2 text-muted">{feature.definition}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
