import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Importe o hook useNavigate

export default function CadastroComponent() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Crie a função de navegação

  const handleRegister = async (e) => {
    e.preventDefault(); // Evita recarregar a página

    // Verificação se campos obrigatórios estão preenchidos
    if (!fullName || !cpf || !email) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/register",
        {
          fullName: fullName,
          cpf: cpf,
          email: email,
        }
      );

      console.log("Registro realizado:", response.data);

      const { password, matricula } = response.data;

      // Salvar a senha e a matrícula no localStorage
      localStorage.setItem("senha", password);
      localStorage.setItem("matricula", matricula);
      // Navegação para a próxima página após o sucesso
      navigate("/informacoes-usuario");
    } catch (err) {
      console.error("Erro no registro:", err);
      setError("Erro ao tentar registrar, tente novamente mais tarde.");
    }
  };

  return (
    <div className="container-fluid p-5 bg-cadastro smt_cadastro_portal_do_servidor">
      <div className="d-flex justify-content-between p-3 smt_cadastro_logo_prefeitura_ajuda_portal_do_servidor">
        <a href="/home">
          <img
            src="/documents/d/guest/logo-prefeitura-1"
            alt="Logo Prefeitura"
          />
        </a>
        <a
          href="/ajuda"
          className="text-decoration-none"
          style={{ fontSize: "24px", color: "#1F3D4B" }}
        >
          Ajuda
        </a>
      </div>

      <div className="d-flex flex-column justify-content-end align-items-end p-5">
        <div
          className="bg-white p-5 w-50 smt_cadastro_formulario_portal_do_servidor"
          style={{
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
            borderRadius: "40px",
          }}
        >
          <h2 className="text-center py-2">Portal do Servidor</h2>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <input
                placeholder="Nome Completo"
                type="text"
                className="form-control"
                value={fullName || ""}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                placeholder="Email"
                type="email"
                className="form-control"
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                placeholder="CPF"
                type="text"
                className="form-control"
                value={cpf || ""}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>} 
            <button
              type="submit"
              className="btn btn-danger text-white w-100 p-2"
            >
              Registrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
