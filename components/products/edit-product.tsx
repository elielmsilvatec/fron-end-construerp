"use client";

import { useEffect, useState } from "react";
import api from "@/app/api/api";
import { Package, ExternalLink, FilePenLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal"; // Importar o componente Modal do MUI
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
};

//   esse são os props que eu passo para o componente no caso estou recebendo o id
type Props = {
  id: number;
};

const EditProduct = ({ id }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const [produto, setProduto] = useState<{
    nomeProduto: string;
    marca: string;
    unidadeMedida: string;
    quantidadeEstoque: string;
    valorCompra: string;
    valorVenda: string;
    observacoes: string;
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

  return (
    <>
      {/* esse botão estou usando bootstrap */}
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
        <Box sx={{ ...style, borderRadius: "16px" }}>
          {/* {erroMsg && <p style={{ color: "red" }}>{erroMsg}</p>}
        {msgSucess && <p style={{ color: "green" }}>{msgSucess}</p>} */}

          <div className="Conteudo do Modal">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Cadastro de Produto
            </Typography>
            <form>
              {" "}
              {/* Formulário dentro do Modal */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {/* Campos do formulário (TextField, Select, etc.) - mesmos que antes, mas sem fullWidth */}
                <TextField
                  size="small"
                  label="Nome do Produto"
                  variant="outlined"
                  fullWidth
                  required
                  value={produto?.nomeProduto}
                />
                <TextField
                  sx={{ marginTop: 1 }} // Adiciona margem superior
                  size="small"
                  label="Marca"
                  variant="outlined"
                  fullWidth
                  required
                  value={produto?.marca}
                />
                <FormControl fullWidth size="small" sx={{ marginTop: 1 }}>
                  <InputLabel id="unidadeMedida-label">
                    {produto?.unidadeMedida}
                  </InputLabel>
                  <Select
                    labelId="unidadeMedida-label"
                    id="unidadeMedida"
                    label="Unidade de Medida"
                    value={produto?.unidadeMedida}
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
                <TextField
                  sx={{ marginTop: 1 }}
                  size="small"
                  type="number"
                  label="Quantidade em Estoque"
                  variant="outlined"
                  fullWidth
                  required
                  value={produto?.quantidadeEstoque}
                />
                <TextField
                  sx={{ marginTop: 1 }}
                  size="small"
                  type="number"
                  label="Valor de Compra"
                  variant="outlined"
                  fullWidth
                  required
                  value={produto?.valorCompra}
                />
                <TextField
                  sx={{ marginTop: 1 }}
                  size="small"
                  type="number"
                  label="Valor de Venda"
                  variant="outlined"
                  fullWidth
                  required
                  value={produto?.valorVenda}
                />
                <TextField
                  sx={{ marginTop: 1 }}
                  size="small"
                  label="Observações"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={produto?.observacoes}
                />
              </Box>
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
                {/* esse botão estou usando bootstrap    */}
                <button type="submit" className="btn btn-primary">
                  Salvar
                </button>
              </Box>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default EditProduct;
