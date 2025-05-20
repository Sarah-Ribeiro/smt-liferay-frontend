import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useHistory } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function EscalaComponent() {
  const history = useHistory();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const utilizer = localStorage.getItem("utilizer");
  const role = localStorage.getItem("role");

  const users = [
    { id: 1, title: "João" },
    { id: 2, title: "Maria" },
    { id: 3, title: "José" },
    { id: 4, title: "Ana" },
    { id: 5, title: "Carlos" },
  ];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      if (!token) {
        console.error("Token não encontrado no localStorage.");
        return;
      }

      const response = await fetch("http://localhost:8001/api/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const formatted = data.map((evt) => {
          const startDate = new Date(evt.start);
          const endDate = new Date(evt.end);
          return {
            ...evt,
            start:
              startDate instanceof Date && !isNaN(startDate)
                ? startDate
                : new Date(),
            end:
              endDate instanceof Date && !isNaN(endDate) ? endDate : new Date(),
          };
        });
        setEvents(formatted);
      } else {
        console.error("Erro ao buscar eventos: ", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao fazer requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(); // Carrega eventos
  }, []);

  return (
    <div className="container">
      <div className="d-flex flex-row align-items-center">
        <button
          className="btn btn-primary ml-5"
          onClick={() => history.push("/criar-evento")}
        >
          Criar Evento
        </button>
        <button
          className="btn btn-danger ml-5"
          onClick={() => history.push("/deletar-evento")}
          disabled={role?.toUpperCase().trim() !== "ADMIN"} // Verificação mais robusta
          title={
            role.trim() !== "ADMIN"
              ? "Apenas administradores podem deletar eventos"
              : ""
          }
        >
          Deletar Evento
        </button>
      </div>

      <div style={{ flex: 1 }}>
        {loading ? (
          <p>Carregando eventos...</p>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            style={{ height: 500, margin: "50px" }}
            selectable
            onSelectEvent={(slotInfo) => {
              const title = window.prompt("Título do evento:");
              if (title && slotInfo.resourceId) {
                setEvents([
                  ...events,
                  {
                    title,
                    start: slotInfo.start,
                    end: slotInfo.end,
                    color: "#3174ad",
                    resourceId: slotInfo.resourceId,
                  },
                ]);
              }
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.color || "#3174ad",
                color: "white",
                borderRadius: "5px",
                padding: "4px",
              },
            })}
          />
        )}
      </div>
    </div>
  );
}
