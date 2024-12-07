import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import api from "@/app/api/api";

interface Props {
  id: number;
}

interface Client {
  nome: string;
  telefone: string;
  cep?: string;
  rua?: string;
  numero?: number;
  bairro?: string;
  cidade?: string;
  observacoes?: string;
}

function ListClient({ id }: Props) {
  const [client, setClient] = useState<Client | null>(null);

  // Criação de nova venda ao carregar a página
  useEffect(() => {
    const newSales = async () => {
      try {
        const response = await api(`/pedido/ver/${id}`);
        const data = await response.json();
        setClient(data.cliente);
        console.log(data.cliente);
      } catch (error) {
        console.error("Erro ao criar venda:", error);
      }
    };
    newSales();
  }, [id]);

  return (
    <div>
      <>
        {client ? (
          <div>
            <h5>{client.nome}</h5>
          </div>
        ) : (
          <>
            <Link href={`/dashboard/requests/${id}`}>
              <h3>
                <button type="button" className="btn btn-link">
                  Click aqui para adicionar um cliente!
                </button>
              </h3>
            </Link>
          </>
        )}
      </>
    </div>
  );
}

export default ListClient;
