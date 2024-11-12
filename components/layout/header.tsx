'use client';

import { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from "@/app/api/api"
import { Toaster, toast } from 'sonner';
import { useAuth, checkSession } from "@/lib/auth";

export function Header() {
  const router = useRouter();
  const { setUser } = useAuth();
const [usuario , setUsuario] = useState()
  const handleLogout = async () => {
    try {
      const res = await api('/user/logout', {
        method: 'POST',
      });
      if (res.ok) {
        toast.success('Logout realizado com sucesso');
        router.push('/login/login');
        router.refresh();
      } else {
        toast.error('Erro ao fazer logout');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor');
    }
  };

  useEffect(() => {
    async function verifySession() {   
      const user = await checkSession();    
      if( user === null){
        router.push('/login/login');
      }
      if (user) {
        setUser(user);
        setUsuario(user.email)      
      } else {
        toast.error('Não autorizado, redirecionando para login');
        router.push('/login/login');
      }
    }
    verifySession();
  }, [router, setUser]);


  return (
    <header className="border-bottom bg-white">
      <div className="d-flex align-items-center justify-content-between px-4 h-16">
        <div className="d-flex align-items-center">
          {/* <h1 className="me-4">Meu Sistema</h1> Conteúdo à esquerda */}
          <Toaster />
        </div>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <a
              className="btn btn-link text-gray-700 me-2 d-flex align-items-center"
              href="#"
              style={{ textDecoration: 'none' }}
            >
              <User className="me-2 h-4 w-4" />
              {/* Perfil */}
              { usuario}
            </a>
            <a
              className="btn btn-link text-gray-700 d-flex align-items-center"
              href="#"
              onClick={handleLogout}
              style={{ textDecoration: 'none' }}
            >
              <LogOut className="me-2 h-4 w-4" /> Sair
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
