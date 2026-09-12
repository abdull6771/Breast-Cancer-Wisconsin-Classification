import { CHART_CATEGORIES, FEATURES } from '@/lib/constants';
import type {
  ConfigResponse,
  HealthResponse,
  PopulationStatsResponse,
  PredictResponse,
} from '@/types/api';

export const MOCK_HEALTH: HealthResponse = {
  status: 'ok',
  service: 'bcw-clinical-mock',
};

export const MOCK_CONFIG: ConfigResponse = {
  geminiConfigured: true,
};

export const MOCK_POPULATION: PopulationStatsResponse = {
  categories: [...CHART_CATEGORIES],
  benign: [2.956, 1.325, 1.443, 1.365, 2.12, 2.1, 1.29, 1.063],
  malignant: [7.195, 6.573, 6.56, 5.548, 5.299, 5.979, 5.863, 2.589],
};

export const SAMPLE_BENIGN_FEATURES = [3, 1, 1, 1, 2, 2, 1, 1] as const;
export const SAMPLE_MALIGNANT_FEATURES = [8, 10, 10, 8, 7, 9, 7, 4] as const;

const FEATURE_NAMES = FEATURES.map((feature) => feature.shortLabel);

export const SAMPLE_BENIGN_PREDICTION: PredictResponse = {
  diagnosis: 'BENIGN',
  message: 'The tumor is BENIGN',
  featureNames: FEATURE_NAMES,
  contributions: [-0.35, -1.65, -1.44, -0.84, -0.44, -0.8, -1.14, -0.54],
};

export const SAMPLE_MALIGNANT_PREDICTION: PredictResponse = {
  diagnosis: 'MALIGNANT',
  message: 'The tumor is MALIGNANT',
  featureNames: FEATURE_NAMES,
  contributions: [1.4, 3.3, 2.88, 1.12, 0.66, 2.0, 1.14, 0.0],
};

export const SAMPLE_BENIGN_MARKDOWN = `## What this indication means

The model indicated a **benign** pattern based on the eight Fine Needle Aspirate (FNA) scores you entered. In the Wisconsin Breast Cancer dataset, lower and more uniform scores (typically 1–3) are more often observed in benign samples.

This is **not a clinical diagnosis**. It is an educational classification produced by a research model.

## Suggested next steps to discuss

1. Review the smear and clinical context with a qualified pathologist or oncologist.
2. Confirm whether additional imaging (mammography, ultrasound) or a repeat biopsy is warranted.
3. Compare these scores against the laboratory’s own cytopathology report.

## Treatment topics for a clinical conversation

- Observation versus short-interval follow-up
- Whether any imaging findings need correlation
- When to repeat sampling if symptoms change

**Disclaimer:** This text is generated for educational use and is **not medical advice**. Decisions about care must be made with a licensed clinician.
`;

export const SAMPLE_MALIGNANT_MARKDOWN = `## What this indication means

The model indicated a **malignant** pattern based on the eight Fine Needle Aspirate (FNA) scores you entered. Higher scores (often 7–10), especially for cell size, cell shape, chromatin, and nucleoli, are more frequently observed in malignant samples in the Wisconsin dataset.

This is **not a clinical diagnosis**. It is an educational classification produced by a research model.

## Suggested next steps to discuss

1. Urgent review with a breast specialist, oncologist, or multidisciplinary team.
2. Correlation with imaging, histology, receptor studies, and staging work-up as clinically indicated.
3. Confirmation that the FNA scores match the official pathology interpretation.

## Treatment topics for a clinical conversation

- Diagnostic confirmation (core biopsy / surgical pathology)
- Staging studies and tumor-board review
- Surgery, systemic therapy, and radiation as options — only as topics to raise with a physician

**Disclaimer:** This text is generated for educational use and is **not medical advice**. Decisions about care must be made with a licensed clinician.
`;
