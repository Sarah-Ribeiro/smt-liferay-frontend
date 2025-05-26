import React from "react";

export default function InformacoesUsuario() {
  // Recupera os dados salvos no localStorage
  const senha = localStorage.getItem("senha");
  const matricula = localStorage.getItem("matricula");

  return (
    <div className="container my-5">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Matrícula</th>
            <th>Senha</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{matricula}</th>
            <td>{senha}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
