"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/app/api/api";
import { User, BadgeDollarSign } from "lucide-react";

interface Clients {
  id: number;
  nome: string;
}

interface Sales {
  id: number;
  cliente_id: number; // ID do cliente associado à venda
  data_venda: string;
  valor_total_venda: number;
}

export default function Sales() {
  const [clients, setClients] = useState<Clients[]>([]);
  const [sales, setSales] = useState<Sales[]>([]);
  const [data_inicial, setDataInicial] = useState<string>(""); // Estado para data inicial
  const [data_final, setDataFinal] = useState<string>(""); // Estado para data final
  const [isFiltered, setIsFiltered] = useState<boolean>(false); // Estado para saber se está filtrado
  const [erroMsg, setErroMsg] = useState<string>("");

  const fetchData = async () => {
    try {
      const response = await api("/venda/vendas_finalizadas");
      const data = await response.json();
      setSales(data.venda_finalizada || []);
      setClients(data.clientes || []);
      setIsFiltered(false); // Reseta o estado de filtro ao carregar os dados iniciais
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const fetchFilteredData = async () => {
    try {
      const response = await api("/venda/vendas_finalizadas/buscar", {
        method: "POST",
        body: JSON.stringify({ data_inicial, data_final }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Data-->>>>>", data);

      if (data.error) {
        setErroMsg(data.error);
        handleClearFilters();
      } else {
        setSales(data.venda_finalizada || []);
        setIsFiltered(true);
        setErroMsg("");
      }
    } catch (error) {
      console.error("Erro ao buscar dados filtrados:", error);
      handleClearFilters();
    }
  };

  const handleClearFilters = () => {
    setDataInicial("");
    setDataFinal("");
    fetchData();
  };

  useEffect(() => {
    fetchData(); // Carrega os dados iniciais ao montar o componente
  }, []);

  const getClientName = (clientId: number): string => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.nome : "Cliente não encontrado";
  };

  return (
    <div>

  {erroMsg && (
  <div className="alert alert-danger alert-dismissible fade show" role="alert">
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
          >
            Limpar Filtros
          </button>
        ) : (
          <button
            onClick={fetchFilteredData}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Filtrar
          </button>
        )}
      </div>

      {/* Lista de vendas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sales.map((sale) => (
          <Card key={sale.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <User className="h-6 w-6 text-blue-500" />
              <CardTitle className="text-lg font-semibold">
                {getClientName(sale.cliente_id)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">
                Data da Venda: {sale.data_venda}
              </p>
              <p className="text-lg font-bold text-green-600">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(sale.valor_total_venda)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
