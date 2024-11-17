"use client";

import { useEffect, useState } from "react";
import api from "@/app/api/api";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ExternalLink } from "lucide-react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "16px",
};

type Props = {
  id: number;
};

export const ViewProduct = ({ id }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const handleEditModalOpen = () => {
    handleModalClose(); // Fecha o modal de visualização
    setEditModalOpen(true); // Abre o modal de edição
  };
  const handleEditModalClose = () => setEditModalOpen(false);

  const [produto, setProduto] = useState<{
    id: number;
    nomeProduto: string;
    marca: string;
    unidadeMedida: string;
    quantidadeEstoque: number;
    valorCompra: number;
    valorVenda: number;
    observacoes: string;
  } | null>(null);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await api(`/produtos/view/${id}`);
        const data = await response.json();
        setProduto(data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    };

    fetchProduto();
  }, [id]);

  return (
    <>
      {/* <div className="flex flex-col justify-center items-center">
        <ExternalLink className="text-blue-500" onClick={handleModalOpen} />
      </div> */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleModalOpen}
      >
        <ExternalLink className="text-blue-500" />
        <span className="text-blue-500">Visualizar</span>
      </div>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {produto ? (
            <>
              <h2>{produto.nomeProduto}</h2>
              <p>
                Marca: <strong>{produto.marca}</strong>
              </p>
              <p>
                Unidade de Medida: <strong>{produto.unidadeMedida}</strong>
              </p>
              <p>
                Quantidade em Estoque:{" "}
                <strong>{produto.quantidadeEstoque}</strong>
              </p>
              <p>
                Valor de Compra:{" "}
                <strong>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(produto.valorCompra)}
                </strong>
              </p>
              <p>
                Valor de Venda:{" "}
                <strong>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(produto.valorVenda)}
                </strong>
              </p>
              <p>Observações: {produto.observacoes}</p>

              <div className="flex flex-col justify-center items-center">
                <button
                  onClick={handleModalClose}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Fechar
                </button>
              </div>
             
            </>
          ) : (
            <p>Carregando...</p>
          )}
        </Box>
      </Modal>

    
    </>
  );
};
