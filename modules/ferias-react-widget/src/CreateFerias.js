import React, { useState, useEffect } from "react";
import moment from "moment";

export default function CreateFerias() {
  const [newEvent, setNewEvent] = useState({
    title: "",
    author: "",
    start: "",
    end: "",
    color: "#3174ad",
    allDay: true,
  });

  const [days, setDays] = useState(0); // NOVO: dias de férias
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const utilizer = localStorage.getItem("utilizer");
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/auth/me/${utilizer}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar dados do usuário.");
        }

        const userData = await response.json();
        setUser(userData);

        setNewEvent((prevEvent) => ({
          ...prevEvent,
          author: utilizer,
        }));
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        alert("Erro ao carregar dados do usuário.");
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "title" || name === "author") {
      setNewEvent({ ...newEvent, [name]: value });
      return;
    }

    if (name === "start") {
      const updatedStart = newEvent.allDay
        ? moment(value).set({ hour: 9, minute: 0 })
        : moment(value);

      let updatedEnd = newEvent.end;

      // NOVO: calcula a data de fim se "days" estiver preenchido
      if (days > 0) {
        updatedEnd = updatedStart
          .clone()
          .add(days - 1, "days")
          .set({ hour: 18, minute: 0 });
      }

      setNewEvent({
        ...newEvent,
        start: updatedStart.toISOString(),
        end: updatedEnd ? updatedEnd.toISOString() : "",
      });

      return;
    }

    if (name === "end") {
      const updated = newEvent.allDay
        ? moment(value).set({ hour: 18, minute: 0 })
        : moment(value);

      setNewEvent({ ...newEvent, end: updated.toISOString() });
      return;
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    const baseStart = newEvent.start ? moment(newEvent.start) : moment();
    const baseEnd = newEvent.end ? moment(newEvent.end) : moment();

    if (checked) {
      const adjustedStart = baseStart.clone().set({ hour: 9, minute: 0 });
      const adjustedEnd = baseEnd.clone().set({ hour: 18, minute: 0 });

      setNewEvent((prevEvent) => ({
        ...prevEvent,
        [name]: checked,
        start: adjustedStart.toISOString(),
        end: adjustedEnd.toISOString(),
      }));
    } else {
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        [name]: checked,
      }));
    }
  };

  const handleCreateEvent = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const startDateTime = moment(newEvent.start).toISOString();
      const endDateTime = moment(newEvent.end).toISOString();

      const titleFormatted = `Férias - ${utilizer} | ${utilizer} | ${moment(
        startDateTime
      ).format("DD/MM/YYYY HH:mm")} - ${moment(endDateTime).format(
        "DD/MM/YYYY HH:mm"
      )}`;

      const eventPayload = {
        ...newEvent,
        title: titleFormatted,
        start: startDateTime,
        end: endDateTime,
      };

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
      }

      const response = await fetch("http://localhost:8002/api/ferias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar ferias.");
      }

      const data = await response.json();
      console.log("Ferias criado:", data);

      window.location.href = "/web/portal-do-servidor/ferias";
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <h2>Adicionar Férias</h2>

      <div className="form-group">
        <label htmlFor="title">Título</label>
        <input
          required
          type="text"
          className="form-control"
          name="title"
          value={`Férias - ${utilizer}`}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="author">Autor</label>
        <input
          type="text"
          className="form-control"
          name="author"
          value={utilizer}
          readOnly
        />
      </div>

      {/* NOVO: Campo de quantidade de dias */}
      <div className="form-group">
        <label htmlFor="days">Quantidade de Dias de Férias</label>
        <input
          type="number"
          min="1"
          className="form-control"
          name="days"
          value={days}
          onChange={(e) => {
            const inputDays = parseInt(e.target.value, 10);
            setDays(inputDays);

            if (newEvent.start) {
              const newEnd = moment(newEvent.start)
                .add(inputDays - 1, "days")
                .set({ hour: 18, minute: 0 });
              setNewEvent((prev) => ({
                ...prev,
                end: newEnd.toISOString(),
              }));
            }
          }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="start">Início</label>
        <input
          required
          type={newEvent.allDay ? "date" : "datetime-local"}
          className="form-control"
          name="start"
          value={
            newEvent.start
              ? moment(newEvent.start).format(
                  newEvent.allDay ? "YYYY-MM-DD" : "YYYY-MM-DDTHH:mm"
                )
              : ""
          }
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        {newEvent.start && days > 0 ? (
          <>
            <label htmlFor="end">Fim</label>
            <input
              required
              type={newEvent.allDay ? "date" : "datetime-local"}
              className="form-control"
              name="end"
              value={
                newEvent.end
                  ? moment(newEvent.end).format(
                      newEvent.allDay ? "YYYY-MM-DD" : "YYYY-MM-DDTHH:mm"
                    )
                  : ""
              }
              onChange={handleInputChange}
            />
          </>
        ) : (
          <small className="text-muted">
            Preencha a data de início e a quantidade de dias para visualizar a
            data final.
          </small>
        )}
      </div>

      <div className="form-group d-none">
        <label htmlFor="diaInteiro" className="mr-3">
          Dia Inteiro
        </label>
        <input
          type="checkbox"
          className="form-check-input"
          name="allDay"
          checked={newEvent.allDay}
          onChange={handleCheckboxChange}
        />
      </div>

      <button
        onClick={handleCreateEvent}
        type="button"
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Criando..." : "Criar Férias"}
      </button>
    </div>
  );
}
