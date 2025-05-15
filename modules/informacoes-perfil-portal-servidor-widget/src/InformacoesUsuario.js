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
      <h2 className="my-3">Informações do Usuário</h2>
      <div>
        <p><strong>Nome Completo:</strong> {fullName}</p>
        <p><strong>CPF:</strong> {cpf}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Utilitario:</strong> {utilizer}</p>
        <p><strong>Matrícula:</strong> {matricula}</p>
        <p><strong>Role:</strong> {role}</p>
      </div>
      <a href="/web/portal-do-servidor/inicio" className="font-weight-bold text-dark" style={{ textDecoration: "none", fontSize: "20px" }}>Voltar</a>
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}
