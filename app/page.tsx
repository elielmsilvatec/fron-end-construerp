'use client'


import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth, checkSession } from "@/lib/auth";

export default function Home() {

  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    async function verifySession() {
      const user = await checkSession();    
      if( user === null){
        router.push('/login/login');
        // console.log("Usuario"  ,  user)
      }
      // se estiver logado vai para dashboard
      if (user) {
        redirect('/dashboard');   
      } else {
        toast.error('Não autorizado, redirecionando para login');
        router.push('/login/login');
      }
    }
    verifySession();
  }, [router, setUser]);


  
}