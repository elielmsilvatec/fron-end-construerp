"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import api from "@/app/api/api";
import { FilePenLine } from "lucide-react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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

interface Props {
  // update : () => void;
  id: number;
  updateClientList: () => void;
}

interface Clients {
  nome: string;
  telefone: string;
  cep?: string;
  rua?: string;
  numero?: number;
  bairro?: string;
  cidade?: string;
  observacoes?: string;
}

const EditClient = ({ id, updateClientList }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  // criação do formulário com react-hook-form iportando props Produto
  const { control, handleSubmit, reset } = useForm<Clients>({
    defaultValues: {
      nome: "",
      telefone: "",
      cep: "",
      rua: "",
      numero: 0,
      bairro: "",
      cidade: "",
      observacoes: "",
    },
  });

  const handleModalOpen = async () => {
    setModalOpen(true);
    try {
      const response = await api(`/cliente/view/${id}`);
      const data = await response.json();
      reset(data.cliente); // Atualiza o formulário com os dados do produto
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    reset(); // Reseta os campos para os valores originais
  };

  const onSubmit = async (formData: Clients) => {
    try {
      setLoading(true);
      const response = await api(`/cliente/edit/save/${id}`, {
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
          text: "Cadastro cliente atualizado com sucesso!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#4CAF50",
        });
        updateClientList();
      } else {
        setErro("Falha ao atualizar o cliente.");
        throw new Error("Falha ao atualizar o cliente.");
      }
    } catch (error) {
      setErro("Erro ao atualizar o cliente.");
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
            Atualizar dados do cliente
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
              {/* Campos do formulário usando react-hook-form */}
              <Controller
                name="nome"
                control={control}
                rules={{
                  required: "O nome do cliente é obrigatório",
                  minLength: {
                    value: 2,
                    message:
                      "O nome do cliente deve ter pelo menos 2 caracteres",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              {/* Telefone */}
              <Controller
                name="telefone"
                control={control}
                rules={{
                  required: "O telefone é obrigatório",
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: "Digite um telefone válido com 10 ou 11 dígitos",
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              {/* CEP */}
              <Controller
                name="cep"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              {/* Rua */}
              <Controller
                name="rua"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                )}
              />

              {/* Número */}
              <Controller
                name="numero"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                )}
              />

              {/* Bairro */}
              <Controller
                name="bairro"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                )}
              />

              {/* Cidade */}
              <Controller
                name="cidade"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                )}
              />

              {/* Observações */}
              <Controller
                name="observacoes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    rows={3}
                    variant="outlined"
                    fullWidth
                    size="small"
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

export default EditClient;
