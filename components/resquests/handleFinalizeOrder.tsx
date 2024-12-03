import { useEffect, useState, useRef } from "react";
import api from "@/app/api/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Props {
  id_pedido: number;
}

const HandleFinalizeOrder: React.FC<Props> = ({ id_pedido }: Props) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleFinalizeOrder = async () => {
    try {
      const confirmation = await Swal.fire({
        title: "Finalizar pedido?",
        text: "O pedido será finalizado e você será redirecionado para a tela de pedidos em aberto.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, finalizar!",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "green",
        cancelButtonColor: "#3085d6",
      });
      if (confirmation.isConfirmed) {
        const response = await api("/pedido/finalizar/item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            IDpedido: id_pedido,
          }),
        });

        if (response.ok && response.status === 200) {
          router.push("/dashboard/requests/list");
        }
      }
    } catch (error) {
      setError("Erro ao finalizar o pedido.");
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <button className="btn btn-primary me-2" onClick={handleFinalizeOrder}>
        <i className="bi bi-check-circle me-2"></i>
        Finalizar Pedido
      </button>
    </>
  );
};

export default HandleFinalizeOrder;
