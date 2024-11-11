'use client';

import { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from "@/app/api/api"
import { toast } from 'sonner';

export function Header() {
  const router = useRouter();
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
  return (
    <header className="border-bottom bg-white">
      <div className="d-flex align-items-center justify-content-between px-4 h-16">
        <div className="d-flex align-items-center">
          {/* <h1 className="me-4">Meu Sistema</h1> Conteúdo à esquerda */}
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
              {/* {session.user?.name ? session.user.name : 'Profile'} */}
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
