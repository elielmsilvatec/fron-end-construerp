"use client";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import api from "@/app/api/api";
import {
  User,
  PackageOpenIcon,
  FullscreenIcon,
  ArrowLeft,
  Printer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from "@mui/material";

interface ItemPedido {
  id: number;
  nome: string;
  undMedidas: string;
  marca: string;
  quant_itens: number;
  valor_compra: number;
  valor_unitario: number;
  lucro: number;
  sub_total_itens: number;
  pedido: number;
  produtoID: number;
}

interface Client {
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

interface Venda {
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
  createdAt: string;
  updatedAt: string;
  usuario: number;
  id_pedido: number;
}

interface Pedido {
  id: number;
  num_pedido: number;
  quantidade: number;
  status: number;
  valor_total_pedido: number;
  createdAt: string;
  updatedAt: string;
  usuario: number;
  cliente_pedido: number;
}

interface DataResponse {
  pedido: Pedido;
  itemPedido: ItemPedido[];
  cliente: Client | null;
  venda: Venda;
  id: string;
}

const Finalized = ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = React.use(params);
  const [data, setData] = useState<DataResponse | null>(null);
  const router = useRouter();

  const fetchRequests = async () => {
    try {
      const response = await api(`/venda/ver/${id}`);
      const data = (await response.json()) as DataResponse;
      console.log("Dados recebidos:", data);
      setData(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [id]);

  const formatDate = (dateString: string | Date | undefined): string => {
    try {
      if (!dateString) {
        return "Data inválida";
      }
      const date =
        typeof dateString === "string" ? new Date(dateString) : dateString;
      console.log("Data a formatar", date);
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Data inválida";
    }
  };

  if (!data) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        Carregando...
      </div>
    );
  }

  const handleCloseDelivery = async () => {
    const confirmation = await Swal.fire({
      title: "Tem certeza?",
      text: "Esta ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Marcar como entregue",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#3085d6",
    });

    if (confirmation.isConfirmed) {
      const response = await api(`/entrega/entregue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_venda: data.venda.id }),
      });

      console.log(response);
      if (response.ok && response.status === 200) {
        await Swal.fire({
          title: "Atualizado!",
          text: "Entrega finalizada com sucesso!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#4CAF50",
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirecionar para /dashboard/deliveries
            window.location.href = "/dashboard/deliveries";
          }
        });
      } else {
        Swal.fire("Erro!", "Erro ao finalizar entrega.", "error");
      }
    }
  };

  const handlePrintSale = () => {
    let API_BASE_URL: string;

    if (process.env.NODE_ENV === "production") {
      API_BASE_URL = "https://back-end-erp-production.up.railway.app";
    } else {
      API_BASE_URL = "http://localhost:5000";
    }
    window.location.href = `${API_BASE_URL}/venda/imprimir/${id}`;
  };

  return (
    <div>
      <div className="mb-3">
        <button
          onClick={() => router.back()}
          className="btn btn-link text-decoration-none"
        >
          <ArrowLeft className="me-2" size={20} />
        </button>
      </div>

      <h3 className="fs-4 fw-semibold text-secondary mb-3 d-flex align-items-center">
        Status da entrega:
        <div
          className={`ms-2 ${
            data.venda.entrega === 1 ? "text-warning" : "text-success"
          }`}
        >
          {data.venda.entrega === 1 ? (
            <>
              <i className="bi bi-exclamation-triangle-fill me-1"></i> Pendente
            </>
          ) : (
            <>
              <i className="bi bi-check-circle-fill me-1"></i> Entregue
            </>
          )}
        </div>
      </h3>

      <div className="bg-white shadow-sm rounded-3 p-4 mb-4">
        <h2 className="fs-4 fw-semibold text-secondary mb-3 d-flex align-items-center">
          <User className="me-2" size={20} /> Informações do Cliente
        </h2>
        {data.cliente ? (
          <div className="row">
            <div className="col-12 col-md-6">
              <p className="mb-2">
                <span className="fw-medium">Nome:</span> {data.cliente?.nome}
              </p>
              <p className="mb-2">
                <span className="fw-medium">Telefone:</span>{" "}
                {data.cliente?.telefone}
              </p>
              {data.cliente?.cep && (
                <p className="mb-2">
                  <span className="fw-medium">CEP:</span> {data.cliente.cep}
                </p>
              )}
              {data.cliente?.rua && (
                <p className="mb-2">
                  <span className="fw-medium">Rua:</span> {data.cliente.rua}
                </p>
              )}
            </div>
            <div className="col-12 col-md-6">
              {data.cliente?.numero && (
                <p className="mb-2">
                  <span className="fw-medium">Número:</span>{" "}
                  {data.cliente.numero}
                </p>
              )}
              {data.cliente?.bairro && (
                <p className="mb-2">
                  <span className="fw-medium">Bairro:</span>{" "}
                  {data.cliente.bairro}
                </p>
              )}
              {data.cliente?.cidade && (
                <p className="mb-2">
                  <span className="fw-medium">Cidade:</span>{" "}
                  {data.cliente.cidade}
                </p>
              )}
              {data.cliente?.observacoes && (
                <p className="mb-2">
                  <span className="fw-medium">Observações:</span>{" "}
                  {data.cliente.observacoes}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-muted">Cliente não informado</p>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-3 p-4 mb-4">
        <h2 className="fs-4 fw-semibold text-secondary mb-3 d-flex align-items-center">
          <PackageOpenIcon className="me-2" size={20} /> Detalhes do Pedido
        </h2>
        <div className="row">
          <div className="col-12 col-md-6">
            <p className="mb-2">
              <span className="fw-medium">Número:</span>{" "}
              {data.pedido?.num_pedido}
            </p>
            <p className="mb-2">
              <span className="fw-medium">Status:</span>
              <span
                className={`badge ms-1
                                        ${
                                          data.pedido?.status === 1
                                            ? "bg-warning"
                                            : data.pedido?.status === 2
                                            ? "bg-primary"
                                            : data.pedido?.status === 3
                                            ? "bg-success"
                                            : "bg-secondary"
                                        }`}
              >
                {data.pedido?.status === 1
                  ? "Pendente"
                  : data.pedido?.status === 2
                  ? "Em Andamento"
                  : data.pedido?.status === 3
                  ? "Finalizado"
                  : "Desconhecido"}
              </span>
            </p>
          </div>
          <div className="col-12 col-md-6">
            <p className="mb-2">
              <span className="fw-medium">Data:</span>{" "}
              {formatDate(data.pedido?.createdAt)}
            </p>
            <p>
              <span className="fw-medium">Valor Total:</span> R$
              {data.pedido?.valor_total_pedido?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-3 p-4 mb-4">
        <h2 className="fs-4 fw-semibold text-secondary mb-3 d-flex align-items-center">
          <FullscreenIcon className="me-2" size={20} /> Itens do Pedido
        </h2>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th scope="col">Produto</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Valor Unitário</th>
                <th scope="col">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {data.itemPedido?.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.quant_itens}</td>
                  <td>R$ {item.valor_unitario.toFixed(2)}</td>
                  <td>R$ {item.sub_total_itens.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-3 p-4 mb-4">
        <h2 className="fs-4 fw-semibold text-secondary mb-3 d-flex align-items-center">
          <FullscreenIcon className="me-2" size={20} /> Detalhes da Venda
        </h2>
        <div className="row">
          <div className="col-12 col-md-6">
            <p className="mb-2">
              <span className="fw-medium">Número:</span>{" "}
              {data.venda?.numero_pedido}
            </p>
            <p className="mb-2">
              <span className="fw-medium">Data:</span>{" "}
              {formatDate(data.venda?.data_venda)}
            </p>
            <p className="mb-2">
              <span className="fw-medium">Pagamento:</span>{" "}
              {data.venda?.tipo_pagamento}
            </p>
          </div>
          <div className="col-12 col-md-6">
            <p className="mb-2">
              <span className="fw-medium">Parcelas:</span>{" "}
              {data.venda?.quant_parcelas}
            </p>
            <p className="mb-2">
              <span className="fw-medium">Entrega:</span>{" "}
              {data.venda?.entrega === 1 ? "Sim" : "Não"}
            </p>
            {data.venda?.entrega === 1 && (
              <p className="mb-2">
                <span className="fw-medium">Data de Entrega:</span>{" "}
                {formatDate(data.venda?.data_entrega)}
              </p>
            )}
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-md-6">
            <p className="mb-2">
              <span className="fw-medium">Desconto:</span> R$
              {data.venda?.desconto?.toFixed(2)}
            </p>
            <p className="mb-2">
              <span className="fw-medium">Valor Total:</span> R$
              {data.venda?.valor_total_venda?.toFixed(2)}
            </p>
          </div>
          <div className="col-12 col-md-6">
            {data.venda?.obs && (
              <p className="mb-2">
                <span className="fw-medium">Observações:</span> {data.venda.obs}
              </p>
            )}
            <p>
              <span className="fw-medium">Taxas:</span> R$
              {data.venda?.taxas?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between w-100 mt-3">
        {data.venda.entrega === 1 && (
          <button
            className="btn btn-success me-2"
            onClick={handleCloseDelivery}
          >
            <i className="bi bi-check-circle me-2"></i>
            Marcar como Entregue
          </button>
        )}

        <>
          <button className="btn btn-secondary me-2" onClick={handlePrintSale}>
            <i className="bi bi-printer me-2"></i>
            Imprimir venda
          </button>
        </>
      </div>
    </div>
  );
};

export default Finalized;
