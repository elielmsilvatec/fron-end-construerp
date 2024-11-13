"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import api from "@/app/api/api";
import Alert from "@mui/material/Alert";
// import CheckIcon from "@mui/icons-material/Check";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [erroMsg, setMensagem] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api("/user/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          senha: password,
        }),
      });

      const data = await res.json();
      // console.log(data.message);

      if (data.user && data.message == "Login bem-sucedido") {
        setUser(data.user);
        toast.success("Login realizado com sucesso!");
        router.push("/dashboard");
      } else {
        setMensagem("Email ou senha incorretos");
        toast.error(data.message || "Email ou senha incorretos");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <div className="card border-0 shadow">
          <div className="card-body">
            <h2 className="text-center mb-4">Faça seu Login</h2>{" "}
            {/* Exibe a mensagem de erro ou sucesso aqui */}
            {erroMsg && (
          <Alert severity="error"> {erroMsg}</Alert>             
          )}




            {/* Formulário */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="inputEmail" className="form-label">
                  Email:
                </label>{" "}
                {/* <label for="exampleInputEmail2" className="form-label">Email</label> */}
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail2"
                    placeholder="Digite seu email"
                    aria-describedby="emailHelp"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
               
              </div>{" "}
              <div className="mb-3">
               
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword2" className="form-label">
                    Senha:
                  </label>{" "}
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="exampleInputPassword2"
                      placeholder="Digite sua senha"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>{" "}

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMeCheck"
                />{" "}
                <label className="form-check-label" htmlFor="rememberMeCheck">
                  Lembrar minha senha{" "}
                </label>{" "}
              </div>{" "}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}{" "}
              </button>{" "}
            </form>{" "}
            <div className="text-center text-sm text-gray-600">
              <div className="text-center mt-3">
                <Link href="/login/create"> Cadastre-se</Link>{" "}
              </div>{" "}
              <p>Email: teste@gmail.com</p> <p>Senha: 123</p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}