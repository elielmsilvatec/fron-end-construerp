import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import api from "@/app/api/api";
import { useRouter } from "next/navigation";
import { ViewProduct } from "./view-product";
import EditProduct from "./edit-product";

import { debounce } from "lodash"; // Importando o debounce

interface Product {
  id: number;
  nomeProduto: string;
  observacoes: string;
  valorVenda: number;
  quantidadeEstoque: string;
}

interface ProductListProps {
  refreshProducts: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ refreshProducts }: ProductListProps) => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Lista completa dos produtos
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [localRefresh, setLocalRefresh] = useState(false);

  const handleRefresh = () => {
    setLocalRefresh(!localRefresh);
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api("/produto/produtos");
      if (!response.ok) {
        throw new Error("Falha ao carregar produtos");
      }
      const data = await response.json();
      setAllProducts(data.produtos); // Guarda a lista completa
      setProducts(data.produtos);      // Mostra a lista completa
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar produtos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Carrega a lista completa na primeira vez
  }, [localRefresh, refreshProducts]);

  const fetchFilteredProducts = useCallback(async (term: string) => {
    try {
      setIsLoading(true);
      const response = await api("/produto/buscar", {
        method: "POST",
        body: JSON.stringify({
          buscarProduto: term,
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      fetchFilteredProducts(term);
    }, 300),
    [fetchFilteredProducts]
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm); // Busca filtrada
    } else {
      setProducts(allProducts); // Mostra a lista completa (sem requisição)
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch, allProducts]); // Adicionado allProducts como dependência

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Função para atualizar a lista após a exclusão
  const updateProductList = (deletedProductId: number) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== deletedProductId)
    );
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
      <br /><br />
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
              <div className="flex flex-row justify-center items-center gap-4">
                <EditProduct id={product.id} onProductUpdated={handleRefresh} />
                {/* Passe a função updateProductList para o ViewProduct */}
                <ViewProduct id={product.id} updateProductList={updateProductList} />
              </div>
            </CardContent>
          </Card>
        ))}
        {products.length === 0 && error != "" && isLoading === null && (
          <div className="col-span-full text-center py-8 text-gray-500">
            Nenhum produto encontrado
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;