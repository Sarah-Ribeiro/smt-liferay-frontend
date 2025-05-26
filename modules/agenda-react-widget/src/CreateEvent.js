import React, { useState, useEffect } from "react";
import moment from "moment";

export default function CreateEvent() {
  const [newEvent, setNewEvent] = useState({
    title: "",
    author: "",
    start: "",
    end: "",
    color: "#3174ad",
    allDay: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const utilizer = localStorage.getItem("utilizer");
  const email = localStorage.getItem("email");
  const userId = parseInt(localStorage.getItem("userId"));
  console.log(email);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Usuário não autenticado. Faça login novamente.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/auth/me/${userId}`,
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
        author: userData.name,
      }));
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      alert("Erro ao carregar dados do usuário.");
    }
  };

  useEffect(() => {
    const userName = localStorage.getItem("utilizer");
    if (userName) {
      setNewEvent((prev) => ({
        ...prev,
        author: userName,
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "title" || name === "author") {
      setNewEvent({ ...newEvent, [name]: value });
      return;
    }

    if (newEvent.allDay) {
      const updated =
        name === "start"
          ? moment(value).set({ hour: 9, minute: 0 })
          : moment(value).set({ hour: 18, minute: 0 });

      setNewEvent({ ...newEvent, [name]: updated.toISOString() });
    } else {
      setNewEvent({ ...newEvent, [name]: moment(value).toISOString() });
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
      let startDateTime, endDateTime;

      if (newEvent.allDay) {
       startDateTime = moment(newEvent.start).startOf("day").toISOString();
        endDateTime = moment(newEvent.end).endOf("day").toISOString();
      } else {
       startDateTime = moment(newEvent.start).toISOString();
        endDateTime = moment(newEvent.end).toISOString();
      }

      const titleFormatted = `${newEvent.title} | ${utilizer} | ${moment(
        startDateTime
      ).format("DD/MM/YYYY HH:mm")} - ${moment(endDateTime).format(
        "DD/MM/YYYY HH:mm"
      )}`;

      const eventPayload = {
        ...newEvent,
        title: titleFormatted,
        start: startDateTime,
        end: endDateTime,
        userId: userId,
      };

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
      }

      const response = await fetch("http://localhost:8001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar evento");
      }

      const data = await response.json();
      console.log("Evento criado:", data);

      window.location.href = "/web/portal-do-servidor/agenda";
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <h2>Criar Evento</h2>

      <div className="form-group">
        <label htmlFor="title">Nome do evento</label>
        <input
          required
          type="text"
          className="form-control"
          name="title"
          value={newEvent.title}
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
      </div>

      <div className="form-group d-flex flex-row align-items-center">
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
        {isSubmitting ? "Criando..." : "Criar evento"}
      </button>
    </div>
  );
}