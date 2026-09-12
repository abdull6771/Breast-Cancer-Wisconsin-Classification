import { Link } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useHealth } from '@/features/config/useHealth';
import { mocksEnabled } from '@/lib/api/endpoints';
import { useSessionStore } from '@/store/session';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const lastAnalysis = useSessionStore((state) => state.lastAnalysis);
  const health = useHealth();
  const mocked = mocksEnabled();
  const envLabel = mocked
    ? 'DEV · MOCK'
    : import.meta.env.DEV
      ? 'DEV'
      : 'PROD';

  const apiOk = health.data?.status === 'ok';

  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden lg:inline-flex"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button asChild variant="teal" size="sm">
          <Link to="/analyze">
            <Plus className="h-4 w-4" aria-hidden />
            New Analysis
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {lastAnalysis ? (
          <Badge
            variant={lastAnalysis.diagnosis === 'BENIGN' ? 'benign' : 'malignant'}
            className="hidden sm:inline-flex"
          >
            Last: {lastAnalysis.diagnosis}
          </Badge>
        ) : null}
        <Badge variant="outline" className="font-tabular">
          <span
            className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
              mocked || apiOk ? 'bg-teal' : 'bg-warning'
            }`}
            aria-hidden
          />
          {envLabel}
        </Badge>
        <ThemeToggle />
      </div>
    </header>
  );
}
