import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCartIcon } from "lucide-react";
import api from "@/app/api/api";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  nomeProduto: string;
  observacoes: string;
  valorVenda: number;
  quantidadeEstoque: string;
}

interface Props {
  update_list: () => void;
  id_pedido: number;
}

const ProductSearch: React.FC<Props> = ({ update_list, id_pedido }: Props) => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Busca produtos no backend com base no termo de pesquisa
    const fetchFilteredProducts = async () => {
      try {
        const response = await api("/produto/buscar", {
          method: "POST",
          body: JSON.stringify({
            buscarProduto: searchTerm,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Falha ao carregar produtos");
        }
        const data = await response.json();
        setProducts(data.produtos);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar produtos"
        );
      }
    };

    if (searchTerm) {
      fetchFilteredProducts();
    } else {
      // Se o termo de pesquisa estiver vazio, recarregue todos os produtos
      setProducts([]);
    }
  }, [searchTerm, update_list]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const addProductRequest = async (productId: number) => {
    try {
  // Obtendo os dados do produto
  const produtoResponse = await api(`/produtos/view/${productId}`);
  const produto = await produtoResponse.json();

  // Extraindo os campos necessários do produto
  const { nomeProduto, unidadeMedida, valorCompra, valorVenda, marca } = produto;

  // Obtendo os dados do pedido
  const pedidoResponse = await api(`/pedido/ver/${id_pedido}`);
  const pedido = await pedidoResponse.json();
  const IDpedido = pedido.pedido.id; // ID do pedido

  // Construindo os dados para envio
  const data = {
    nome: nomeProduto,
    undMedidas: unidadeMedida,
    marca, // Marca do produto
    sub_total_itens: valorVenda, // Subtotal do item é o valor de venda
    valor_compra: valorCompra, // Valor de compra
    IDpedido, // ID do pedido
    itens_produto: productId, // ID do produto
  };

  // Enviando os dados para a rota POST
  const response = await api("/pedido/add/produto_item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Converte o objeto para JSON
  });

  if (!response.ok) {
    throw new Error("Erro ao adicionar o item ao pedido");
  }

  update_list();
  setSearchTerm("");

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao adicionar solicitação"
      );
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Package className="h-6 w-6 text-blue-500" />
              <CardTitle className="text-lg font-semibold">
                {product.nomeProduto}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{product.observacoes}</p>
              <p className="text-gray-400 mb-2">
                Estoque: {product.quantidadeEstoque}
              </p>
              <p className="text-lg font-bold text-green-600">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(product.valorVenda)}
              </p>

              {/* essa div abaixo é para adicionar os botões um ao lado do outro */}

              <button
                className="flex flex-row justify-center items-center gap-4 text-blue-500 "
                type="button"
                onClick={() => addProductRequest(product.id)} // Passa o ID do produto
              >
                <ShoppingCartIcon className="h-6 w-6 text-blue-500" />
                Adicionar
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default ProductSearch;
