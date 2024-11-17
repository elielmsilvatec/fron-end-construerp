'use client';

import React, { useState } from 'react';
import api from '@/app/api/api';


import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';



export default function App() {
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

  const [nomeProduto, setNomeproduto] = useState('');
  const [marca, setMarca] = useState('');
  const [unidadeMedida, setUnidadeDeMedida] = useState('Unidade');
  const [quantidadeEstoque, setQuantidade] = useState('');
  const [valorCompra, setValorCompra] = useState('');
  const [valorVenda, setValorVenda] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Função para criar novo produto
  const newProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api('/produtos/save', {
        method: 'POST',
        body: JSON.stringify({
          nomeProduto,
          marca,
          unidadeMedida,
          quantidadeEstoque ,
          valorCompra,
          valorVenda,
          observacoes,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Produto cadastrado com sucesso');
        // Limpar os campos do formulário
        setNomeproduto('');
        setMarca('');
        setUnidadeDeMedida('Unidade');
        setQuantidade('');
        setValorCompra('');
        setValorVenda('');
        setObservacoes('');
      } else {
        console.error('Erro ao cadastrar produto');
      }
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
    }
  };

  return (
   <>
   


    <Box component="form" onSubmit={newProduct} noValidate sx={{ mt: 1 }}>
      <Typography variant="h5" component="div" gutterBottom>
        Cadastro de Produto
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>

        <TextField
          size="small"
          margin="normal"
          required
          fullWidth
          id="nomeProduto"
          label="Nome do Produto"
          name="nomeProduto"
          autoFocus
          value={nomeProduto}
          onChange={(e) => setNomeproduto(e.target.value)}
        />
        <TextField
        size="small"
          margin="normal"
          required
          fullWidth
          id="marca"
          label="Marca"
          name="marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="unidadeMedida-label">Unidade de Medida</InputLabel>
          <Select
          size="small"
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
        size="small"
          margin="normal"
          required
          fullWidth
          id="quantidadeEstoque"
          label="Quantidade em Estoque"
          type="number"
          name="quantidadeEstoque"
          value={quantidadeEstoque}
          onChange={(e) => setQuantidade(e.target.value)}
        />
        <TextField
        size="small"
          margin="normal"
          required
          fullWidth
          id="valorCompra"
          label="Valor de Compra"
          type="number"
          name="valorCompra"
          value={valorCompra}
          onChange={(e) => setValorCompra(e.target.value)}
        />
        <TextField
        size="small"
          margin="normal"
          required
          fullWidth
          id="valorVenda"
          label="Valor de Venda"
          type="number"
          name="valorVenda"
          value={valorVenda}
          onChange={(e) => setValorVenda(e.target.value)}
        />
        <TextField
        size="small"
          margin="normal"
          required
          fullWidth
          id="observacoes"
          label="Observações"
          multiline
          rows={4}
          name="observacoes"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button type="button" variant="outlined" color="error">
          Cancelar
        </Button>
        <button type="submit" className="btn btn-primary">
      Salvar
    </button>
      </Box>
    </Box>


   
   <form method="post" onSubmit={newProduct} style={{ maxWidth: "600px", maxHeight: "80vh",  }}>
  <div className="modal-header">
    <h5 className="modal-title" id="exampleModalLabel">
      Cadastro de Produto
    </h5>
   
  </div>
  <div className="modal-body" style={{ overflowY: "auto" }}>
    <div className="mb-3">
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
        value={unidadeMedida}
        onChange={(e) => setUnidadeDeMedida(e.target.value)}
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
        type="number"
        className="form-control"
        id="quantidadeEstoque"
        required
        value={quantidadeEstoque}
        onChange={(e) => setQuantidade(e.target.value)}
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
        value={valorCompra}
        onChange={(e) => setValorCompra(e.target.value)}
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
        value={valorVenda}
        onChange={(e) => setValorVenda(e.target.value)}
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
        value={observacoes}
        onChange={(e) => setObservacoes(e.target.value)}
      ></textarea>
    </div>
  </div>
  <div className="modal-footer">
    <button type="button" className="btn btn-secondary">
      Cancelar
    </button>
    <button type="submit" className="btn btn-primary">
      Salvar
    </button>
  </div>
</form>

   
   
   
   </>
  );
}
