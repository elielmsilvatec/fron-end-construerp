"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/app/api/api";
import { User, PackageOpenIcon, FullscreenIcon } from "lucide-react";

interface Clients {
  id: number;
  nome: string;
}

interface Sales {
  id: number | string;
  data_venda: string;
  valor_total_venda: number;
  id_pedido: number | undefined;
}

interface Request {
  id: number;
  num_pedido: number;
  cliente_pedido: number | null | undefined;
}

export default function Sales() {
  const [clients, setClients] = useState<Clients[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [sales, setSales] = useState<Sales[]>([]);
  const [data_inicial, setDataInicial] = useState<string>("");
  const [data_final, setDataFinal] = useState<string>("");
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [erroMsg, setErroMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api("/venda/vendas_finalizadas");
      const data = await response.json();

      if (data && data.venda_finalizada && data.clientes && data.pedidos) {
        console.log("Clientes:", data.clientes);
        console.log("Vendas:", data.venda_finalizada);
        console.log("Pedidos:", data.pedidos);
        setSales(data.venda_finalizada);
        setRequests(data.pedidos);
        setClients(data.clientes);
      } else {
        setErroMsg("Dados recebidos do servidor inválidos");
      }

      setIsFiltered(false);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setErroMsg("Erro ao buscar dados do servidor");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      const response = await api("/venda/vendas_finalizadas/buscar", {
        method: "POST",
        body: JSON.stringify({ data_inicial, data_final }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Data Filtered-->>>>>", data);

      if (data.error) {
        setErroMsg(data.error);
        handleClearFilters();
      } else {
        if (data && data.venda_finalizada) {
          setSales(data.venda_finalizada);
        } else {
          setErroMsg("Dados recebidos do servidor inválidos");
        }
        setIsFiltered(true);
        setErroMsg("");
      }
    } catch (error) {
      console.error("Erro ao buscar dados filtrados:", error);
      setErroMsg("Erro ao buscar dados filtrados");
      handleClearFilters();
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setDataInicial("");
    setDataFinal("");
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getClientNameFromRequest = (requestId: number | undefined): string => {
    if (requestId === undefined) {
      return "Pedido não encontrado";
    }
    const request = requests.find((req) => req.id === requestId);
    if (!request) {
      return "Pedido não encontrado";
    }
    if (
      request.cliente_pedido === null ||
      request.cliente_pedido === undefined
    ) {
      // return "Cliente não definido";
       return "Cliente não informado"
    }
    const client = clients.find((c) => c.id === request.cliente_pedido);
    console.log(
      "Procurando Cliente ID:",
      request.cliente_pedido,
      "Cliente Encontrado:",
      client
    );
    return client ? client.nome : "Cliente não encontrado";
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  };

  const filteredSales = isFiltered ? sales : sales;

  return (
    <div>
      {erroMsg && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {erroMsg}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setErroMsg("")}
          ></button>
        </div>
      )}

      {/* Filtros */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="date"
          value={data_inicial}
          onChange={(e) => setDataInicial(e.target.value)}
          className="border rounded px-3 py-2"
          placeholder="Data Inicial"
        />
        <input
          type="date"
          value={data_final}
          onChange={(e) => setDataFinal(e.target.value)}
          className="border rounded px-3 py-2"
          placeholder="Data Final"
        />

        {isFiltered ? (
          <button
            onClick={handleClearFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Limpar Filtros"}
          </button>
        ) : (
          <button
            onClick={fetchFilteredData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Filtrar"}
          </button>
        )}
      </div>

      {/* Lista de vendas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSales.map((sale) => {
          const request = requests.find((req) => req.id === sale.id_pedido);
          console.log("Venda:", sale.id, "Pedido ID:", sale.id_pedido);
          return (
            <Card key={sale.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <User className="h-6 w-6 text-blue-500" />
                <CardTitle className="text-lg font-semibold">
                  {getClientNameFromRequest(sale.id_pedido)}
                  {/* <p>{sale.id_pedido}</p> */}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">
                  Data: {formatDateTime(sale.data_venda)}
                </p>
                <p className="text-lg font-bold text-green-600">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(sale.valor_total_venda)}
                </p>

                <a href={`/dashboard/sales/finalized/${sale.id_pedido}`} style={{ textDecoration: "none" }}>
                  <div className="flex items-center gap-2 cursor-pointer justify-center ">
                    <FullscreenIcon className="text-blue-500" />
                    <span className="text-blue-500">Vizualizar</span>
                  </div>
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
