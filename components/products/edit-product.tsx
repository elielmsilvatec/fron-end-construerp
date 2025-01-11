"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import api from "@/app/api/api";
import { FilePenLine } from "lucide-react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Swal from "sweetalert2";
import Alert from "@mui/material/Alert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "16px",
};

// Props recebendo o ID do produto
type Props = {
  id: number;
  onProductUpdated: () => void;
};

type Produto = {
  nomeProduto: string;
  marca: string;
  unidadeMedida: string;
  quantidadeEstoque: string;
  valorCompra: string;
  valorVenda: string;
  observacoes: string;
};

const EditProduct = ({ id , onProductUpdated}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
    // criação do formulário com react-hook-form iportando props Produto
  const { control, handleSubmit, reset } = useForm<Produto>();

  const handleModalOpen = async () => {
    setModalOpen(true);
    try {
      const response = await api(`/produtos/view/${id}`);
      const data = await response.json();
      reset(data); // Atualiza o formulário com os dados do produto
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    reset(); // Reseta os campos para os valores originais
  };

  const onSubmit = async (formData: Produto) => {
    try {
      setLoading(true);
      const response = await api(`/produto/atualizar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        handleModalClose();
        await Swal.fire({
          title: "Atualizado!",
          text: "Produto atualizado com sucesso!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#4CAF50",
        });
        onProductUpdated(id);
      } else {
        setErro("Falha ao atualizar o produto.");
        throw new Error("Falha ao atualizar o produto.");
      }
    } catch (error) {
      setErro("Erro ao atualizar o produto.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Botão para abrir o modal */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleModalOpen}
      >
        <FilePenLine className="text-blue-500" />
        <span className="text-blue-500">Editar</span>
      </div>

      {/* Modal com formulário */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {erro && <Alert severity="error"> {erro}</Alert>}
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Atualizar Produto
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
              {/* Campos do formulário usando react-hook-form */}
              <Controller
                name="nomeProduto"
                control={control}
                defaultValue=""
                rules={{
                  required: "O nome do produto é obrigatório", // Mensagem de erro
                  minLength: {
                    value: 3,
                    message: "O nome do produto deve ter pelo menos 3 caracteres",
                  }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Nome do Produto"
                    variant="outlined"
                    fullWidth
                    error={!!fieldState.error} // Indica se há erro
                    helperText={fieldState.error?.message} // Exibe a mensagem de erro
                  />
                )}
              />

              <Controller
                name="marca"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Marca"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="unidadeMedida"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel id="unidadeMedida-label">
                      Unidade de Medida
                    </InputLabel>
                    <Select
                      {...field}
                      value={field.value || ""}
                      label="Unidade de Medida"
                    >
                      <MenuItem value="Unidade">Unidade</MenuItem>
                      <MenuItem value="kg">kg</MenuItem>
                      <MenuItem value="Metro">Metro</MenuItem>
                      <MenuItem value="Litro">Litro</MenuItem>
                      <MenuItem value="Milheiro">Milheiro</MenuItem>
                      <MenuItem value="Pacote">Pacote</MenuItem>
                      <MenuItem value="Saco">Saco</MenuItem>
                      <MenuItem value="duzia">Dúzia</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="quantidadeEstoque"
                control={control}
                defaultValue=""
                rules={{
                  required: "Quantidade em estoque é obrigatório", // Mensagem de erro
                  minLength: 1,
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    size="small"
                    type="number"
                    label="Quantidade em Estoque"
                    variant="outlined"
                    fullWidth
                    error={!!fieldState.error} // Indica se há erro
                    helperText={fieldState.error?.message} // Exibe a mensagem de erro
                  />
                )}
              />
              <Controller
                name="valorCompra"
                control={control}
                defaultValue=""
                rules={{
                  required: "Valor de compra é obrigatório", // Mensagem de erro
                  minLength: 1,
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    size="small"
                    type="number"
                    label="Valor de Compra"
                    variant="outlined"
                    fullWidth
                    error={!!fieldState.error} // Indica se há erro
                    helperText={fieldState.error?.message} // Exibe a mensagem de erro
                  />
                )}
              />
              <Controller
                name="valorVenda"
                control={control}
                defaultValue=""
                rules={{
                  required: "Valor de venda é obrigatório", // Mensagem de erro
                  minLength: 1,
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    size="small"
                    type="number"
                    label="Valor de Venda"
                    variant="outlined"
                    fullWidth
                    error={!!fieldState.error} // Indica se há erro
                    helperText={fieldState.error?.message} // Exibe a mensagem de erro
                  />
                )}
              />
              <Controller
                name="observacoes"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    size="small"
                    label="Observações"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={handleModalClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default EditProduct;
