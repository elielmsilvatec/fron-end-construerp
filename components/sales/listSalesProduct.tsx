

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCartIcon } from "lucide-react";
import api from "@/app/api/api";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";

interface Item {
    id: number;
    nome: string;
    undMedidas: string;
    marca: string;
    quant_itens: string;
    total: number;
    valor_unitario: string;
    valor_compra: string;
    sub_total_itens: number;
  }
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
interface Props {
id_pedido: number
}

const LinstItens: React.FC<Props> = ({
  id_pedido ,
}: Props) => {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [requests, setRequests] = useState<number>(0);
  const [requestsClosed, setRequestsClosed] = useState<number>(0);
  const [client, setClient] = useState<Client | null>(null); // Renamed to client, and improved type
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, reset, getValues, setValue } = useForm<Item>({
    defaultValues: {
      id: 0,
      nome: "",
      quant_itens: "",
      valor_unitario: "",
    },
  });

  useEffect(() => {
    // Busca produtos no backend com base no termo de pesquisa
    const fetchFilteredProducts = async () => {
      try {
        const response = await api(`/pedido/ver/${id_pedido}`);
        const data = await response.json();
        setRequests(data.pedido.valor_total_pedido);
        setRequestsClosed(data.pedido.status);
        setItems(data.itemPedido);
        setClient(data.cliente);
       console.log(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar produtos"
        );
      }
    };

    fetchFilteredProducts()
  
  }, []);


  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }
  // formatando em BRL
  const formatToBRL = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  return (
    <>
      <>
          <table className="table table-hover responsive">
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th className="text-center">Medida</th>
 
                <th className="text-center">Quantidade</th>
                <th className="text-center">Valor UN</th>
                <th className="text-center">Total</th>
               
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nome}</td>
                  <td className="text-center">{item.undMedidas}</td>
     

                  <td className="text-center">{item.quant_itens}</td>
                  <td className="text-center">{item.valor_unitario}</td>

                  <td className="text-center">
                    {formatToBRL(item.sub_total_itens)}
                  </td>
     
                </tr>
              ))}
            </tbody>
          </table>

          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0">
                  <strong>Valor total:</strong>
                </p>
                <div className="text-lg font-bold text-green-600">
                  {formatToBRL(requests)}
                </div>
              </div>
            </div>
          </div>

          {/* Botões abaixo */}
         
        </>
    </>
  );
};

export default LinstItens;
