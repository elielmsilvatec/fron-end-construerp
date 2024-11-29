"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FilePenLine, SaveIcon, Trash2Icon } from "lucide-react";
import Swal from "sweetalert2";
import api from "@/app/api/api";
import SearchProduct from "@/components/resquests/search-product-request";
import { useRouter } from 'next/navigation';

interface Item {
  id: number;
  nome: string;
  undMedidas: string;
  marca: string;
  quant_itens: string;
  total: number;
  valor_unitario: string;
  valor_compra: string;
  sub_total_itens: number;
}

const App = ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = React.use(params);
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [editQuantityId, setEditQuantityId] = useState<number | null>(null);
  const [editValueId, setEditValueId] = useState<number | null>(null);
  const [refreshItem, setRefreshItem] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Estado compartilhado
  const { control, handleSubmit, reset, getValues, setValue } = useForm<Item>({
    defaultValues: {
      id: 0,
      nome: "",
      quant_itens: "",
      valor_unitario: "",
    },
  });

  const fetchRequests = async () => {
    try {
      const response = await api(`/pedido/ver/${id}`);
      const data = await response.json();
      setItems(data.itemPedido);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [id, refreshItem]);

  const handleEditQuantity = (item: Item) => {
    setEditQuantityId(item.id);
    reset(item);
  };

  const handleEditValue = (item: Item) => {
    setEditValueId(item.id);
    reset(item);
  };

  const handleSaveQuantity = async () => {
    const updatedItem = getValues();
    try {
      if (Number(updatedItem.quant_itens) <= 0) {
        Swal.fire("Erro!", "Quantidade não pode ser zero ou vazia.", "error");
        return;
      }

      await api("/pedido/editar/quant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatedItem.id,
          IDpedido: id,
          quant: updatedItem.quant_itens,
        }),
      });

      setRefreshItem(!refreshItem);
      setEditQuantityId(null);
    } catch (error) {
      console.error("Erro ao salvar quantidade:", error);
      Swal.fire("Erro!", "Erro ao salvar quantidade.", "error");
    }
  };

  const handleSaveValue = async () => {
    const updatedItem = getValues();
    try {
      if (
        Number(updatedItem.valor_unitario) < Number(updatedItem.valor_compra)
      ) {
        Swal.fire(
          "Erro!",
          "O valor unitário não pode ser menor que o valor de compra.",
          "error"
        );
        return;
      }
      const valorUnitario = updatedItem.valor_unitario.replace(".", ","); // Substitui a vírgula por ponto

      await api("/pedido/editar/valor_unitario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: updatedItem.id,
          IDpedido: id,
          valor_unitario: valorUnitario,
        }),
      });

      setRefreshItem(!refreshItem);
      setEditValueId(null);
    } catch (error) {
      console.error("Erro ao salvar valor:", error);
      Swal.fire("Erro!", "Erro ao salvar valor.", "error");
    }
  };

  // deletando item
  const handleDelete = async (itemId: number) => {
    try {
      const confirmation = await Swal.fire({
        title: "Tem certeza?",
        text: "Esta ação não pode ser desfeita.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, deletar!",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });
      if (confirmation.isConfirmed) {
        await api("/pedido/delet/item", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: itemId }),
        });
        setRefreshItem(!refreshItem);
        Swal.fire("Deletado!", "Item deletado com sucesso!", "success");
      }
    } catch (error) {
      console.error("Erro ao deletar item:", error);
      Swal.fire("Erro!", "Erro ao deletar item.", "error");
    }
  };
//  deletando pedido
const handleDeleteOrder = async () => {
  try {
    const confirmation = await Swal.fire({
      title: "Tem certeza?",
      text: "Esta ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });
    if (confirmation.isConfirmed) {

      await api(`/pedido/delet/${id}`);
      // setRefreshItem(!refreshItem);
      // faz uma consulta a pedidos depois de excluir
      const response = await api("/pedido/pedidos");
      const data = await response.json();
      
      router.push('/dashboard/requests/list');
    }
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    Swal.fire("Erro!", "Erro ao deletar pedido.", "error");
  }
}


const handlePrintOrder = async () => {
  try {  
      await api(`/pedido/imprimir/${id}`);   
  } catch (error) {
    console.error("Erro ao imprimir pedido:", error);
    Swal.fire("Erro!", "Erro ao imprimir pedido.", "error");
  } 
}
  return (
    <>
      <SearchProduct
        update_list={() => setRefreshItem(!refreshItem)}
        id_pedido={id}
        onSearchTermChange={setSearchTerm}
      />

      {searchTerm === "" && (
        <>
          <table className="table table-hover responsive">
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th className="text-center">Medida</th>
                <th className="text-center">Marca</th>
                <th className="text-center">Quantidade</th>
                <th className="text-center">Valor</th>
                <th className="text-center">Total</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nome}</td>
                  <td className="text-center">{item.undMedidas}</td>
                  <td className="text-center">{item.marca}</td>

                  {/* Edição de Quantidade */}
                  <td className="text-center">
                    {editQuantityId === item.id ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <Controller
                          name="quant_itens"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              className="form-control form-control-sm w-25"
                            />
                          )}
                        />
                        <i
                          className="bi bi-check text-success cursor-pointer ms-2"
                          onClick={handleSubmit(handleSaveQuantity)}
                        ></i>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center">
                        {item.quant_itens}
                        <i
                          className="bi bi-pencil text-primary cursor-pointer ms-2"
                          onClick={() => handleEditQuantity(item)}
                        ></i>
                      </div>
                    )}
                  </td>

                  {/* Edição de Valor */}
                  <td className="text-center">
                    {editValueId === item.id ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <Controller
                          name="valor_unitario"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              className="form-control form-control-sm w-25"
                            />
                          )}
                        />
                        <i
                          className="bi bi-check text-success cursor-pointer ms-2"
                          onClick={handleSubmit(handleSaveValue)}
                        ></i>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center">
                        {item.valor_unitario}
                        <i
                          className="bi bi-pencil text-primary cursor-pointer ms-2"
                          onClick={() => handleEditValue(item)}
                        ></i>
                      </div>
                    )}
                  </td>

                  <td className="text-center">{item.sub_total_itens}</td>
                  <td className="text-center">
                    <i
                      className="bi bi-trash text-danger cursor-pointer"
                      onClick={() => handleDelete(item.id)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Botões abaixo */}

          {/* Botões divididos em 100% da largura */}
          <div className="d-flex justify-content-between w-100 mt-3">
            <button
              className="btn btn-danger me-2"
              onClick={handleDeleteOrder}
            >
              <i className="bi bi-trash me-2"></i>
              Deletar
            </button>
            <button
              className="btn btn-secondary me-2"
              onClick={handlePrintOrder}
            >
              <i className="bi bi-printer me-2"></i>
              Imprimir Pedido
            </button>
            <button
              className="btn btn-primary me-2"
              // onClick={handleFinalizeOrder}
            >
              <i className="bi bi-check-circle me-2"></i>
              Finalizar Pedido
            </button>
            <button
              className="btn btn-success me-2"
              // onClick={handleFinalizeSale}
            >
              <i className="bi bi-cart-check me-2"></i>
              Finalizar Venda
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default App;
