"use client";

import { useEffect, useState } from "react";
import api from "@/app/api/api";
import { useRouter } from "next/navigation";
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

interface ProductNewProps {
  onProductAdded: () => void;
}

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

const ProductNew: React.FC<ProductNewProps> = ({ onProductAdded }) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [erroMsg, setErrorMessage] = useState("");
  const [nomeProduto, setNomeproduto] = useState("");
  const [marca, setMarca] = useState("");
  const [unidadeMedida, setUnidadeDeMedida] = useState("Unidade");
  const [quantidadeEstoque, setQuantidade] = useState("");
  const [valorCompra, setValorCompra] = useState("");
  const [valorVenda, setValorVenda] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [refreshProducts, setRefreshProducts] = useState(false); // Add a refresh state

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    limparCampos();
  };

  const newProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

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

      if (response.status === 200) {
        onProductAdded(); // Notifica o pai que o produto foi adicionado
        const resp = await response.json();
        console.log(resp);
        setRefreshProducts(true); // Trigger re-render in ProductList
        handleModalClose(); //Close the modal
        await Swal.fire({
          title: "Sucesso!",
          text: "Produto criado com sucesso!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#4CAF50", // Cor do botão
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.msg || "Erro ao cadastrar produto.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      setErrorMessage("Erro de conexão com o servidor.");
    }
  };

  const limparCampos = () => {
    setNomeproduto("");
    setMarca("");
    setUnidadeDeMedida("Unidade");
    setQuantidade("");
    setValorCompra("");
    setValorVenda("");
    setObservacoes("");
  };

  return (
    <>
      {/* esse botão estou usando bootstrap */}
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleModalOpen}
      >
        <i className="bi bi-plus-square-dotted"></i> Cadastrar produto
      </button>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, borderRadius: "16px" }}>
          {/* {erroMsg && <p style={{ color: "red" }}>{erroMsg}</p>}
        {msgSucess && <p style={{ color: "green" }}>{msgSucess}</p>} */}
          {erroMsg && <Alert severity="error"> {erroMsg}</Alert>}
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Cadastro de Produto
          </Typography>
          <form onSubmit={newProduct}>
            {" "}
            {/* Formulário dentro do Modal */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
              {/* Campos do formulário (TextField, Select, etc.) - mesmos que antes, mas sem fullWidth */}
              <TextField
                size="small"
                label="Nome do Produto"
                variant="outlined"
                fullWidth
                value={nomeProduto}
                onChange={(e) => setNomeproduto(e.target.value)}
                required
              />
              <TextField
                sx={{ marginTop: 1 }} // Adiciona margem superior
                size="small"
                label="Marca"
                variant="outlined"
                fullWidth
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                required
              />
              <FormControl fullWidth size="small" sx={{ marginTop: 1 }}>
                <InputLabel id="unidadeMedida-label">
                  Unidade de Medida
                </InputLabel>
                <Select
                  labelId="unidadeMedida-label"
                  id="unidadeMedida"
                  value={unidadeMedida}
                  label="Unidade de Medida"
                  onChange={(e) => setUnidadeDeMedida(e.target.value)}
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
                value={quantidadeEstoque}
                onChange={(e) => setQuantidade(e.target.value)}
                required
              />
              <TextField
                sx={{ marginTop: 1 }}
                size="small"
                type="number"
                label="Valor de Compra"
                variant="outlined"
                fullWidth
                value={valorCompra}
                onChange={(e) => setValorCompra(e.target.value)}
                required
              />
              <TextField
                sx={{ marginTop: 1 }}
                size="small"
                type="number"
                label="Valor de Venda"
                variant="outlined"
                fullWidth
                value={valorVenda}
                onChange={(e) => setValorVenda(e.target.value)}
                required
              />
              <TextField
                sx={{ marginTop: 1 }}
                size="small"
                label="Observações"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
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
        </Box>
      </Modal>
    </>
  );
};

export default ProductNew;
