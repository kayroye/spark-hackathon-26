'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function NurseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isNurse, loading } = useAuth();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Redirect to patient portal if not a nurse
    if (!isNurse) {
      router.push('/my-referrals');
      return;
    }
  }, [isAuthenticated, isNurse, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 dark:text-teal-400" />
      </div>
    );
  }

  // Don't render children until auth is confirmed
  if (!isAuthenticated || !isNurse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 dark:text-teal-400" />
      </div>
    );
  }

  return <>{children}</>;
}
