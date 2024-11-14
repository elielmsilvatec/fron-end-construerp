"use client";

import { useEffect, useState } from "react";
import api from "@/app/api/api";

import Success from "@/components/sweetalert2/success"
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

export default function ProductNew() {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const [erroMsg, setErrorMessage] = useState("");
  const [msgSucess, setMsgsucess] = useState("");

  interface Produto {
    id: number;
    nomeProduto: string;
    unidadeMedida: string;
    marca: string;
    quantidadeEstoque: number;
    valorVenda: string;
    valorCompra: string;
    observacoes: string;
  }

  const [nomeProduto, setNomeproduto] = useState("");
  const [marca, setMarca] = useState("");
  const [unidadeMedida, setUnidadeDeMedida] = useState("Unidade");
  const [quantidadeEstoque, setQuantidade] = useState("");
  const [valorCompra, setValorCompra] = useState("");
  const [valorVenda, setValorVenda] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Função para criar novo produto
  const newProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api("/produtos/save", {
        method: "POST",
        body: JSON.stringify({
          nomeProduto,
          marca,
          unidadeMedida,
          quantidadeEstoque,
          valorCompra,
          valorVenda,
          observacoes,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resp = await response.json();
      console.log(resp)

      if (response.status === 200) {
        // 201 Created é o status esperado para criação
        setMsgsucess("Produto criado com sucesso!");
        // Limpar os campos do formulário
        setNomeproduto("");
        setMarca("");
        setUnidadeDeMedida("Unidade");
        setQuantidade("");
        setValorCompra("");
        setValorVenda("");
        setObservacoes("");
        handleModalClose(); // Feche o modal
      } else if (response.status === 400) {
        // 400 Bad Request
        const errorData = await response.json();
        setErrorMessage(errorData.msg);
      } 
      // else {
      //   setErrorMessage("Erro ao cadastrar produto.");
      // }
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      setErrorMessage("Erro de conexão com o servidor.");
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleModalOpen}
      >
        <i className="bi bi-plus-square-dotted"></i> Cadastrar produto
      </button>

      {/* Modal de Adicionar Novo */}
      {modalOpen && (
        <div
          className="modal fade show d-block"
          id="myModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form method="post" onSubmit={newProduct}>
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Cadastro de Produto
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleModalClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    {erroMsg && <Alert severity="error"> {erroMsg}</Alert>}

                    {msgSucess && (
                      <Alert
                        icon={<CheckIcon fontSize="inherit" />}
                        severity="success"
                      >
                        {msgSucess}
                      </Alert>
                    )}
                    <label htmlFor="nomeProduto" className="form-label">
                      Nome do Produto:
                    </label>
                    <input
                      name="nomeProduto"
                      type="text"
                      className="form-control"
                      id="nomeProduto"
                      required
                      autoFocus
                      value={nomeProduto}
                      onChange={(e) => setNomeproduto(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="marca" className="form-label">
                      Marca:
                    </label>
                    <input
                      name="marca"
                      type="text"
                      className="form-control"
                      id="marca"
                      required
                      value={marca}
                      onChange={(e) => setMarca(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="unidadeMedida" className="form-label">
                      Unidade de Medida:
                    </label>
                    <select
                      name="unidadeMedida"
                      className="form-control"
                      id="unidadeMedida"
                      value={unidadeMedida} // Liga o valor do select ao estado
                      onChange={(e) => setUnidadeDeMedida(e.target.value)} // Captura mudança
                    >
                      <option value="Unidade">Unidade</option>
                      <option value="kg">kg</option>
                      <option value="Metro">Metro</option>
                      <option value="Litro">Litro</option>
                      <option value="Milheiro">Milheiro</option>
                      <option value="Pacote">Pacote</option>
                      <option value="Saco">Saco</option>
                      <option value="duzia">Dúzia</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quantidadeEstoque" className="form-label">
                      Quantidade em Estoque:
                    </label>
                    <input
                      name="quantidadeEstoque"
                      type="text"
                      className="form-control"
                      id="quantidadeEstoque"
                      required
                      value={quantidadeEstoque} // Liga o valor
                      onChange={(e) => setQuantidade(e.target.value)} // Captura mudança
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="valorCompra" className="form-label">
                      Valor de Compra:
                    </label>
                    <input
                      name="valorCompra"
                      type="text"
                      className="form-control"
                      id="valorCompra"
                      required
                      value={valorCompra} // Liga o valor
                      onChange={(e) => setValorCompra(e.target.value)} // Captura mudança
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="valorVenda" className="form-label">
                      Valor de Venda:
                    </label>
                    <input
                      name="valorVenda"
                      type="text"
                      className="form-control"
                      id="valorVenda"
                      required
                      value={valorVenda} // Liga o valor do select ao estado
                      onChange={(e) => setValorVenda(e.target.value)} // Captura mudança
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="observacoes" className="form-label">
                      Observações:
                    </label>
                    <textarea
                      name="observacoes"
                      className="form-control"
                      rows={5}
                      id="observacoes"
                      value={observacoes} // Liga o valor do select ao estado
                      onChange={(e) => setObservacoes(e.target.value)} // Captura mudança
                    ></textarea>
                  </div>
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
      )}
    </>
  );
}
