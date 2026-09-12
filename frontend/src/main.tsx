import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Providers } from '@/app/providers';
import { AppRouter } from '@/app/router';
import { useThemeStore } from '@/store/theme';
import './styles/tokens.css';
import './index.css';

useThemeStore.getState();

async function enableMsw(): Promise<void> {
  if (import.meta.env.VITE_USE_MSW !== 'true') return;
  const { worker } = await import('@/mocks/browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

void enableMsw().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <Providers>
        <AppRouter />
      </Providers>
    </StrictMode>,
  );
});
