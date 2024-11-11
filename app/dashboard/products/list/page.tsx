'use client';
import Link from "next/link"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import ProductList from '@/components/product-list';

export default function App() {


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Produtos</h1>
      <p>
      <Link href="/dashboard/products/new"> New Cadastro Novo </Link>{" "}
      </p>
      <Link href="/dashboard/products/pag"> Pagina pag Testes</Link>
      

      <ProductList />
    </div>
  );
}