'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { checkSession } from '@/lib/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const sessionUser = await checkSession();
      setUser(sessionUser);

      // definindo rotas publicas
      if (!sessionUser && pathname !== '/login/login' && pathname !== '/login/create') {
        router.replace('/login/login');
      } else if (sessionUser && pathname === '/login/login') {
        router.replace('/dashboard');
      }
    };

    checkAuth();
  }, [pathname, router, setUser]);

  return <>{children}</>;
}