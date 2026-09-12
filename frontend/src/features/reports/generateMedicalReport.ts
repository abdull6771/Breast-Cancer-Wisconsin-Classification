import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  APP_NAME,
  APP_SUBTITLE,
  DATASET_CITATION,
  DATASET_NOTES,
  DISCLAIMER,
  FEATURES,
} from '@/lib/constants';
import { meanScore, patternLean, scoreTone } from '@/lib/formatters';
import { MOCK_POPULATION } from '@/mocks/fixtures';
import type { Diagnosis } from '@/types/api';

export interface MedicalReportInput {
  features: number[];
  predictionText: string;
  recommendation?: string;
  diagnosis?: Diagnosis;
  contributions?: number[] | null;
  featureNames?: string[];
  analyzedAt?: string;
}

const NAVY: [number, number, number] = [15, 44, 76];
const TEAL: [number, number, number] = [15, 118, 110];
const BENIGN: [number, number, number] = [21, 128, 61];
const MALIGNANT: [number, number, number] = [185, 28, 28];
const MUTED: [number, number, number] = [71, 85, 105];
const INK: [number, number, number] = [15, 23, 42];
const LINE: [number, number, number] = [226, 220, 213];
const CANVAS: [number, number, number] = [247, 244, 239];
const WARNING_BG: [number, number, number] = [251, 243, 231];
const WARNING: [number, number, number] = [122, 75, 18];
const MARGIN = 16;
const PAGE_BOTTOM = 278;

function toPdfText(value: string): string {
  return value
    .replaceAll('’', "'")
    .replaceAll('‘', "'")
    .replaceAll('“', '"')
    .replaceAll('”', '"')
    .replaceAll('–', '-')
    .replaceAll('—', '-')
    .replaceAll('…', '...')
    .replaceAll('•', '-')
    .replace(/[^\u0020-\u007E\n]/g, '');
}

function markdownToPlain(markdown: string): string {
  return toPdfText(markdown)
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '- ')
    .replace(/^\s*\d+\.\s+/gm, (match) => match.trimStart())
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function inferDiagnosis(predictionText: string): Diagnosis {
  return predictionText.toUpperCase().includes('MALIGNANT') ? 'MALIGNANT' : 'BENIGN';
}

function bandLabel(value: number): string {
  const tone = scoreTone(value);
  if (tone === 'benign') return '1-3 Benign-leaning';
  if (tone === 'warning') return '4-6 Intermediate';
  return '7-10 Malignant-leaning';
}

function formatWhen(iso?: string): string {
  const date = iso ? new Date(iso) : new Date();
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
}

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const lines: unknown = doc.splitTextToSize(text, maxWidth);
  if (!Array.isArray(lines)) return [text];
  return lines.filter((line): line is string => typeof line === 'string');
}

function reportId(iso?: string): string {
  const date = iso ? new Date(iso) : new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
  ].join('');
  return `BCW-${stamp}`;
}

