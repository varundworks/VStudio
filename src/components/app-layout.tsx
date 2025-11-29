'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Plus, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', icon: Home },
    { href: '/invoices/new', icon: Plus, isCentral: true },
    { href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar with user info */}
      <header className="bg-card border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold">{user?.name}</h2>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 pb-24">{children}</main>

      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t z-10">
        <nav className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            if (link.isCentral) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="-mt-8"
                >
                  <div className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:bg-primary/90 transition-transform duration-200 hover:scale-110">
                     <Icon className="w-8 h-8" />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-md transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                <Icon className="w-6 h-6" />
              </Link>
            );
          })}
        </nav>
      </footer>
    </div>
  );
}
