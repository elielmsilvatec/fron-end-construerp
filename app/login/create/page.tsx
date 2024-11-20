// app/pages/cadastro/cadastro.js

"use client";

import api from "@/app/api/api";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from 'sonner';
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroMsg, setErrorMessage] = useState("");
  const [msgSucess, setMsgsucess] = useState("");
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // // Validação do lado do cliente
    // if (!validateEmail(email)) {
    //   setErrorMessage("Por favor, insira um email válido.");
    //   return;
    // }

    // if (!validatePassword(senha)) {
    //   setErrorMessage("A senha deve ter pelo menos 8 caracteres.");
    //   return;
    // }

    try {
      const response = await api("/user/new", {
        method: "POST",
        body: JSON.stringify({
          nome,
          email,
          senha  
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setMsgsucess("Cadastrado com sucesso. Faça login!");
      
        // Redireciona para a página de login após 2 segundos
        setTimeout(() => {
          window.location.href = "/login/login";
        }, 3000);
      } else {
        // Tratar erros específicos do backend
        if (response.status === 500) {
          setErrorMessage("Este email já está cadastrado.");
          toast.error("Este email já está cadastrado.");
        } else {
          setErrorMessage("Erro ao cadastrar. Tente novamente mais tarde.");
        }
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setErrorMessage("Erro ao cadastrar. Verifique sua conexão com a internet.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div
        className="card shadow-sm p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="card-body">
          {/* <h5 className="card-title text-center mb-4">Cadastro</h5> */}
          <h1 className="text-center mb-4 text-blue-700 " style={{ fontFamily: 'Monaco'}}> Cadastro de usuário</h1>
          {/* Exibe a erroMsg de erro ou sucesso aqui */}
          {/* <Toaster /> */}
          {erroMsg && (
          <Alert severity="error"> {erroMsg}</Alert>             
          )}

          {msgSucess && (
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              {msgSucess}
            </Alert>
        
          )}

        

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="nomeCadastro" className="form-label">
                Nome
              </label>
              <input
                name="nome"
                type="text"
                className="form-control"
                id="nomeCadastro"
                placeholder="Digite seu nome"
                style={{ width: "100%" }} // largura total
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="emailCadastro" className="form-label">
                E-mail
              </label>
              <input
                name="email"
                type="email"
                className="form-control"
                id="emailCadastro"
                placeholder="Digite seu e-mail"
                style={{ width: "100%" }} // largura total
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="senhaCadastro" className="form-label">
                Senha
              </label>
              <input
                name="senha"
                type="password"
                className="form-control"
                id="senhaCadastro"
                placeholder="Digite sua senha"
                style={{ width: "100%" }} // largura total
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Cadastrar
            </button>
          </form>

          <div className="text-center mt-3">
            <Link href="/login/login">← Voltar para o login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
