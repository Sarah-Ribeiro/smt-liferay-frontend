import React from "react";

export default function InformacoesUsuario() {
  // Recupera os dados salvos no localStorage
  const senha = localStorage.getItem("senha");
  const matricula = localStorage.getItem("matricula");

  return (
    <div className="container">
      <h2>Informações do Usuário</h2>
      <p>
        <strong>Senha:</strong> {senha}
      </p>
      <p>
        <strong>Matrícula:</strong> {matricula}
      </p>
    </div>
  );
}
