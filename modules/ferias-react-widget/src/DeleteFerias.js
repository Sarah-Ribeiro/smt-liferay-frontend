import React, { useState, useEffect } from "react";

export default function DeleteHolidays() {
  const [holidays, setHolidays] = useState([]);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  const utilizer = localStorage.getItem("utilizer");
  const id = localStorage.getItem("id");

  // Buscar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/v1/auth/me/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar dados do usuário.");

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        alert("Erro ao carregar dados do usuário.");
      }
    };

    fetchUserData();
  }, [id, token]);

  // Buscar lista de ferias
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch("http://localhost:8002/api/ferias", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar ferias.");

        const data = await response.json();
        setHolidays(data);
      } catch (err) {
        console.error("Erro ao carregar ferias:", err);
        alert("Erro ao carregar ferias.");
      }
    };

    fetchHolidays();
  }, [token]);

  // Deletar feriado
  const handleDeleteHoliday = async (holidayId) => {
    try {
      const response = await fetch(`http://localhost:8002/api/ferias/${holidayId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar feriado. Verifique suas permissões.");
      }

      setHolidays((prev) => prev.filter((holiday) => holiday.feriasId !== holidayId));
      console.log(`Deletado: http://localhost:8002/api/ferias/${holidayId}`);
      alert("Feriado deletado com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar feriado:", error);
      alert(error.message);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Gerenciador de ferias</h2>
      <hr />

      <h4 className="mt-4">Lista de ferias</h4>
      <ul className="list-group">
        {holidays.map((holiday) => (
          <li
            key={holiday.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span style={{ whiteSpace: "pre-line" }}>{holiday.title}</span>
            <button
              onClick={() => handleDeleteHoliday(holiday.feriasId)}
              className="btn btn-danger btn-sm"
            >
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
