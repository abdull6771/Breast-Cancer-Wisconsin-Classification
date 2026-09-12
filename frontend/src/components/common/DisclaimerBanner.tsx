import { ShieldAlert } from 'lucide-react';
import { DISCLAIMER } from '@/lib/constants';

export function DisclaimerBanner() {
  return (
    <div
      role="note"
      className="border-b border-warning/20 bg-[#FBF3E7] px-4 py-2.5 dark:border-warning/30 dark:bg-[#2A1F12]"
    >
      <p className="mx-auto flex max-w-workstation items-start gap-2 text-xs leading-5 text-[#7A4B12] dark:text-[#E8C48A] md:text-[13px]">
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>
          <span className="font-semibold tracking-wide">Educational use only. </span>
          {DISCLAIMER}
        </span>
      </p>
    </div>
  );
}
