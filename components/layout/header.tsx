"use client";

import { useState, useEffect } from "react";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/app/api/api";
import { Toaster, toast } from "sonner";
import { useAuth, checkSession } from "@/lib/auth";
import { usePathname } from "next/navigation";
export function Header() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [usuario, setUsuario] = useState();
  const pathname = usePathname();
  console.log(pathname);

  const handleLogout = async () => {
    try {
      const res = await api("/user/logout", {
        method: "POST",
      });
      if (res.ok) {
        toast.success("Logout realizado com sucesso");
        router.push("/login/login");
        router.refresh();
      } else {
        toast.error("Erro ao fazer logout");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
    }
  };

  useEffect(() => {
    async function verifySession() {
      const user = await checkSession();
      if (user === null) {
        router.push("/login/login");
      }
      if (user) {
        setUser(user);
        setUsuario(user.email);
      } else {
        toast.error("Não autorizado, redirecionando para login");
        router.push("/login/login");
      }
    }
    verifySession();
  }, [router, setUser]);

  return (
    <header className="border-bottom bg-white">
      <div className="d-flex align-items-center justify-content-between px-4 h-16">
        <div className="d-flex align-items-center">
          <Toaster />
          {pathname === "/dashboard" && (
            <h5 className="mb-0 ms-0 text-muted fw-bold text-uppercase  px-3 py-2 shadow-sm bg-light rounded">
              Dashboard
            </h5>
          )}
          {pathname === "/dashboard/products/list" && (
            <h5 className="mb-0 ms-0 text-muted fw-bold text-uppercase  px-3 py-2  ">
              Produtos
            </h5>
          )}
          {pathname === "/dashboard/clients/list" && (
            <h5 className="mb-0 ms-0 text-muted fw-bold text-uppercase  px-3 py-2  ">
              Clientes
            </h5>
          )}
          {pathname === "/dashboard/requests/list" && (
            <h5 className="mb-0 ms-0 text-muted fw-bold text-uppercase  px-3 py-2  ">
              Pedidos
            </h5>
          )}
          {pathname.match(/^\/dashboard\/requests\/\d+$/) && (
            <h5 className="mb-0 ms-0 text-muted fw-bold text-uppercase px-3 py-2">
              Itens pedido
            </h5>
          )}
           {pathname === "/dashboard/requests/closed" && (
            <h5 className="mb-0 ms-0 text-muted fw-bold text-uppercase  px-3 py-2  ">
              Pedidos finalizados
            </h5>
          )}
 {pathname === "/dashboard/sales/list" && (
            <h5 className="mb-0 ms-0 text-muted fw-bold text-uppercase  px-3 py-2  ">
              Vendas pendentes
            </h5>
          )}






        </div>

        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <a
              className="btn btn-link text-gray-700 me-2 d-flex align-items-center"
              href="#"
              style={{ textDecoration: "none" }}
            >
              <User className="me-2 h-4 w-4" />
              {/* Perfil */}
              {usuario}
            </a>
            <a
              className="btn btn-link text-gray-700 d-flex align-items-center"
              href="#"
              onClick={handleLogout}
              style={{ textDecoration: "none" }}
            >
              <LogOut className="me-2 h-4 w-4" /> Sair
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
