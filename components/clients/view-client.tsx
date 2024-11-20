"use client";

import { useEffect, useState } from "react";
import api from "@/app/api/api";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { DeleteIcon, ExternalLink, User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // Not used, remove if unnecessary

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

interface Client {
  // Renamed to singular for consistency
  id: number;
  nome: string;
  telefone: string;
  cep: string; // Changed to string to handle potential leading zeros
  rua: string;
  numero: number | string; // Allow for string if number is not always present
  bairro: string;
  cidade: string;
  observacoes: string;
}

type Props = {
  id: number;
  updateClientList: () => void;
};

const ViewClient = ({ id, updateClientList }: Props) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [client, setClient] = useState<Client | null>(null); // Renamed to client, and improved type
  const [error, setError] = useState<string | null>(null); // Add error state

  const handleModalOpen = async () => {
    setModalOpen(true);
    try {
      const response = await api(`/cliente/view/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Error fetching client: ${response.status}`
        ); // More informative error
      }
      const data = await response.json();
      setClient(data.cliente);
    } catch (error: any) {
      setError(error.message); // Set error message
      console.error("Error fetching client:", error);
    }
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };


  const deletClient = async () => {
    setModalOpen(false);
    const confirmation = await Swal.fire({
        title: "Tem certeza?",
        text: "Esta ação não pode ser desfeita.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, deletar!",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (confirmation.isConfirmed) {
        try {
          const response = await api(`/cliente/del/${id}`);
          if (response.status === 200) {
            updateClientList(); // Atualiza a lista localmente no componente pai
            setModalOpen(false); // Fecha o modal
          } else {
            const errorData = await response.json();
            console.error("Erro ao deletar produto:", errorData.error);
          }
        } catch (error) {
          console.error("Erro:", error);
        }
      }
  }


  return (
    <div>
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
          {client ? (
            <>
              {/* adicionar icone ao lado do nome */}
              <div className="flex items-center space-x-2">
                {" "}
                {/* Added space-x-2 */}
                <User2Icon className="text-blue-500" />
                <h3 id="modal-modal-title">{client.nome}</h3>
              </div>
              <div>
                {" "}
                {/* Use a div for better semantic grouping */}
                <p>
                  Telefone: <strong>{client.telefone}</strong>
                </p>
                <p>
                  CEP: <strong>{client.cep}</strong>
                </p>
                <p>
                  Rua: <strong>{client.rua}</strong>
                </p>
                <p>
                  Número: <strong>{client.numero}</strong>
                </p>
                <p>
                  Bairro: <strong>{client.bairro}</strong>
                </p>
                <p>
                  Cidade: <strong>{client.cidade}</strong>
                </p>
                <p>
                  Observações: <strong>{client.observacoes}</strong>
                </p>
              </div>
             {/* Botoões de ação */}
             <div className="flex justify-between items-center w-full">
                <button
                  onClick={deletClient}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Deletar produto
                </button>
                <button
                  onClick={handleModalClose}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Fechar
                </button>
              </div>
            </>
          ) : error ? (
            <p>Error: {error}</p> // Display error message
          ) : (
            <p>Carregando...</p>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ViewClient;
