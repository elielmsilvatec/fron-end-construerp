import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import api from "@/app/api/api";
import { useRouter } from "next/navigation";

interface Clients {
  id: number;
  nome: string;
  telefone: string;
  cep: number;
  rua: string;
  numero: number;
  bairro: string;
  cidade: string;
  observacoes: string;
}

interface ClientsListProps {
    update: boolean; // Permite true ou false
    id_pedido: number;
    update_list: () => void;
    setAddClient: React.Dispatch<React.SetStateAction<boolean>>; // Adiciona a tipagem
}

const AddClientToOrder: React.FC<ClientsListProps> = ({
  update,
  id_pedido,
  setAddClient,
  update_list,
}: ClientsListProps) => {
  const [clients, setClients] = useState<Clients[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api("/cliente/buscar", {
          method: "POST",
          body: JSON.stringify({ pesquisar: searchTerm }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        setClients(data.clientes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching clients");
      }
    };

    if (searchTerm) {
      fetchClients();
    } else {
      setClients([]); // Limpa a lista de clientes quando searchTerm está vazio
    }
  }, [searchTerm, update]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const addClientRequest = async (id: number) => {
    try {
      const response = await api("/pedido/cliente/add_novo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_cliente: id,
          id_pedido: id_pedido,
        }),
      });
      //  const data = await response.json();
      setSearchTerm(""); // Limpa o campo de busca
      update = !update;
      setAddClient(false); // Oculta o formulário
      update_list();
      // router.push(`/dashboard/requests/${id_pedido}`);
    } catch (err) {
      console.error("Erro ao adicionar cliente:", err);
    }
  };

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar cliente pelo nome."
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearchChange}
          autoFocus
        />
      </div>
      {searchTerm && clients.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <User className="h-6 w-6 text-blue-500" />
                <CardTitle className="text-lg font-semibold">
                  {client.nome}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-green-600">
                  {client.telefone}
                </p>
                <p>CEP: {client.cep}</p>
                <p>
                  Endereço: {client.rua}, {client.numero}, {client.bairro},{" "}
                  {client.cidade}
                </p>
                <p>Observações: {client.observacoes}</p>

                {/* Botões para adicionar cliente */}
                <div className="flex flex-row justify-center items-center gap-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => addClientRequest(client.id)}
                  >
                    Adicionar
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {searchTerm && clients.length === 0 && (
        <div className="text-center mt-4">
          <p className="text-lg font-bold text-gray-500">
            Nenhum cliente cadastrado
          </p>
        </div>
      )}
    </>
  );
};

export default AddClientToOrder;
