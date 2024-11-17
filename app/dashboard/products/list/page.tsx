"use client";
import Link from "next/link";
import ProductList from "@/components/products/list-product";

import NewProduct from "@/components/products/new-product";

export default function App() {
  return (
    <div>
      <h1 className="text-2xl font-bold  ">Produtos</h1>
      <NewProduct />
       <br />
       <br />

      <ProductList />
    </div>
  );
}
