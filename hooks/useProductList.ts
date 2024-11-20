import { useState, useEffect } from 'react';
import api from '@/app/api/api';

interface Product {
  id: number;
  nomeProduto: string;
  observacoes: string;
  valorVenda: number;
  quantidadeEstoque: string;
}

const useProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false); // Estado para forçar atualização

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api('/produto/produtos');
        if (!response.ok) {
          throw new Error('Falha ao carregar produtos');
        }
        const data = await response.json();
        setProducts(data.produtos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [refresh]); // Dependência em 'refresh' para re-renderizar

  const refreshProductList = () => {
    setRefresh(!refresh);
  };

  return { products, isLoading, error, refreshProductList };
};

export default useProductList;