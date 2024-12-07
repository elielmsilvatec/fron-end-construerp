import { useEffect, useState, useRef } from "react";
import api from "@/app/api/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Props {
  id_pedido: number;
}

const HandleFinalizeSale: React.FC<Props> = ({ id_pedido }: Props) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleFinalizeSale = async () => {
    try {
      const confirmation = await Swal.fire({
        title: "Finalizar ?",
        text: "O pedido será finalizado e você será redirecionado a tela de vendas.",
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
          router.push(`/dashboard/sales/${id_pedido}`);
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
      <button
              className="btn btn-success me-2"
              onClick={handleFinalizeSale}
            >
              <i className="bi bi-cart-check me-2"></i>
              Finalizar Venda
            </button>
    </>
  );
};

export default HandleFinalizeSale;
