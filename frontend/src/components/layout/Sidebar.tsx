import { NavLink } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  ClipboardPlus,
  FileText,
  Info,
  LayoutDashboard,
  MessageSquareWarning,
  Settings,
} from 'lucide-react';
import { APP_NAME, APP_SUBTITLE } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { useSessionStore } from '@/store/session';

const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/analyze', label: 'Analyze', icon: ClipboardPlus },
  { to: '/results', label: 'Results', icon: Activity },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/feedback', label: 'Feedback', icon: MessageSquareWarning },
  { to: '/about', label: 'About', icon: Info },
] as const;

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const lastAnalysis = useSessionStore((state) => state.lastAnalysis);

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-line bg-[#0F2C4C] text-white transition-[width] duration-clinical',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div className={cn('border-b border-white/10', collapsed ? 'px-3 py-5' : 'px-5 py-6')}>
        <p
          className={cn(
            'font-serif tracking-tight',
            collapsed ? 'text-center text-sm' : 'text-xl',
          )}
        >
          {collapsed ? 'BCW' : APP_NAME}
        </p>
        {!collapsed ? (
          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/55">
            {APP_SUBTITLE}
          </p>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Primary">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={'end' in item ? item.end : false}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-clinical',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-white/12 text-white'
                  : 'text-white/70 hover:bg-white/8 hover:text-white',
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden />
            {!collapsed ? (
              <span className="flex-1">
                {item.label}
                {item.to === '/results' && lastAnalysis ? (
                  <span className="sr-only">, last analysis available</span>
                ) : null}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <NavLink
          to="/settings"
          title={collapsed ? 'Settings' : undefined}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors duration-clinical hover:bg-white/8 hover:text-white',
              collapsed && 'justify-center px-0',
              isActive && 'bg-white/12 text-white',
            )
          }
        >
          <Settings className="h-4 w-4 shrink-0" aria-hidden />
          {!collapsed ? <span>Settings</span> : null}
        </NavLink>
        {!collapsed ? (
          <p className="mt-3 px-3 text-[11px] leading-4 text-white/40">
            Educational workstation. Not a medical device.
          </p>
        ) : null}
      </div>
    </aside>
  );
}
