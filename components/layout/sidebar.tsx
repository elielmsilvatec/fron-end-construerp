'use client';

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // Substitua por sua função 'cn' para concatenar classes
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { icon: "bi bi-grid-fill", label: "Dashboard", href: "/dashboard" },
  { icon: "bi bi-box-seam", label: "Produtos", href: "/dashboard/products/list" },
  { icon: "bi bi-people-fill", label: "Clientes", href: "/dashboard/clients/list" },
  { icon: "bi bi-cart-fill", label: "Pedidos", href: "/dashboard/requests/list" },
  { icon: "bi bi-cash-stack", label: "Vendas", href: "/dashboard/sales" },
  { icon: "bi bi-truck", label: "Entregas", href: "/dashboard/deliveries" },
  { icon: "bi bi-clipboard-check", label: "Relatórios", href: "/dashboard/reports" },
  { icon: "bi bi-cash-stack", label: "Financeiro", href: "/dashboard/financial" },
  { icon: "bi bi-people-fill", label: "Users", href: "/dashboard/users" },
  { icon: "bi bi-gear-fill", label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setCollapsed(false);
      } else {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Verifique o tamanho da tela ao carregar a página
    setIsMobile(window.innerWidth <= 768);
    setCollapsed(window.innerWidth <= 768);
  }, []);

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-dark-blue text-white",
        "h-screen",
        collapsed ? "w-16" : "w-64",
        "transition-width duration-200 ease-in-out"
      )}
    >
      <div className="flex items-center justify-between p-4">
        <h4 className={cn("font-semibold", collapsed && "hidden")}>
          ConstruERP
        </h4>
        <button
          type="button"
          className="h-8 w-8 rounded-full p-2 focus:outline-none"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="flex-1 px-2 overflow-y-auto">
        <div className="space-y-2 py-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none" }}
            >
              <button
                type="button"
                className={cn(
                  "w-full flex items-center justify-start gap-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
                  pathname === item.href ? "bg-blue-500 text-white" : "text-white hover:bg-gray-700",
                  collapsed ? "px-2" : "px-4",
                  "border-b-0"
                )}
              >
                <i className={cn("bi", item.icon, "h-5 w-5")} />
                {!collapsed && item.label}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
