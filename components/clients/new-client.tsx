"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import api from "@/app/api/api";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Swal from "sweetalert2";

interface ClientNewProps {
  update: () => void;
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

const ClientNew: React.FC<ClientNewProps> = ({ update }) => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [erroMsg, setErroMsg] = useState("");
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

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    setErroMsg("");
    reset(); // Limpa o formulário ao fechar o modal
  };

  const newClient = async (data: Clients) => {
    setErroMsg(""); // Reseta a mensagem de erro
    setLoading(true);

    try {
      const response = await api("/cliente/save", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        update(); // Atualiza a lista de clientes
        reset(); // Reseta o formulário
        handleModalClose(); // Fecha o modal

        await Swal.fire({
          title: "Sucesso!",
          text: "Cliente cadastrado com sucesso!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#4CAF50",
        });
      } else {
        const errorData = await response.json();
        setErroMsg(errorData.msg || "Erro ao cadastrar cliente.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      setErroMsg("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botão para abrir o modal */}
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleModalOpen}
      >
        <i className="bi bi-plus-square-dotted"></i> Cadastrar cliente
      </button>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            borderRadius: "16px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* Mensagem de erro */}
          {erroMsg && <Alert severity="error">{erroMsg}</Alert>}

          <Typography id="modal-modal-title" variant="h6" component="h2">
            Cadastro de Cliente
          </Typography>

          {/* Formulário */}
          <form onSubmit={handleSubmit(newClient)}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              {/* Nome do cliente */}
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
                    label="Nome do Cliente"
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
                    label="Telefone"
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
                    label="CEP"
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
                    label="Rua"
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
                    label="Número"
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
                    label="Bairro"
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
                    label="Cidade"
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
                    label="Observações"
                    multiline
                    rows={3}
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Box>

            {/* Botões */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={handleModalClose}
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

export default ClientNew;
