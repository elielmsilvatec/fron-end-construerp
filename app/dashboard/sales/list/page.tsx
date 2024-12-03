"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/app/api/api";
import { User, PackageOpenIcon, BadgeDollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Requests {
  id: number;
  num_pedido: number;
  status?: number;
  valor_total_pedido?: string;
  cliente_pedido: number;
}
interface Clients {
  id: number;
  nome: string;
  telefone: string;
  cep?: string;
  rua?: string;
  numero?: number;
  bairro?: string;
  cidade?: string;
  observacoes?: string;
}

export default function Sales() {
  const [clients, setClients] = useState<Clients[]>([]);
  const [requests, setRequests] = useState<Requests[]>([]);
  const router = useRouter();

  // Função reutilizável para buscar os pedidos e clientes
  const fetchRequests = async () => {
    try {
      const response = await api("/venda/pedido/buscar");
      const data = await response.json();
      setRequests(data.pedidos);
      setClients(data.clientes);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  useEffect(() => {
    fetchRequests(); // Chama a função quando o componente é montado
  }, []);

 

  return (
    <>
     

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.isArray(requests) &&
          requests.map((request) => {
            const valor_pedido = parseFloat(request.valor_total_pedido || "");

            // Encontrar o cliente correspondente
            const cliente = clients.find(
              (c) => c.id === request.cliente_pedido
            );
            const nomeCliente = cliente ? cliente.nome : "....";

            return (
              <Card
                key={request.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  <User className="h-6 w-6 text-blue-500" />
                  <CardTitle className="text-lg font-semibold">
                    {nomeCliente}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">Pedido ID: {request.id}</p>
                  <p className="text-gray-400 mb-2">
                    Número do Pedido: {request.num_pedido}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(valor_pedido)}
                  </p>

                  <a
                    href={`/dashboard/requests/${request.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="flex items-center gap-2 cursor-pointer justify-center ">
                      <BadgeDollarSign className="text-blue-500" />
                      <span className="text-blue-500">Finalizar venda</span>
                    </div>
                  </a>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </>
  );
}
