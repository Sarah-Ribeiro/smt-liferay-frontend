import React, { useEffect, useState } from "react";
import moment from "moment";

export default function EventManager() {
  const [escalas, setEscalas] = useState([]);
  const token = localStorage.getItem("token");
  const utilizer = localStorage.getItem("utilizer");

  // Buscar eventos ao carregar a página
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8003/api/v1/escala/search", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        const formattedEvents = data.map((escala) => {
          const startFormatted = moment.utc(escala.start).local().format("DD/MM/YYYY HH:mm");
          const endFormatted = moment.utc(escala.end).local().format("DD/MM/YYYY HH:mm");
          const title = `${utilizer}`;

          return {
            ...escala,
            title,
            start: new Date(escala.start),
            end: new Date(escala.end),
          };
        });

        setEscalas(formattedEvents);
      } catch (err) {
        console.error("Erro ao carregar eventos", err);
      }
    };

    fetchEvents();
  }, [token, utilizer]);

  // Deletar evento
  const handleDeleteEvent = async (escalaId) => {
    try {
      const response = await fetch(
        `http://localhost:8003/api/v1/escala/delete/${escalaId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok)
        throw new Error("Um usuário comum não pode deletar este evento.");

      setEscalas((prev) => prev.filter((escala) => escala.id !== escalaId));
      alert("Evento deletado com sucesso!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Lista de Escalas</h2>
      <ul className="list-group">
        {escalas.map((escala) => (
          <li
            key={escala.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="d-flex flex-column" style={{ gap: "10px", fontSize: "18px" }}>
            <span>{utilizer} - <strong>Horário Inicio:</strong> {escala.horarioInicio} - <strong>Horário Fim:</strong> {escala.horarioFim} - <strong>Data:</strong> {escala.data}</span>
                        <span>{escala.periodo}</span>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDeleteEvent(escala.id)}
            >
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
