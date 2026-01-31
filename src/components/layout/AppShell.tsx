'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { useAuth } from '@/contexts/AuthContext';

const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within an AppShell');
  }
  return context;
}

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();

  // Try to get auth state - will be null during initial SSR
  let isNurse = false;
  let isAuthenticated = false;

  try {
    const auth = useAuth();
    isNurse = auth.isNurse;
    isAuthenticated = auth.isAuthenticated;
  } catch {
    // AuthContext not available yet (during SSR)
  }

  // Determine if we should show the nurse shell (sidebar, header, bottom nav)
  const isLoginPage = pathname === '/login';
  const isPatientRoute = pathname?.startsWith('/my-referrals') ||
                         pathname?.startsWith('/appointments') ||
                         pathname?.startsWith('/request-callback') ||
                         pathname?.startsWith('/settings') && !isNurse;

  const showNurseShell = isAuthenticated && isNurse && !isLoginPage && !isPatientRoute;

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored !== null) {
      setIsCollapsed(stored === 'true');
    }
    setIsHydrated(true);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newValue));
      return newValue;
    });
  };

  // Prevent hydration mismatch by showing consistent initial state
  const sidebarCollapsed = isHydrated ? isCollapsed : false;

  // Login page and patient pages don't use the nurse shell
  if (isLoginPage || isPatientRoute || !showNurseShell) {
    return (
      <SidebarContext.Provider value={{ isCollapsed: sidebarCollapsed, toggleCollapse }}>
        {children}
      </SidebarContext.Provider>
    );
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed: sidebarCollapsed, toggleCollapse }}>
      {/* Desktop Sidebar - hidden on mobile, visible on md+ */}
      <div className="hidden md:block">
        <Sidebar isCollapsed={sidebarCollapsed} onToggleCollapse={toggleCollapse} />
      </div>

      {/* Main content area with sidebar offset on desktop */}
      <div
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
        }`}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
        </div>
      </div>

      {/* Mobile Bottom Nav - visible on mobile, hidden on md+ */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </SidebarContext.Provider>
  );
}
