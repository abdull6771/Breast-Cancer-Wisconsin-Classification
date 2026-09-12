import { cn } from '@/lib/cn';

interface SectionHeaderProps {
  index?: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ index, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      <div className="flex items-baseline gap-3">
        {index ? (
          <span className="font-tabular text-xs font-semibold tracking-[0.14em] text-teal">
            {index}
          </span>
        ) : null}
        <h2 className="font-serif text-xl text-ink md:text-[22px]">{title}</h2>
      </div>
      {description ? (
        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-muted">{description}</p>
      ) : null}
    </div>
  );
}
