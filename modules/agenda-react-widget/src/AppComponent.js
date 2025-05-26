import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useHistory, useLocation  } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/pt-br";

const localizer = momentLocalizer(moment);

export default function AppComponent() {
    const messages = {
        date: "Data",
        time: "Hora",
        event: "Evento",
        allDay: "Dia inteiro",
        week: "Semana",
        work_week: "Semana útil",
        day: "Dia",
        month: "Mês",
        previous: "Anterior",
        next: "Próximo",
        yesterday: "Ontem",
        tomorrow: "Amanhã",
        today: "Hoje",
        agenda: "Agenda",
        noEventsInRange: "Não há eventos neste período.",
        showMore: (total) => `+ ver mais (${total})`,
      };

  const history = useHistory();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const utilizer = localStorage.getItem("utilizer");
  const role = localStorage.getItem("role"); // Recupera a role diretamente do localStorage

  const isAdmin = role?.toUpperCase().trim() === "ADMIN";

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
    fetchEvents();
  }, [location.state?.eventoCriado]);

  return (
    <div>
      <div className="d-flex flex-row align-items-center">
        <button
          className="btn btn-primary ml-5"
          onClick={() => history.push("/create")}
        >
          Criar Evento
        </button>
                {isAdmin && (
                  <button
                    className="btn btn-danger ml-5"
                    onClick={() => history.push("/delete")}
                  >
                    Deletar Escala de Funcionário
                  </button>
                )}
      </div>

      {loading ? (
              <p>Carregando eventos...</p>
            ) : isAdmin ? (
              <>
                <h1 className="my-3 text-center">Todos os turnos</h1>
                <Calendar
                  localizer={localizer}
                  messages={messages}
                  events={events}
                  allDayAccessor="allDay"
                  culture="pt-BR"
                  startAccessor="start"
                  endAccessor="end"
                  defaultView="month"
                  style={{ height: 500, margin: "50px" }}
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: event.color || "#3174ad",
                      color: "white",
                      borderRadius: "5px",
                      padding: "4px",
                    },
                  })}
                />
              </>
            ) : (
              <>
                <h1 className="my-3 text-center">{utilizer}</h1>
                <Calendar
                  localizer={localizer}
                  messages={messages}
                  culture="pt-BR"
                  events={events}
                  allDayAccessor="allDay"
                  startAccessor="start"
                  endAccessor="end"
                  defaultView="month"
                  style={{ height: 500, margin: "50px" }}
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: event.color || "#3174ad",
                      color: "white",
                      borderRadius: "5px",
                      padding: "4px",
                    },
                  })}
                />
              </>
            )}
    </div>
  );
}