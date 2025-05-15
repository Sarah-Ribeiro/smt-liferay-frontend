import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EsqueceuASenhaComponent(props) {
  const [cpf, setCpf] = useState("");
  const [matricula, setMatricula] = useState("");
  const [newPassword, SetNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleEsqueceuASenha = async (e) => {
    e.preventDefault();

    if (!cpf.trim() && !matricula.trim()) {
      setErrorMessage("Por favor, preencha o CPF ou a matrícula.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:8000/api/v1/auth/forgot-password",
        { cpf, matricula, newPassword }
      );

      if (response.status === 200 && response.data !== "Invalid credentials") {
        const { token, matricula, username, senha } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("matricula", matricula);
        localStorage.setItem("username", username);
        localStorage.setItem("senha", senha);

        window.location.href = "/login-portal-do-servidor";
      } else {
        setErrorMessage("O CPF ou matrícula não foram encontrados.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao conectar com o servidor. Verifique seus dados.");
    }
  };

  return (
    <div className="container-fluid p-5 bg-esqueceu_a_senha smt_esqueceu_a_senha_portal_do_servidor">
      <div className="d-flex justify-content-between p-3 smt_esqueceu_a_senha_logo_prefeitura_ajuda_portal_do_servidor">
        <a href="/home">
          <img
            src="/documents/d/guest/logo-prefeitura-1"
            alt="Logo Prefeitura"
          />
        </a>
        <a href="/ajuda" className="text-decoration-none fs-4 text-dark">
          Ajuda
        </a>
      </div>

      <div className="d-flex flex-column justify-content-end align-items-end p-5">
        <div
          className="bg-white p-5 w-50 smt_esqueceu_a_senha_formulario_portal_do_servidor"
          style={{
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
            borderRadius: "40px",
          }}
        >
          <h2 className="text-center py-2">Portal do Servidor</h2>

          <form onSubmit={handleEsqueceuASenha}>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>

            <div className="form-group mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Matricula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
              />
            </div>

            <div className="form-group mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Nova Senha"
                value={newPassword}
                onChange={(e) => SetNewPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && (
              <div className="alert alert-danger py-2">{errorMessage}</div>
            )}

            <button type="submit" className="btn btn-danger w-100 p-2">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
