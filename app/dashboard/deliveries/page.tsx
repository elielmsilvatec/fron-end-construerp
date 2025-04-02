"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/app/api/api";
import { User, BadgeDollarSign, TruckIcon } from "lucide-react";
import { Alert } from "@/components/ui/alert";

interface Request {
  id: number;
  num_pedido: number;
  cliente_pedido: number; // Adicione a propriedade cliente_pedido
}

interface Cliente {
  id: number;
  nome: string;
}

interface Sale {
  id: number;
  numero_pedido: number;
  data_venda: string;
  tipo_pagamento: string;
  quant_parcelas: number;
  valor_total_venda: number;
  entrega: number;
  data_entrega: string;
  obs: string | null;
  fechado: number;
  desconto: number;
  taxas: number;
  lucro: number;
  id_pedido: number;
}

interface ApiResponse {
  venda_finalizada: Sale[];
  pedido: Request[];
  cliente: Cliente[];
}

const EntregaList: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntregas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api("/entrega/entregas");

        if (!response.ok) {
          throw new Error(`Erro ao buscar entregas: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        setSales(data.venda_finalizada);
        setRequests(data.pedido);
        setClients(data.cliente);
      } catch (err) {
        setError((err as Error).message);
        console.error("Erro ao buscar entregas:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntregas();
  }, []);

  if (isLoading) {
    return <div>Carregando entregas...</div>;
  }

  if (error) {
    return <div>Erro ao carregar entregas: {error}</div>;
  }

  if (sales.length === 0) {
    return <div>Nenhuma entrega pendente.</div>;
  }

  return (
    <>
      {/* <Alert className="mb-4" variant="default">
        Visualizar{" "}
        <a href={`/dashboard/deliveries/finalized/${id}`} className="alert-link">
         entregas finalizadas
        </a>
        .
      </Alert> */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.isArray(sales) &&
          sales.map((sale) => {
            // Encontrar o pedido correspondente
            const request = requests.find((req) => req.id === sale.id);

            // Encontrar o cliente correspondente
            const cliente = clients.find(
              (c) => c.id === request?.cliente_pedido // Usar encadeamento opcional
            );
            const nomeCliente = cliente ? cliente.nome : "";

            return (
              <Card
                key={sale.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  <User className="h-6 w-6 text-blue-500" />
                  <CardTitle className="text-lg font-semibold">
                    {nomeCliente}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-2">ID: {sale.id}</p>
                  <p className="text-gray-600 mb-2">
                    Data da Venda:{" "}
                    {new Date(sale.data_venda).toLocaleDateString("pt-BR")}
                  </p>

                  <p className="text-gray-600 mb-2">
                    Número do Pedido: {sale.numero_pedido}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(sale.valor_total_venda)}
                  </p>

                  <a
                    href={`/dashboard/deliveries/${sale.id_pedido}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="flex items-center gap-2 cursor-pointer justify-center ">
                      <TruckIcon className="text-blue-500" />
                      <span className="text-blue-500">Visualizar entrega</span>
                    </div>
                  </a>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </>
  );
};

export default EntregaList;