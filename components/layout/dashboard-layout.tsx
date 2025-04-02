// DASHBOARD-LEYOUT.TSX
'use client';

import { useRouter } from 'next/navigation';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth, checkSession } from "@/lib/auth";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    async function verifySession() {
      const user = await checkSession();    
      if( user === null){
        router.push('/login/login');
        console.log("Usuario"  ,  user)
      }
      if (user) {
        setUser(user);      
      } else {
        toast.error('Não autorizado, redirecionando para login');
        router.push('/login/login');
      }
    }
    verifySession();
  }, [router, setUser]);


  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4" >
          {children}
        </main>
      </div>
    </div>
  );
}