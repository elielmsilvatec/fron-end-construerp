"use client";
import { FilePenLine, Trash2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "@/app/api/api";
import Swal from "sweetalert2";



interface Item {
  id: number;
  nome: string;
  undMedidas: string;
  marca: string;
  quant_itens: number;
  valor: number;
  total: number;
}

const App = ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = React.use(params);

  const [refreshClients, setRefreshClients] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);

  const handleModalOpen = (item: Item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setEditItem(null);
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api(`/pedido/ver/${id}`);
        const data = await response.json();
        setItems(data.itemPedido);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
      }
    };

    fetchRequests();
  }, [id, refreshClients]);

  const handleEditItem = async (updatedItem: Item) => {
    try {
      await api(`/item/editar/${updatedItem.id}`, updatedItem);
      Swal.fire("Sucesso!", "Item atualizado com sucesso!", "success");
      setRefreshClients(!refreshClients);
      handleModalClose();
    } catch (error) {
      console.error("Erro ao editar item:", error);
      Swal.fire("Erro!", "Erro ao editar item.", "error");
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      await api(`/item/deletar/${itemId}`);
      Swal.fire("Sucesso!", "Item deletado com sucesso!", "success");
      setRefreshClients(!refreshClients);
    } catch (error) {
      console.error("Erro ao deletar item:", error);
      Swal.fire("Erro!", "Erro ao deletar item.", "error");
    }
  };

  return (
    <>
      <table className="table table-hover responsive ">
        {/* <table className="table table-hover table-bordered "> */}
        <thead className="thead-light ">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th className="text-center align-middle ">Medida</th>
            <th className="text-center align-middle">Marca</th>
            <th className="text-center align-middle">Quantidade</th>
            <th className="text-center align-middle">Valor</th>
            <th className="text-center align-middle">Total</th>
            <th className="text-center align-middle">Editar</th>
            <th className="text-center align-middle">Excluir</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="align-middle">{item.id}</td>
              <td className="align-middle">{item.nome}</td>
              <td className="text-center align-middle">{item.undMedidas}</td>
              <td className="text-center align-middle">{item.marca}</td>
              <td className="text-center align-middle">{item.quant_itens}</td>
              <td className="text-center align-middle">{item.valor}</td>
              <td className="text-center align-middle">{item.total}</td>

              {/* <button className="btn btn-primary me-2" onClick={() => handleModalOpen(item)}>
                  Editar
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteItem(item.id)}>
                  Deletar
                </button> */}
              <td
                className="text-center align-middle"
                onClick={() => handleModalOpen(item)}
              >
                <div className="flex items-center justify-center gap-2 cursor-pointer">
                  <FilePenLine className="text-blue-400" />
                  {/* <span className="text-blue-400"></span> */}
                </div>
                
              </td>
              <td className="text-center align-middle"onClick={() => handleDeleteItem(item.id)}>
                <div className="flex items-center justify-center gap-2 cursor-pointer ">
                  <Trash2Icon className="text-red-400" />
                  {/* <span className="text-red-400"></span> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para editar item */}
      {editItem && (
        <div
          className={`modal ${modalOpen ? "show" : ""}`}
          tabIndex={1}
          style={{ display: modalOpen ? "block" : "none" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Item</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditItem(editItem);
                  }}
                >
                  <div className="mb-3">
                    <label htmlFor="nome" className="form-label">
                      Nome
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nome"
                      value={editItem.nome}
                      onChange={(e) =>
                        setEditItem({ ...editItem, nome: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="marca" className="form-label">
                      Marca
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="marca"
                      value={editItem.marca}
                      onChange={(e) =>
                        setEditItem({ ...editItem, marca: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="undMedidas" className="form-label">
                      Unidade de Medida
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="undMedidas"
                      value={editItem.undMedidas}
                      onChange={(e) =>
                        setEditItem({ ...editItem, undMedidas: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quant_itens" className="form-label">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="quant_itens"
                      value={editItem.quant_itens}
                      onChange={(e) =>
                        setEditItem({
                          ...editItem,
                          quant_itens: +e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleModalClose}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
