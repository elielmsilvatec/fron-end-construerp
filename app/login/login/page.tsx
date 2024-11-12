"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from 'sonner';
import { useAuth } from "@/lib/auth";
import Link from "next/link"
import api from "@/app/api/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api('/user/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          senha: password,
        }),
      });

      const data = await res.json();

      if (data.user && data.message == "Login bem-sucedido") {
        setUser(data.user);
        toast.success("Login realizado com sucesso!");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Erro ao fazer login");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor", {
        duration: 5000 // Ajuste a duração para 5 segundos
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
     
      <div className="w-100" style={{ maxWidth: "400px" }}>
       
        <div className="card border-0 shadow">
         
          <div className="card-body">
           
            <h2 className="text-center mb-4">Faça seu Login</h2>{" "}
           
           {/* mensagens Toast */}
            <Toaster />
    

            <form onSubmit={handleSubmit}>
             
              <div className="mb-3">
               
                <label htmlFor="inputEmail" className="form-label">
                  Email:
                </label>{" "}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  required
                  disabled={isLoading}
                />{" "}
              </div>{" "}
              <div className="mb-3">
               
                <label htmlFor="inputPassword" className="form-label">
                  Senha:
                </label>{" "}
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  required
                  disabled={isLoading}
                />{" "}
              </div>{" "}
              <div className="form-check mb-3">
               
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMeCheck"
                />{" "}
                <label className="form-check-label" htmlFor="rememberMeCheck">
                 
                  Lembrar minha senha{" "}
                </label>{" "}
              </div>{" "}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isLoading}
              >
               
                {isLoading ? "Entrando..." : "Entrar"}{" "}
              </button>{" "}
            </form>{" "}
            <div className="text-center text-sm text-gray-600">
             
              <div className="text-center mt-3">
               
                <Link href="/login/create"> Cadastre-se</Link>{" "}
              </div>{" "}
              <p>Email: teste@gmail.com</p> <p>Senha: 123</p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { Lock, Mail } from 'lucide-react';
// import { useAuth } from '@/lib/auth';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();
//   const { setUser } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const res = await fetch('http://localhost:5000/user/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           email,
//           senha: password,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setUser(data.user);
//         toast.success('Login realizado com sucesso!');
//         router.push('/dashboard');
//       } else {
//         toast.error(data.message || 'Erro ao fazer login');
//       }
//     } catch (error) {
//       toast.error('Erro ao conectar com o servidor');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
//           <CardDescription className="text-center">
//             Entre com suas credenciais para acessar o sistema
//           </CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="seu@email.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Senha</Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button
//               type="submit"
//               className="w-full"
//               disabled={isLoading}
//             >
//               {isLoading ? 'Entrando...' : 'Entrar'}
//             </Button>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   );
// }
