'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/app-layout';
import { SplashScreen } from '@/components/splash-screen';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login page
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
    
    // Redirect to dashboard if authenticated and on login page
    if (isAuthenticated && pathname === '/login') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, pathname, router]);

  // If on login page, don't show app layout
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Show app layout for authenticated users
  return (
    <SplashScreen>
      <AppLayout>
        <div className="p-4 md:p-8">{children}</div>
      </AppLayout>
    </SplashScreen>
  );
}
