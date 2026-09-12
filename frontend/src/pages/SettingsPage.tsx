import { PageHeader } from '@/components/layout/PageHeader';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/common/Skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useConfig } from '@/features/config/useConfig';
import { useHealth } from '@/features/config/useHealth';
import { mocksEnabled } from '@/lib/api/endpoints';
import { toApiFailure } from '@/lib/api/client';
import { useSessionStore } from '@/store/session';
import { useThemeStore } from '@/store/theme';

export function SettingsPage() {
  const config = useConfig();
  const health = useHealth();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const geminiKey = useSessionStore((state) => state.geminiKey);
  const setGeminiKey = useSessionStore((state) => state.setGeminiKey);
  const mocked = mocksEnabled();

  return (
    <div>
      <PageHeader
        eyebrow="Environment"
        title="Settings"
        description="Server configuration, optional Gemini key entry, and workstation appearance."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API connection</CardTitle>
            <CardDescription>
              The React client talks to FastAPI at <code>VITE_API_BASE_URL</code>. It
              never calls the Streamlit app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted">Mode: </span>
              {mocked ? 'Typed mock adapters' : 'Live HTTP'}
            </p>
            <p>
              <span className="text-muted">Base URL: </span>
              {import.meta.env.VITE_API_BASE_URL || '/ (Vite proxy)'}
            </p>
            {health.isPending ? (
              <Skeleton className="h-5 w-40" />
            ) : health.isError ? (
              <ErrorState
                title="Health check failed"
                message={toApiFailure(health.error).message}
                onRetry={() => {
                  void health.refetch();
                }}
              />
            ) : (
              <p>
                <span className="text-muted">Health: </span>
                {health.data.status} · {health.data.service}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gemini API key</CardTitle>
            <CardDescription>
              The key is loaded from the server environment. A field appears here only
              if the backend reports that the key is missing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {config.isPending ? (
              <Skeleton className="h-10 w-full" />
            ) : config.isError ? (
              <ErrorState
                title="Could not read server config"
                message={toApiFailure(config.error).message}
                onRetry={() => {
                  void config.refetch();
                }}
              />
            ) : config.data.geminiConfigured ? (
              <p className="text-sm text-teal">API key loaded from the server environment.</p>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="gemini-key">Gemini API key</Label>
                <Input
                  id="gemini-key"
                  type="password"
                  autoComplete="off"
                  value={geminiKey}
                  placeholder="Enter a key for this session only"
                  onChange={(event) => {
                    setGeminiKey(event.target.value);
                  }}
                />
                <p className="text-xs leading-5 text-muted">
                  Stored in memory for this tab only and sent as{' '}
                  <code>X-Gemini-Api-Key</code> on recommendation requests. Prefer
                  setting <code>GEMINI_API_KEY</code> on the FastAPI host.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Light theme is the clinical default. Dark theme stays medically quiet.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Label htmlFor="theme-toggle">Dark theme</Label>
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={() => {
                toggleTheme();
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
