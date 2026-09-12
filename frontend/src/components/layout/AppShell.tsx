import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DisclaimerBanner } from '@/components/common/DisclaimerBanner';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { useSessionStore } from '@/store/session';

export function AppShell() {
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const persistedCollapsed = useSessionStore((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = useSessionStore((state) => state.setSidebarCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  const iconRail = !isMobile && (!isDesktop || persistedCollapsed);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="flex min-h-screen bg-canvas">
      <div
        className={cn(
          'z-40 md:static',
          isMobile ? 'fixed inset-y-0 left-0' : 'relative',
          isMobile && !mobileOpen && 'pointer-events-none',
        )}
      >
        <div
          className={cn(
            'h-full transition-transform duration-clinical md:translate-x-0',
            mobileOpen || !isMobile ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <Sidebar collapsed={isMobile ? false : iconRail} />
        </div>
      </div>

      {isMobile && mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-navy/40 md:hidden"
          aria-label="Close navigation"
          onClick={() => {
            setMobileOpen(false);
          }}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onToggleSidebar={() => {
            if (isMobile) {
              setMobileOpen((open) => !open);
              return;
            }
            if (isDesktop) {
              setSidebarCollapsed(!persistedCollapsed);
            }
          }}
        />
        <DisclaimerBanner />
        <main className="flex-1 px-4 py-8 md:px-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mx-auto w-full max-w-workstation"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
