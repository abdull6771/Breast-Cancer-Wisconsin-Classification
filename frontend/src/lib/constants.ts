import type { FeatureDefinition, FeatureId } from '@/types/clinical';

export const APP_NAME = 'BCW Clinical';
export const APP_SUBTITLE = 'Wisconsin Classifier';

export const DISCLAIMER =
  'This application is designed for educational and research purposes only. It is NOT intended to replace professional medical diagnosis, advice, or treatment.';

export const FEATURE_COUNT = 8;
export const FEATURE_MIN = 1;
export const FEATURE_MAX = 10;

export const FEATURES: readonly FeatureDefinition[] = [
  {
    id: 'clumpThickness',
    index: 0,
    label: 'Clump Thickness',
    shortLabel: 'Clump Thickness',
    recommendKey: 'Clump Thickness',
    definition: 'How tightly epithelial cells cluster together on the FNA smear.',
    highScoreHint:
      'A high score typically indicates dense, cohesive cell aggregates more often associated with malignancy.',
  },
  {
    id: 'uniformityCellSize',
    index: 1,
    label: 'Uniformity of Cell Size',
    shortLabel: 'Cell Size',
    recommendKey: 'Cell Size',
    definition: 'How consistent cell dimensions are across the sampled field.',
    highScoreHint:
      'Marked variation in cell size is a common cytologic feature of malignant lesions.',
  },
  {
    id: 'uniformityCellShape',
    index: 2,
    label: 'Uniformity of Cell Shape',
    shortLabel: 'Cell Shape',
    recommendKey: 'Cell Shape',
    definition: 'How consistent cell morphology is across the sampled field.',
    highScoreHint:
      'Irregular or heterogeneous shapes are more typical of malignant cells than of benign epithelium.',
  },
  {
    id: 'marginalAdhesion',
    index: 3,
    label: 'Marginal Adhesion',
    shortLabel: 'Marginal Adhesion',
    recommendKey: 'Marginal Adhesion',
    definition: 'How well cells adhere to one another at their margins.',
    highScoreHint:
      'Reduced adhesion (higher score) can indicate loss of normal cell-to-cell cohesion.',
  },
  {
    id: 'singleEpithelialCellSize',
    index: 4,
    label: 'Single Epithelial Cell Size',
    shortLabel: 'Epith. Cell Size',
    recommendKey: 'Epithelial Size',
    definition: 'Size of individual epithelial cells relative to expected norms.',
    highScoreHint:
      'Enlarged epithelial cells may reflect increased nuclear and cytoplasmic activity.',
  },
  {
    id: 'blandChromatin',
    index: 5,
    label: 'Bland Chromatin',
    shortLabel: 'Bland Chromatin',
    recommendKey: 'Bland Chromatin',
    definition: 'Texture and uniformity of nuclear chromatin on the smear.',
    highScoreHint:
      'Coarse or irregular chromatin is more often observed in malignant nuclei.',
  },
  {
    id: 'normalNucleoli',
    index: 6,
    label: 'Normal Nucleoli',
    shortLabel: 'Normal Nucleoli',
    recommendKey: 'Normal Nucleoli',
    definition: 'Prominence and number of nucleoli within the nucleus.',
    highScoreHint:
      'Prominent or multiple nucleoli are frequently associated with malignancy.',
  },
  {
    id: 'mitoses',
    index: 7,
    label: 'Mitoses',
    shortLabel: 'Mitoses',
    recommendKey: 'Mitoses',
    definition: 'Observed rate of mitotic figures (cell division) in the sample.',
    highScoreHint:
      'Frequent mitotic figures suggest higher proliferative activity.',
  },
] as const;

export const FEATURE_IDS: readonly FeatureId[] = FEATURES.map((feature) => feature.id);

export const CHART_CATEGORIES = FEATURES.map((feature) => feature.shortLabel);

export const CHART_COLORS = {
  patient: '#2E86C1',
  malignant: '#E74C3C',
  benign: '#2ECC71',
} as const;

export const SCALE_LEGEND = [
  { range: '1–3', label: 'Benign-leaning', tone: 'benign' as const },
  { range: '4–6', label: 'Intermediate', tone: 'warning' as const },
  { range: '7–10', label: 'Malignant-leaning', tone: 'malignant' as const },
] as const;

export const DATASET_CITATION =
  'Wolberg, W. H., & Mangasarian, O. L. (1990). Multisurface method of pattern separation for medical diagnosis applied to breast cytology. Proceedings of the National Academy of Sciences, 87(23), 9193–9196.';

export const DATASET_NOTES = {
  source: 'UCI Machine Learning Repository — Breast Cancer Wisconsin (Original)',
  instances: 699,
  classes: 'Benign (coded 2) / Malignant (coded 4)',
  excludedFeature: 'Bare Nuclei is intentionally excluded from this model’s inputs.',
};

export const DEFAULT_FORM_VALUES = {
  clumpThickness: 1,
  uniformityCellSize: 1,
  uniformityCellShape: 1,
  marginalAdhesion: 1,
  singleEpithelialCellSize: 1,
  blandChromatin: 1,
  normalNucleoli: 1,
  mitoses: 1,
} as const;

export const REQUEST_TIMEOUT_MS = {
  default: 20_000,
  recommend: 45_000,
  report: 45_000,
} as const;
