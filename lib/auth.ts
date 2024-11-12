import { create } from 'zustand';
import api from "@/app/api/api"
interface User {
  id: number;
  nome: string;
  email: string;
  cargo: string;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export async function checkSession() {
  try {
    const res = await api('/session-info', {

    });

    if (!res.ok && res.status != 200 ) {
      // throw new Error('Não autorizado');  
      return null;   
    }

    const data = await res.json();
    return data.user;
  } catch (error) {
    return null;
  }
}