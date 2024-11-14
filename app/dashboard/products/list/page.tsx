"use client";
import Link from "next/link";
import ProductList from "@/components/products/product-list";

import NewProduct from "@/components/products/new-product";

export default function App() {
  return (
    <div>
      <h1 className="text-2xl font-bold  ">Produtos</h1>
      <NewProduct /> <br />
      <p>
        <Link href="/dashboard/products/new"> New Cadastro Novo </Link>{" "}
      </p>
      <ProductList />
    </div>
  );
}
