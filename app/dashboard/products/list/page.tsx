"use client";
import Link from "next/link";
import ProductList from "@/components/products/list-product";

import NewProduct from "@/components/products/new-product";

import React, { useState } from "react";

const Product = () => {
  //   refreshProducts: Um estado booleano que muda toda vez que queremos sinalizar que os produtos precisam ser recarregados.
  // triggerRefresh: Função que altera o valor de refreshProducts, invertendo seu estado. Isso força o ProductList a atualizar a lista.
  const [refreshProducts, setRefreshProducts] = useState(false);
  const triggerRefresh = () => setRefreshProducts(!refreshProducts);

  return (
   <>
    <div>
      <NewProduct onProductAdded={triggerRefresh} />
      <ProductList refreshProducts={refreshProducts} />
    </div>
    </>
  );
};

export default Product;
