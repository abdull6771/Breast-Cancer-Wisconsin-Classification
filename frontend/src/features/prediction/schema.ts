import { z } from 'zod';
import { FEATURE_MAX, FEATURE_MIN } from '@/lib/constants';

const score = z
  .number({ required_error: 'Required', invalid_type_error: 'Enter an integer score' })
  .int('Score must be a whole number')
  .min(FEATURE_MIN, `Minimum score is ${String(FEATURE_MIN)}`)
  .max(FEATURE_MAX, `Maximum score is ${String(FEATURE_MAX)}`);

export const analyzeSchema = z.object({
  clumpThickness: score,
  uniformityCellSize: score,
  uniformityCellShape: score,
  marginalAdhesion: score,
  singleEpithelialCellSize: score,
  blandChromatin: score,
  normalNucleoli: score,
  mitoses: score,
});

export const feedbackSchema = z.object({
  userCorrection: z.enum(['Benign', 'Malignant'], {
    required_error: 'Select the actual diagnosis',
  }),
  comments: z.string().trim().min(1, 'Clinical notes are required'),
});
