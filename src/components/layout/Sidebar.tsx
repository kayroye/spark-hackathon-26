'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Plus, Settings, ChevronLeft, ChevronRight, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/theme';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const nurseNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scan', label: 'New Referral', icon: Plus },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  navItems?: NavItem[];
}

export function Sidebar({ isCollapsed, onToggleCollapse, navItems: navItemsProp }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isNurse } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Use provided items, otherwise default to nurse nav
  const navItems = navItemsProp ?? (isNurse ? nurseNavItems : []);

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen bg-sidebar-bg transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className={`flex items-center border-b border-sidebar-border px-4 py-4 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-sidebar-foreground-active whitespace-nowrap">
              ReferralLoop
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-lg px-3 py-2.5 transition-colors duration-200 ${
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-sidebar-foreground hover:bg-sidebar-border hover:text-sidebar-foreground-active'
                    } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        <div className={`border-t border-sidebar-border px-3 py-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div
            className={`flex items-center rounded-lg px-3 py-2.5 text-sidebar-foreground ${
              isCollapsed ? 'justify-center' : 'gap-3'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-sidebar-border flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-sidebar-foreground" />
            </div>
            {!isCollapsed && user && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-sidebar-foreground-active truncate">{user.name}</span>
                <span className="text-xs text-sidebar-foreground truncate">{user.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className={`border-t border-sidebar-border px-3 py-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {!isCollapsed && (
            <p className="text-xs font-medium text-sidebar-foreground uppercase tracking-wider mb-2 px-3">
              Theme
            </p>
          )}
          <ThemeToggle compact={isCollapsed} />
        </div>

        {/* Logout Button */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sidebar-foreground transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive ${
              isCollapsed ? 'justify-center' : 'gap-3'
            }`}
            title={isCollapsed ? 'Log out' : undefined}
            aria-label="Log out"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium whitespace-nowrap">Log Out</span>
            )}
          </button>
        </div>

        {/* Collapse Toggle Button */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <button
            onClick={onToggleCollapse}
            className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sidebar-foreground transition-colors duration-200 hover:bg-sidebar-border hover:text-sidebar-foreground-active ${
              isCollapsed ? 'justify-center' : 'gap-3'
            }`}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-medium whitespace-nowrap">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
