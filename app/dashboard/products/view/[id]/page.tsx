"use client";

import React, { useEffect, useState } from "react";
import { use } from "react"; // Certifique-se de importar o use() do 'react'
import api from "@/app/api/api";

export default function ProdutoView({ params }: { params: Promise<{ id: number }> }) {
  // Use o `use()` para desembrulhar `params` antes de acessar `id`
  const { id } = use(params);

  const [produto, setProduto] = useState<{
    nomeProduto: string;
    marca: string;
    unidadeMedida: string;
  } | null>(null);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await api(`/produtos/view/${id}`);
        const data = await response.json();
        setProduto(data);
        console.log(data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    };

    fetchProduto();
  }, [id]);

  if (!produto) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>{produto.nomeProduto}</h1>
      <p>{produto.marca}</p>
      <p>{produto.unidadeMedida}</p>
      {/* outros dados do produto */}
    </div>
  );
}


// "use client";
// import { useAuth } from "@/app/api/auth";
// import api from "@/app/api/api";
// import Menu from "@/app/components/menu/page";
// import styles from "@/app/components/menu/menu.module.css";
// import { useRouter } from "next/navigation";
// import { useEffect, useState, useCallback } from "react";
// import DeleteConfirmation from "@/app/components/DeleteConfirmation/page";

// export default function Produto({ params }: { params: { id: number } }) {
//   useAuth();
//   const [isEditable, setIsEditable] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState(null);
//   const id = params.id;

//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     nomeProduto: "",
//     marca: "",
//     unidadeMedida: "kg",
//     quantidadeEstoque: "",
//     valorCompra: "",
//     valorVenda: "",
//     observacoes: "",
//   });

//   // Função para lidar com mudanças nos campos de input
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };
//   // Função para buscar dados do produto (usando useCallback)
//   const fetchProduct = useCallback(async () => {
//     try {
//       const response = await api.get(`/produtos/view/${id}`, {
//         withCredentials: true,
//       });
//       if (response.data.error) {
//         setError(response.data.error);
//       }
//       setFormData(response.data);
//       setLoading(false);
//       console.log(response);
//     } catch (error) {
//       setError("Erro ao buscar produto");
//     }
//   }, [id]); // Adiciona 'id' como dependência

//   // Função para lidar com o botão de editar ou cancelar edição
//   const handleEdit = () => {
//     setIsEditable(!isEditable);
//   };

//   // Função para submeter o formulário e editar os campos
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post(`/produtos/edit/save/${id}`, formData, {
//         withCredentials: true,
//       });
//       console.log("Dados enviados:", formData);
//       setIsEditable(!isEditable);
//       setMessage("Produto atualizado com sucesso...!");
//     } catch (error) {
//       // console.error("Erro ao salvar o produto:", error);
//       setMessage("Não foi possivel editar o produto.", erro);
//     }
//   };

//   // Função para deletar o produto
//   const handleDelete = async () => {
//     try {
//       await api.delete(`/produtos/del/${id}`, { withCredentials: true });
//       console.log("Produto deletado:", id);
//       router.push("/pages/product/list"); // Redireciona para a lista de produtos
//     } catch (error) {
//       console.error("Erro ao deletar o produto:", error);
//     }
//   };

//   const handleCloseAlert = () => {
//     setMessage(null);
//   };

//   useEffect(() => {
//     if (id) {
//       fetchProduct();
//     } else {
//       setError("Erro ao buscar produto");
//     }
//   } ,[fetchProduct, id]);

//   return (
//     <div>
//       <Menu />
//       <div className={styles.content}>
//         <div className={styles.layout}>
//           <br />
//           {/* verificado o status dos produtos se foram carregados ou não */}
//           {error && (
//             <div className="alert alert-danger" role="alert">
//               Erro: {error}
//             </div>
//           )}

//           {!loading && !error && (
//             <>
//               {/* Alert para informar mensagens como produto editado com sucesso! */}
//               {message && (
//                 <div
//                   className="alert alert-success alert-dismissible fade show"
//                   role="alert"
//                 >
//                   {message}
//                   <button
//                     type="button"
//                     className="btn-close"
//                     data-bs-dismiss="alert"
//                     aria-label="Close"
//                     onClick={handleCloseAlert}
//                   ></button>
//                 </div>
//               )}

//               <button
//                 type="button"
//                 className={
//                   isEditable ? "btn btn-danger" : "btn btn-outline-primary"
//                 }
//                 onClick={handleEdit}
//               >
//                 {isEditable ? "Cancelar edição" : "Editar produto"}
//               </button>

//               <form onSubmit={handleSubmit}>
//                 <br />
//                 <div className="form-group">
//                   <label htmlFor="nomeProduto">Nome do Produto</label>
//                   <input
//                     name="nomeProduto"
//                     type="text"
//                     className="form-control"
//                     id="nomeProduto"
//                     disabled={!isEditable}
//                     value={formData.nomeProduto}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="marca">Marca</label>
//                   <input
//                     name="marca"
//                     type="text"
//                     className="form-control"
//                     id="marca"
//                     value={formData.marca}
//                     disabled={!isEditable}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="unidadeMedida">Unidade de Medida</label>
//                   <select
//                     name="unidadeMedida"
//                     className="form-control"
//                     id="unidadeMedida"
//                     value={formData.unidadeMedida}
//                     disabled={!isEditable}
//                     onChange={handleInputChange}
//                   >
//                     <option value="kg">kg</option>
//                     <option value="Unidade">Unidade</option>
//                     <option value="Metro">Metro</option>
//                     <option value="Litro">Litro</option>
//                     <option value="Milheiro">Milheiro</option>
//                     <option value="Pacote">Pacote</option>
//                     <option value="Saco">Saco</option>
//                     <option value="duzia">Dúzia</option>
//                   </select>
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="quantidadeEstoque">
//                     Quantidade em Estoque
//                   </label>
//                   <input
//                     name="quantidadeEstoque"
//                     type="text"
//                     className="form-control"
//                     id="quantidadeEstoque"
//                     value={formData.quantidadeEstoque}
//                     disabled={!isEditable}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="valorCompra">Valor de Compra</label>
//                   <input
//                     name="valorCompra"
//                     type="text"
//                     className="form-control"
//                     id="valorCompra"
//                     value={formData.valorCompra}
//                     disabled={!isEditable}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="valorVenda">Valor de Venda</label>
//                   <input
//                     name="valorVenda"
//                     type="text"
//                     className="form-control"
//                     id="valorVenda"
//                     value={formData.valorVenda}
//                     disabled={!isEditable}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="observacoes">Observações</label>
//                   <textarea
//                     name="observacoes"
//                     className="form-control"
//                     id="observacoes"
//                     rows="3"
//                     value={formData.observacoes}
//                     disabled={!isEditable}
//                     onChange={handleInputChange}
//                   ></textarea>
//                 </div>

//                 <br />
//                 <div className="d-flex justify-content-end">
//                   <button
//                     type="submit"
//                     className="btn btn-success"
//                     style={{ display: isEditable ? "block" : "none" }}
//                   >
//                     Salvar edição
//                   </button>
//                 </div>
//               </form>

//               <div>
//                 {!isEditable && <DeleteConfirmation onConfirm={handleDelete} />}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
