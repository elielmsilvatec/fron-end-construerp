"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import LinstItens from "@/components/sales/listSalesProduct";
import Swal from "sweetalert2";
import api from "@/app/api/api";
import { useRouter } from "next/navigation";
import ListClient from "@/components/sales/listClient";

type FormData = {
  desconto: string;
  taxas: string;
  formaPagamento: string;
  parcelas: number;
  valorPago: string;
  entregar: string;
  dataEntrega: string;
  imprimir: number;
};

const SalesItem = ({ params }: { params: Promise<{ id: number }> }) => {
  const router = useRouter();
  const { id } = React.use(params);
  const [showParcelas, setShowParcelas] = useState(false);
  const [showDesconto, setShowDesconto] = useState(false);
  const [showTaxas, setShowTaxas] = useState(false);
  const [showDataEntrega, setShowDataEntrega] = useState(false);
  const [erroMsg, setErroMsg] = useState<string | null>(null);
  const [valorPedido, setValorPedido] = useState<number | null>(100); // Valor do pedido
  const [valorPago, setValorPago] = useState<number | null>(null); // Valor pago
  const [troco, setTroco] = useState<number | null>(null); // Troco
  const [valorFinal, setValorFinal] = useState<number | null>(valorPedido);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      desconto: "",
      taxas: "",
      formaPagamento: "Dinheiro",
      parcelas: 1,
      valorPago: "",
      entregar: "0",
      dataEntrega: "",
      imprimir: 0,
    },
  });

  const formaPagamento = watch("formaPagamento");
  const entregar = watch("entregar");
  const imprimir = watch("imprimir");

  useEffect(() => {
    setShowParcelas(formaPagamento === "Crédito");
  }, [formaPagamento]);

  useEffect(() => {
    setShowDataEntrega(entregar === "1");
  }, [entregar]);

  // Criação de nova venda ao carregar a página
  useEffect(() => {
    const newSales = async () => {
      try {
        const response = await api(`/venda/pedido/adicionar/${id}`);
        const pedido = await response.json();
        setValorPedido(pedido.pedido.valor_total_pedido);
      } catch (error) {
        console.error("Erro ao criar venda:", error);
      }
    };
    newSales();
  }, [id]);

  const toggleDesconto = () => {
    setShowDesconto((prev) => !prev);
    setValue("desconto", ""); // Reseta o valor do desconto
    if (showTaxas) setShowTaxas(false);
  };

  const toggleTaxas = () => {
    setShowTaxas((prev) => !prev);
    setValue("taxas", ""); // Reseta o valor das taxas
    if (showDesconto) setShowDesconto(false);
  };

  const onSubmit = async (data: FormData) => {
    const pedidos = await api(`/pedido/ver/${id}`);
    const pedido = await pedidos.json();
    const vendas = await api(`/venda/pedido/adicionar/${id}`);
    const venda = await vendas.json(); // Extrai o JSON da resposta
    const IDpedido = pedido.pedido.id;
    const IDvenda = venda.venda.id;

    const valor_total_pedido = pedido.pedido.valor_total_pedido;
    // Aqui você enviaria os dados para a API

    if (parseFloat(data.desconto) > pedido.pedido.valor_total_pedido * 0.25) {
      setErroMsg("O desconto não pode ser maior que 25% do valor da compra.");
      const timer = setTimeout(() => {
        setErroMsg(null);
      }, 4000);
      return () => clearTimeout(timer); // Limpa o timer se o componente desmontar
    }
    if (parseFloat(data.valorPago) < pedido.pedido.valor_total_pedido) {
      setErroMsg("O valor pago não pode ser menor que o valor da compra.");
      const timer = setTimeout(() => {
        setErroMsg(null);
      }, 4000);
      return () => clearTimeout(timer); // Limpa o timer se o componente desmontar
    }

    const lucro = venda.venda.lucro;
    const response = await api("/venda/pedido/finalizar", {
      method: "POST",
      body: JSON.stringify({
        ...data, // Inclui os dados do formulário
        IDpedido,
        IDvenda,
        lucro,
        valor_total_pedido,
      }),

      headers: {
        "Content-Type": "application/json",
      },
    });
    const vendaFinalizada = await response.json();
    if (response.ok && response.status === 200) {
      if (Number(imprimir) === 1) {
        // Faz uma requisição para a rota no backend
        let API_BASE_URL: string;

        if (process.env.NODE_ENV === "production") {
          API_BASE_URL = "https://back-end-erp-production.up.railway.app";
        } else {
          API_BASE_URL = "http://localhost:5000";
        }
        window.location.href = `${API_BASE_URL}/venda/imprimir/${IDpedido}`;
      }

      Swal.fire({
        title: "Venda finalizada!",
        text: "Sua venda foi finalizada com sucesso!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#4CAF50",
      });
      router.push("/dashboard/sales/list");
    }
  };

  // calcuando o troco
  const handleInputChange = (value: string) => {
    const numericValue = parseFloat(value.replace(",", ".")); // Converte para número
    setValorPago(isNaN(numericValue) ? null : numericValue);
  };
  // calcula valor final
  useEffect(() => {
    const desconto = parseFloat(getValues("desconto").replace(",", ".")) || 0;
    const taxas = parseFloat(getValues("taxas").replace(",", ".")) || 0;

    const novoValorFinal = valorPedido ? valorPedido - desconto + taxas : 0;
    setValorFinal(novoValorFinal);
  }, [valorPedido, watch("desconto"), watch("taxas")]);

  // Atualiza o troco automaticamente sempre que o valor pago ou pedido mudar
  useEffect(() => {
    if (valorPedido !== null && valorPago !== null) {
      setTroco(valorPago - valorPedido);
    } else {
      setTroco(null); // Define como nulo se algum dos valores for inválido
    }
  }, [valorPago, valorPedido]);

  return (
    <div className="row">
      <div className="col-8">
        {erroMsg && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {erroMsg}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              onClick={() => setErroMsg("")}
            ></button>
          </div>
        )}
        <div className="d-flex">
          <button
            type="button"
            className="btn btn-primary flex-fill"
            style={{ margin: "10px" }}
            disabled
          >
            Valor do Pedido: R$ {valorPedido?.toFixed(2)}
          </button>
          <button
            type="button"
            className="btn btn-warning flex-fill"
            style={{ margin: "10px" }}
            disabled
          >
            Valor final: R$ {valorFinal?.toFixed(2)}
          </button>

          <button
            type="button"
            className="btn btn-success flex-fill"
            style={{ margin: "10px" }}
            disabled
          >
            Troco: R$ {troco !== null ? troco.toFixed(2) : "0.00"}
          </button>
        </div>

        <br />
        <LinstItens id_pedido={id} />
      </div>

      <div className="col-4">
        <ListClient id={id} />

        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={toggleDesconto}
          >
            Adicionar desconto
          </button>
          <button
            type="button"
            className="btn btn-outline-warning"
            onClick={toggleTaxas}
          >
            Adicionar taxas
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          {showDesconto && (
            <div className="form-group">
              <label htmlFor="desconto">Desconto:</label>
              <Controller
                name="desconto"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="desconto"
                    className={`form-control ${
                      errors.desconto ? "is-invalid" : ""
                    }`}
                    placeholder="Desconto"
                  />
                )}
              />
              {errors.desconto && (
                <div className="invalid-feedback">
                  {errors.desconto.message}
                </div>
              )}
            </div>
          )}

          {showTaxas && (
            <div className="form-group">
              <label htmlFor="taxas">Taxas:</label>
              <Controller
                name="taxas"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="taxas"
                    className={`form-control ${
                      errors.taxas ? "is-invalid" : ""
                    }`}
                    placeholder="Taxas"
                  />
                )}
              />
              {errors.taxas && (
                <div className="invalid-feedback">{errors.taxas.message}</div>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="formaPagamento">Forma de Pagamento:</label>
            <Controller
              name="formaPagamento"
              control={control}
              render={({ field }) => (
                <select {...field} id="formaPagamento" className="form-control">
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="PIX">PIX</option>
                  <option value="Débito">Cartão de Débito</option>
                  <option value="Crédito">Cartão de Crédito</option>
                  <option value="Cautela">Cautela</option>
                </select>
              )}
            />
          </div>

          {showParcelas && (
            <div>
              <label htmlFor="parcelas">Quantidade de Parcelas:</label>
              <Controller
                name="parcelas"
                control={control}
                render={({ field }) => (
                  <select {...field} id="parcelas" className="form-select">
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.parcelas && (
                <div className="invalid-feedback">
                  {errors.parcelas.message}
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="valorPago">Valor pago:</label>
            <Controller
              name="valorPago"
              control={control}
              rules={{
                required: "O valor pago é obrigatório",
                minLength: {
                  value: 1,
                  message: "O valor pago deve ter pelo menos 1 caracteres",
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="valorPago"
                  className={`form-control ${
                    errors.valorPago ? "is-invalid" : ""
                  }`}
                  placeholder="Valor pago"
                  onChange={(e) => {
                    field.onChange(e); // Mantém o controle do react-hook-form
                    handleInputChange(e.target.value); // Atualiza o estado local
                  }}
                />
              )}
            />
            {errors.valorPago && (
              <div className="invalid-feedback">{errors.valorPago.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="entregar">Entregar?</label>
            <Controller
              name="entregar"
              control={control}
              render={({ field }) => (
                <select {...field} id="entregar" className="form-select">
                  <option value="0">Não</option>
                  <option value="1">Sim</option>
                </select>
              )}
            />
          </div>

          {showDataEntrega && (
            <div className="form-group">
              <label htmlFor="dataEntrega">Data da entrega:</label>
              <Controller
                name="dataEntrega"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    id="dataEntrega"
                    className={`form-control ${
                      errors.dataEntrega ? "is-invalid" : ""
                    }`}
                  />
                )}
              />
              {errors.dataEntrega && (
                <div className="invalid-feedback">
                  {errors.dataEntrega.message}
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="imprimir">Deseja imprimir: </label>
            <Controller
              name="imprimir"
              control={control}
              render={({ field }) => (
                <select {...field} id="imprimir" className="form-select">
                  <option value="0">Não</option>
                  <option value="1">Sim</option>
                </select>
              )}
            />
          </div>

          <br />
          <button type="submit" className="btn btn-success">
            Finalizar venda
          </button>
        </form>
      </div>
    </div>
  );
};

export default SalesItem;
