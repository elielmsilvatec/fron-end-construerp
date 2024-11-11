'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import api from '@/app/api/api';

interface Product {
  id: number;
  nomeProduto: string;
  descricao: string;
  valorVenda: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // const response = await fetch('http://localhost:5000/produto/produtos', {
        //   credentials: 'include',
        // });
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
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Package className="h-6 w-6 text-blue-500" />
            <CardTitle className="text-lg font-semibold">{product.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-2">{product.nomeProduto}</p>
            <p className="text-lg font-bold text-green-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(product.valorVenda)}
            </p>
          </CardContent>
        </Card>
      ))}
      {products.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          Nenhum produto encontrado
        </div>
      )}
    </div>
  );
}