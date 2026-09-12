import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/cn';

interface MarkdownClinicalNoteProps {
  markdown: string;
  className?: string;
}

export function MarkdownClinicalNote({ markdown, className }: MarkdownClinicalNoteProps) {
  return (
    <div
      className={cn(
        'prose-clinical max-w-none text-sm leading-7 text-ink',
        className,
      )}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h3 className="mb-3 mt-6 font-serif text-xl text-ink first:mt-0">{children}</h3>
          ),
          h2: ({ children }) => (
            <h3 className="mb-3 mt-6 font-serif text-xl text-ink first:mt-0">{children}</h3>
          ),
          h3: ({ children }) => (
            <h4 className="mb-2 mt-5 font-semibold text-ink first:mt-0">{children}</h4>
          ),
          p: ({ children }) => <p className="mb-3 text-sm leading-7 text-ink">{children}</p>,
          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1 pl-5 text-sm leading-7">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm leading-7">{children}</ol>
          ),
          strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
          a: ({ href, children }) => (
            <a href={href} className="text-teal underline underline-offset-2">
              {children}
            </a>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
