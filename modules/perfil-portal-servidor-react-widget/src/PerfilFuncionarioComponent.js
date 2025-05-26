import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PerfilFuncionarioComponent() {
  const [userName, setUserName] = useState("");
  const [matricula, setMatricula] = useState("");
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    const storedMatricula = localStorage.getItem("matricula") || "";
    const storedUserName = localStorage.getItem("utilizer") || "";
    const storedRole = localStorage.getItem("role") || "";

    if (!storedToken || !storedMatricula) {
      setError("Token ou matrícula não encontrados no localStorage.");
      return;
    }

    setToken(storedToken);
    setMatricula(storedMatricula);
    setUserName(storedUserName);
    setRole(storedRole);

    const url = `http://localhost:8000/api/v1/auth/find-by/${storedMatricula}`;
    console.log("Fazendo requisição para:", url);

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((response) => {
        console.log("Resposta da API:", response.data);
        setUserName(response.data.utilizer || "Usuário");
        setMatricula(response.data.matricula || storedMatricula);
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
        setError(
          err.response
            ? `Erro: ${err.response.status} - ${JSON.stringify(err.response.data)}`
            : "Erro ao buscar dados do usuário."
        );
      });
  }, []);

  const handleClickProfile = () => {
    window.location.href = "/web/portal-do-servidor/informacoes-usuario";
  };

  const handleRegisterClick = () => {
    window.location.href = "/web/portal-do-servidor/cadastrar-portal-do-servidor";
  };

  const isAdmin = role?.toUpperCase().trim() === "ADMIN";

  return (
    <div className="container py-5 w-100">
      <div className="d-flex flex-column align-items-end justify-content-end">
        <div className="d-flex flex-column">
          <button
            className="text-decoration-none"
            onClick={handleClickProfile}
            style={{ background: "transparent", border: "none" }}
          >
            <img
              width="100"
              height="100"
              src="/documents/d/portal-do-servidor/user-solid"
              alt="Ícone do usuário"
            />
          </button>

          <div className="d-flex flex-column mt-3">
            <strong className="text-center">{userName}</strong>
            <span className="text-center">{matricula}</span>
          </div>
          {isAdmin && (
                      <button
                        className="btn btn-danger my-3"
                        onClick={handleRegisterClick}
                      >
                        Criar um novo usuário
                      </button>
                    )}
        </div>

        {error && <p className="text-danger mt-3">{error}</p>}
      </div>
    </div>
  );
}
