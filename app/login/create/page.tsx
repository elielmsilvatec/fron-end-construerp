"use client";

import api from "@/app/api/api";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
    
      const response = await api('/user/new', {
        method: 'POST',
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      if (
        response.status === 200 &&
        setMensagem("Cadastrado com sucesso. Faça login!")
      
      ) {
        // setMensagem(response.data.message);

     
          // router.push("/pages/login/login");
     
          setTimeout(() => {
            window.location.href = "/login/login"; // Redireciona para a página home após 2 segundos
          }, 2000);

      } else {
        // setMensagem("Erro ao cadastrar", response.ok);
        // router.push("/pages/login/login");
      }
    } catch (error) {
      console.log("Falhou .... cadastro login")
    }
  };

  return (



      <div className="d-flex align-items-center justify-content-center vh-100">
        <div
          className="card shadow-sm p-4"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <div className="card-body">
            <h5 className="card-title text-center mb-4">Cadastro</h5>
            {/* Exibe a mensagem de erro ou sucesso aqui */}
            {mensagem && (
              <div className="alert alert-info" role="alert">
                {mensagem}
              </div>
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
              <Link href="/pages/login/login">← Voltar para o login</Link>
            </div>
          </div>
        </div>
      </div>

  );
}
