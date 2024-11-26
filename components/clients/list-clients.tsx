import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import api from "@/app/api/api";
import { useRouter } from "next/navigation";
import { set } from "date-fns";
import ViewClient from "./view-client";
import EditClient from "./edit-client";

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
  update: () => void;
}

const ClientList: React.FC<ClientsListProps> = ({
  update,
}: ClientsListProps) => {
  const [clients, setClients] = useState<Clients[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [client_vazio, setClientVazio] = useState(false);

  // const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api("/cliente/clientes");
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();

        // caso não tenha nenhum cliente cadastrado
        if (data.clientes.length === 0) {
          setClientVazio(true);
        }

        setClients(data.clientes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching clients");
      }
    };

    fetchClients();
  }, [update]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // setIsLoading(true);
        const response = await api("/cliente/buscar", {
          method: "POST",
          body: JSON.stringify({
            pesquisar: searchTerm,
          }),
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
      } finally {
        // setIsLoading(false);
      }
    };
    if (searchTerm) {
      fetchClients();
    } else {
      const fetchClients = async () => {
        try {
          // setIsLoading(true);
          const response = await api("/cliente/clientes");
          if (!response.ok) {
            throw new Error("Failed to fetch clients");
          }
          const data = await response.json();
          setClients(data.clientes);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Error fetching clients"
          );
        } finally {
          // setIsLoading(false);
        }
      };
      fetchClients();
    }
  }, [searchTerm, update]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar produtos..."
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearchChange}
          autoFocus
        />
      </div>
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
                Endereço: {client.rua}, {client.numero}, {client.bairro},{" "}
                {client.cidade}
              </p>
              <p>Observações: {client.observacoes}</p>

              {/* essa div abaixo é para adicionar os botões um ao lado do outro */}
              <div className="flex flex-row justify-center items-center gap-4">
                <EditClient id={client.id} updateClientList={update} />
                {/* Passe a função updateProductList para o ViewProduct */}
                <ViewClient id={client.id} updateClientList={update} />
              </div>
            </CardContent>
          </Card>
        ))}
        {client_vazio === true && (
          <div className="text-center mt-4">
            <p className="text-lg font-bold text-gray-500">
              Nenhum cliente cadastrado
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientList;