export function generateMedicalReportPdf(input: MedicalReportInput): Blob {
  const diagnosis = input.diagnosis ?? inferDiagnosis(input.predictionText);
  const benign = diagnosis === 'BENIGN';
  const diagnosisColor = benign ? BENIGN : MALIGNANT;
  const lean = patternLean(input.features);
  const mean = meanScore(input.features);
  const highCount = input.features.filter((value) => value >= 7).length;
  const lowCount = input.features.filter((value) => value <= 3).length;
  const generatedAt = formatWhen();
  const analyzedAt = formatWhen(input.analyzedAt);
  const id = reportId(input.analyzedAt);

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const width = doc.internal.pageSize.getWidth();
  const contentWidth = width - MARGIN * 2;
  let y = 0;

  const addHeader = () => {
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, width, 22, 'F');
    doc.setFillColor(...TEAL);
    doc.rect(0, 22, width, 1.2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(APP_NAME, MARGIN, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(APP_SUBTITLE.toUpperCase(), MARGIN, 16);
    doc.setFontSize(8);
    doc.text('Educational research report', width - MARGIN, 10, { align: 'right' });
    doc.text(id, width - MARGIN, 16, { align: 'right' });
    y = 32;
  };

  const addFooter = (page: number, pages: number) => {
    doc.setDrawColor(...LINE);
    doc.line(MARGIN, 285, width - MARGIN, 285);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(
      'Confidential educational material. Not a medical record. Not a medical device.',
      MARGIN,
      290,
    );
    doc.text(`Page ${String(page)} of ${String(pages)}`, width - MARGIN, 290, {
      align: 'right',
    });
  };

  const tableEndY = (): number => {
    const tableDoc = doc as jsPDF & { lastAutoTable?: { finalY: number } };
    return tableDoc.lastAutoTable?.finalY ?? y;
  };

  const ensureSpace = (needed: number) => {
    if (y + needed <= PAGE_BOTTOM) return;
    doc.addPage();
    addHeader();
  };

  const sectionTitle = (index: string, title: string) => {
    ensureSpace(14);
    doc.setTextColor(...TEAL);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(index, MARGIN, y);
    doc.setTextColor(...INK);
    doc.setFontSize(12);
    doc.text(title, MARGIN + 10, y);
    y += 4;
    doc.setDrawColor(...LINE);
    doc.line(MARGIN, y, width - MARGIN, y);
    y += 6;
  };

  const paragraph = (text: string, size = 9, color: [number, number, number] = MUTED) => {
    const clean = toPdfText(text);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = wrapText(doc, clean, contentWidth);
    for (const line of lines) {
      ensureSpace(6);
      doc.text(line, MARGIN, y);
      y += 4.6;
    }
    y += 2;
  };

  addHeader();

  doc.setTextColor(...INK);
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.text('Fine Needle Aspirate Classification Report', MARGIN, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text('Breast Cancer Wisconsin (Original) eight-feature model', MARGIN, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    theme: 'plain',
    styles: { fontSize: 8, textColor: INK, cellPadding: 1.6 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: MUTED, cellWidth: 38 },
      1: { cellWidth: 49 },
      2: { fontStyle: 'bold', textColor: MUTED, cellWidth: 38 },
      3: { cellWidth: 49 },
    },
    body: [
      ['Report ID', id, 'Generated', generatedAt],
      ['Analysis time', analyzedAt, 'Specimen', 'FNA cytology scores (1-10)'],
      ['Model inputs', '8 biomarkers', 'Excluded feature', 'Bare Nuclei (by design)'],
      ['Dataset', 'Wisconsin Original, 699 samples', 'Use', 'Education / research only'],
    ],
    margin: { left: MARGIN, right: MARGIN },
  });
  y = tableEndY() + 8;

  ensureSpace(28);
  doc.setFillColor(...WARNING_BG);
  doc.roundedRect(MARGIN, y, contentWidth, 22, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...WARNING);
  doc.text('NOT A CLINICAL DIAGNOSIS', MARGIN + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const notice = wrapText(
    doc,
    'This report is for educational and research use only. It is not a medical diagnosis, medical record, or treatment recommendation. Consult a qualified clinician.',
    contentWidth - 8,
  );
  doc.text(notice, MARGIN + 4, y + 11);
  y += 30;

  sectionTitle('01', 'Model indication');
  ensureSpace(32);
  doc.setFillColor(...diagnosisColor);
  doc.roundedRect(MARGIN, y, contentWidth, 28, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('MODEL INDICATION', MARGIN + 5, y + 8);
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.text(toPdfText(input.predictionText), MARGIN + 5, y + 18);
  y += 34;

  paragraph(
    benign
      ? 'What this means: the eight Fine Needle Aspirate scores more closely resemble benign patterns observed in the Wisconsin Breast Cancer dataset. This classification is indicated by the model for educational use. A qualified clinician must interpret the actual smear, imaging, and clinical context.'
      : 'What this means: the eight Fine Needle Aspirate scores more closely resemble malignant patterns observed in the Wisconsin Breast Cancer dataset. This classification is indicated by the model for educational use. A qualified clinician must interpret the actual smear, imaging, and clinical context.',
    9,
    INK,
  );

  sectionTitle('02', 'Case summary');
  autoTable(doc, {
    startY: y,
    theme: 'grid',
    head: [['Measure', 'Value', 'Interpretation']],
    body: [
      ['Mean biomarker score', mean.toFixed(2), lean.label],
      ['Scores in 1-3 range', String(lowCount), 'Generally benign-leaning cytologic scores'],
      ['Scores in 7-10 range', String(highCount), 'Typically malignant-leaning cytologic scores'],
      [
        'Pattern intensity',
        `${lean.intensity.toFixed(0)} / 100`,
        'Educational lean only - not a calibrated probability',
      ],
    ],
    styles: { fontSize: 8, textColor: INK, lineColor: LINE, lineWidth: 0.2 },
    headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: CANVAS },
    margin: { left: MARGIN, right: MARGIN },
  });
  y = tableEndY() + 10;

  sectionTitle('03', 'Patient metrics');
  paragraph(
    'Each biomarker is scored from 1 (least atypical) to 10 (most atypical) on Fine Needle Aspirate cytology. Values 1-3 are generally benign-leaning, 4-6 intermediate, and 7-10 typically malignant-leaning.',
  );
  autoTable(doc, {
    startY: y,
    theme: 'grid',
    head: [['#', 'Biomarker', 'Score', 'Scale band', 'Clinician-facing definition']],
    body: FEATURES.map((feature, index) => {
      const value = input.features[index] ?? 1;
      return [
        String(index + 1),
        feature.label,
        `${value.toFixed(0)} / 10`,
        bandLabel(value),
        toPdfText(feature.definition),
      ];
    }),
    styles: { fontSize: 8, textColor: INK, lineColor: LINE, lineWidth: 0.2, valign: 'middle' },
    headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: CANVAS },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 42, fontStyle: 'bold' },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 36 },
      4: { cellWidth: 68 },
    },
    margin: { left: MARGIN, right: MARGIN },
  });
  y = tableEndY() + 10;

  sectionTitle('04', 'Population comparison');
  paragraph(
    'Patient scores compared with mean benign and malignant profiles from the Wisconsin Breast Cancer Original dataset (Bare Nuclei excluded). Averages are educational reference points, not diagnostic cut-offs.',
  );
  autoTable(doc, {
    startY: y,
    theme: 'grid',
    head: [['Feature', 'Patient', 'Avg benign', 'Avg malignant', 'Closer to']],
    body: FEATURES.map((feature, index) => {
      const patient = input.features[index] ?? 1;
      const avgBenign = MOCK_POPULATION.benign[index] ?? 0;
      const avgMalignant = MOCK_POPULATION.malignant[index] ?? 0;
      const closer =
        Math.abs(patient - avgBenign) <= Math.abs(patient - avgMalignant)
          ? 'Benign mean'
          : 'Malignant mean';
      return [
        feature.shortLabel,
        patient.toFixed(0),
        avgBenign.toFixed(2),
        avgMalignant.toFixed(2),
        closer,
      ];
    }),
    styles: { fontSize: 8, textColor: INK, lineColor: LINE, lineWidth: 0.2 },
    headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: CANVAS },
    margin: { left: MARGIN, right: MARGIN },
  });
  y = tableEndY() + 10;

  sectionTitle('05', 'Model explanation');
  if (input.contributions && input.contributions.length === 8) {
    paragraph(
      'Feature contributions estimated from the classifier. Positive values lean toward malignancy; negative values lean toward benign. This is an educational explanation, not a complete causal account of the smear.',
    );
    const names = input.featureNames ?? FEATURES.map((feature) => feature.shortLabel);
    const rows = names
      .map((name, index) => ({
        name,
        contribution: input.contributions?.[index] ?? 0,
      }))
      .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
    autoTable(doc, {
      startY: y,
      theme: 'grid',
      head: [['Feature', 'Contribution', 'Suggested direction']],
      body: rows.map((row) => [
        row.name,
        row.contribution.toFixed(2),
        row.contribution >= 0 ? 'Malignant' : 'Benign',
      ]),
      styles: { fontSize: 8, textColor: INK, lineColor: LINE, lineWidth: 0.2 },
      headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: CANVAS },
      margin: { left: MARGIN, right: MARGIN },
    });
    y = tableEndY() + 10;
  } else {
    paragraph('Visual explanation is not available for this model type.');
  }

  sectionTitle('06', 'AI recommendation');
  if (input.recommendation && input.recommendation.trim().length > 0) {
    paragraph(
      'The following note is generated for educational discussion. It is not medical advice and must not be used to start, stop, or change treatment.',
    );
    paragraph(markdownToPlain(input.recommendation), 9, INK);
  } else {
    paragraph('No AI recommendation was attached to this analysis.');
  }

  sectionTitle('07', 'Methods and citation');
  paragraph(
    `${DATASET_NOTES.source}. ${String(DATASET_NOTES.instances)} samples. ${DATASET_NOTES.classes}. ${DATASET_NOTES.excludedFeature}`,
  );
  paragraph(DATASET_CITATION, 8, MUTED);

  sectionTitle('08', 'Disclaimer and attestation');
  paragraph(DISCLAIMER, 9, INK);
  paragraph(
    'The predictions made by this system should be used as supplementary educational information only and must be validated by licensed medical practitioners. This document is not part of a medical record and does not constitute an order, referral, or diagnosis.',
    9,
    INK,
  );
  ensureSpace(28);
  doc.setDrawColor(...LINE);
  doc.line(MARGIN, y + 8, MARGIN + 70, y + 8);
  doc.line(MARGIN + 90, y + 8, width - MARGIN, y + 8);
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text('Reviewed for educational discussion', MARGIN, y + 13);
  doc.text('Date', MARGIN + 90, y + 13);

  const total = doc.getNumberOfPages();
  for (let page = 1; page <= total; page += 1) {
    doc.setPage(page);
    addFooter(page, total);
  }

  return doc.output('blob');
}
