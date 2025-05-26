import React, { useState, useEffect } from "react";

export default function InformacoesUsuario() {
  const [utilizer, setUtilizer] = useState("");
  const [matricula, setMatricula] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [fullName, setFullName] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedMatricula = localStorage.getItem("matricula");
    const storedUtilizer = localStorage.getItem("utilizer");
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email");
    const storedCpf = localStorage.getItem("cpf");
    const storedFullName = localStorage.getItem("fullName");

    if (!storedToken || !storedMatricula) {
      setError("Token ou matrícula não encontrados no localStorage.");
      return;
    }

    setUtilizer(storedUtilizer);
    setMatricula(storedMatricula);
    setRole(storedRole);
    setEmail(storedEmail);
    setCpf(storedCpf);
    setFullName(storedFullName);
  }, []);

  return (
    <div className="container pt-5 w-100 text-center">
      <h1 className="my-3">Informações do Usuário</h1>
      <table class="table my-5 table-bordered">
        <tbody>
          <tr>
            <td className="font-weight-bold" style={{ fontSize: "18px" }}>Nome Completo</td>
            <td style={{ fontSize: "18px" }}>{fullName}</td>
          </tr>
          <tr>
            <td className="font-weight-bold" style={{ fontSize: "18px" }}>CPF</td>
            <td style={{ fontSize: "18px" }}>{cpf}</td>
          </tr>
          <tr>
            <td className="font-weight-bold" style={{ fontSize: "18px" }}>Email</td>
            <td style={{ fontSize: "18px" }}>{email}</td>
          </tr>
          <tr>
            <td className="font-weight-bold" style={{ fontSize: "18px" }}>Utilitario</td>
            <td style={{ fontSize: "18px" }}>{utilizer}</td>
          </tr>
          <tr>
            <td className="font-weight-bold" style={{ fontSize: "18px" }}>Matrícula</td>
            <td style={{ fontSize: "18px" }}>{matricula}</td>
          </tr>
          <tr>
            <td className="font-weight-bold" style={{ fontSize: "18px" }}>Role</td>
            <td style={{ fontSize: "18px" }}>{role}</td>
          </tr>
        </tbody>
      </table>
      <a
        href="/web/portal-do-servidor/inicio"
        className="font-weight-bold text-dark"
        style={{ textDecoration: "none", fontSize: "18px" }}
      >
        Voltar
      </a>
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}
