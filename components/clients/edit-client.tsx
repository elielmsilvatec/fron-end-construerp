"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/app/api/api";
import { FilePenLine } from "lucide-react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import Swal from "sweetalert2";
import { InputLabel, Grid, useMediaQuery } from "@mui/material"; // Importe useMediaQuery

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 800, // Use maxWidth em vez de width para responsividade
    width: "90%",  // Garante que não passe de 90% da tela em telas pequenas
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: "16px",
    overflowY: "auto", // Adiciona scroll se necessário
    maxHeight: '90vh', // Limita a altura máxima
};

interface Props {
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
    const {
        handleSubmit,
        reset,
        register,
        formState: { errors },
    } = useForm<Clients>({
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
    
    //hook para verificar o tamanho da tela
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleModalOpen = async () => {
        setModalOpen(true);
        try {
            const response = await api(`/cliente/view/${id}`);
            const data = await response.json();
            reset(data.cliente);
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        reset();
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
            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleModalOpen}
            >
                <FilePenLine className="text-blue-500" />
                <span className="text-blue-500">Editar</span>
            </div>

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
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={isSmallScreen ? 12 : 6}>
                                    <InputLabel htmlFor="nome">Nome do cliente</InputLabel>
                                    <TextField
                                        {...register("nome", {
                                            required: "O nome do cliente é obrigatório",
                                            minLength: {
                                                value: 2,
                                                message:
                                                    "O nome do cliente deve ter pelo menos 2 caracteres",
                                            },
                                        })}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        error={!!errors.nome}
                                        helperText={errors.nome?.message}
                                    />

                                    <InputLabel htmlFor="telefone">Telefone</InputLabel>
                                    <TextField
                                        {...register("telefone", {
                                            required: "O telefone é obrigatório",
                                            pattern: {
                                                value: /^[0-9]{10,11}$/,
                                                message:
                                                    "Digite um telefone válido com 10 ou 11 dígitos",
                                            },
                                        })}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        error={!!errors.telefone}
                                        helperText={errors.telefone?.message}
                                    />

                                     <InputLabel htmlFor="cep">CEP</InputLabel>
                                    <TextField
                                        {...register("cep")}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                    />

                                     <InputLabel htmlFor="rua">Rua</InputLabel>
                                    <TextField
                                        {...register("rua")}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                    />

                                </Grid>
                                <Grid item xs={12} md={isSmallScreen ? 12 : 6}>
                                    
                                     <InputLabel htmlFor="numero">Número</InputLabel>
                                    <TextField
                                        {...register("numero")}
                                        type="number"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                    />

                                     <InputLabel htmlFor="bairro">Bairro</InputLabel>
                                    <TextField
                                        {...register("bairro")}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                    />

                                    <InputLabel htmlFor="cidade">Cidade</InputLabel>
                                    <TextField
                                        {...register("cidade")}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                    />

                                   <InputLabel htmlFor="observacoes">Observações</InputLabel>
                                    <TextField
                                        {...register("observacoes")}
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 2,
                            }}
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