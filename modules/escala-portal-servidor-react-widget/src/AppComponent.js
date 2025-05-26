import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useHistory } from "react-router-dom";
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
  const role = localStorage.getItem("role");

  const isAdmin = role?.toUpperCase().trim() === "ADMIN";

  const fetchEscala = async () => {
      setLoading(true);
      try {
        if (!token) {
          console.error("Token não encontrado no localStorage.");
          return;
        }

        const response = await fetch("http://localhost:8003/api/v1/escala/search", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const formatted = data.map((evt) => {
            const start = moment(`${evt.data} ${evt.horarioInicio}`, "DD/MM/YYYY HH:mm").toDate();
            const end = moment(`${evt.data} ${evt.horarioFim}`, "DD/MM/YYYY HH:mm").toDate();
            return {
              ...evt,
              title: `${utilizer} - ${evt.horarioInicio} - ${evt.horarioFim}\n\n${evt.periodo}`,
              start,
              end,
              periodo: evt.periodo,
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
      fetchEscala();
  }, [location.state?.eventoCriado]);

  return (
    <div className="my-5">
      <div className="d-flex flex-row align-items-center">
        <button
          className="btn btn-primary ml-5"
          onClick={() => history.push("/create")}
        >
          Adicionar Escala
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
            defaultView="week"
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
            defaultView="week"
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
