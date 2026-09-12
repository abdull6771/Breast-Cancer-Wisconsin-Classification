import { motion } from 'framer-motion';
import { OctagonAlert, ShieldCheck } from 'lucide-react';
import { DISCLAIMER } from '@/lib/constants';
import type { Diagnosis } from '@/types/api';

interface DiagnosisBannerProps {
  diagnosis: Diagnosis;
  message: string;
}

export function DiagnosisBanner({ diagnosis, message }: DiagnosisBannerProps) {
  const benign = diagnosis === 'BENIGN';

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      role="status"
      aria-live="polite"
      className={
        benign
          ? 'rounded-card bg-[#15803D] px-6 py-8 text-white shadow-card md:px-8 md:py-10'
          : 'rounded-card bg-[#B91C1C] px-6 py-8 text-white shadow-card md:px-8 md:py-10'
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
        Model indication
      </p>
      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15"
          aria-hidden
        >
          {benign ? (
            <ShieldCheck className="h-8 w-8" />
          ) : (
            <OctagonAlert className="h-8 w-8" />
          )}
        </div>
        <div>
          <h2 className="font-serif text-4xl leading-none tracking-tight md:text-5xl">
            {message}
          </h2>
          <p className="sr-only">
            The model indicated {diagnosis}. This is not a clinical diagnosis.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/90 md:text-base">
            {benign
              ? 'What this means: the entered FNA scores more closely resemble benign patterns in the Wisconsin dataset. This is indicated by the model for educational use — consult a qualified clinician.'
              : 'What this means: the entered FNA scores more closely resemble malignant patterns in the Wisconsin dataset. This is indicated by the model for educational use — consult a qualified clinician.'}
          </p>
        </div>
      </div>
      <p className="mt-6 border-t border-white/20 pt-4 text-xs leading-5 text-white/80">
        {DISCLAIMER}
      </p>
    </motion.section>
  );
}
