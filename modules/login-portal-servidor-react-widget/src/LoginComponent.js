import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Por favor, preencha o usuário e a senha.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/authenticate",
        {
          email,
          password,
        }
      );

      if (response.status === 200 && response.data?.token) {
        const { token, matricula, utilizer, role, email, cpf, fullName, id } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("matricula", matricula);
        localStorage.setItem("utilizer", utilizer);
        localStorage.setItem("role", role);
        localStorage.setItem("email", email);
        localStorage.setItem("cpf", cpf);
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("id", id);

        window.location.href = "/web/portal-do-servidor";
      } else {
        setErrorMessage("Credenciais inválidas. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao tentar logar:", error.response || error.message);
      setErrorMessage("Erro ao conectar com o servidor. Verifique seus dados.");
    }
  };

  return (
    <div className="container-fluid p-5 bg-login smt_login_portal_do_servidor">
      <div className="d-flex justify-content-between p-3 smt_login_logo_prefeitura_ajuda_portal_do_servidor">
        <a href="/home">
          <img
            src="/documents/d/guest/imagem_gerada-1-png"
            width={200}
            alt="Logo Prefeitura"
          />
        </a>
        <a href="/ajuda" className="text-decoration-none fs-4 text-dark">
          Ajuda
        </a>
      </div>

      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1 style={{ fontSize: "40px" }} className="text-center py-2">Portal do Servidor</h1>
        <div
          className="bg-white p-5 w-25 smt_login_formulario_portal_do_servidor p-5"
          style={{
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)", 
            borderRadius: "40px",
          }}
        >
          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && (
              <div className="alert alert-danger py-2">{errorMessage}</div>
            )}

            <button type="submit" className="btn btn-danger w-100 p-2">
              Entrar
            </button>

            <div className="d-flex flex-column mt-3" style={{ gap: "20px" }}>
              <a
                className="text-dark text-center"
                style={{ color: "#1F3D4B" }}
                href="/esqueceu-a-senha"
              >
                Esqueceu a senha?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
