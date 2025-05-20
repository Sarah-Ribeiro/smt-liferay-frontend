import React, { useState, useEffect } from "react";
import moment from "moment";

export default function EventManager() {
  const [newEvent, setNewEvent] = useState({
    title: "",
    author: "",
    start: "",
    end: "",
    color: "#3174ad",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  const utilizer = localStorage.getItem("utilizer");
  const id = localStorage.getItem("id");

  // Busca dados do usuário
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

        if (!response.ok) {
          throw new Error("Erro ao buscar dados do usuário.");
        }

        const userData = await response.json();
        setUser(userData);

        // Define o autor do evento como o nome do usuário logado
        setNewEvent((prevEvent) => ({
          ...prevEvent,
          author: userData.name,
        }));
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        alert("Erro ao carregar dados do usuário.");
      }
    };

    fetchUserData();
  }, []);

  // Busca lista de eventos
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Erro ao carregar eventos", err);
      }
    };

    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleCreateEvent = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const startDateTime = moment(newEvent.start).toISOString();
      const endDateTime = moment(newEvent.end).toISOString();

      const titleFormatted = `${newEvent.title}\n${newEvent.author}\n${moment(
        startDateTime
      ).format("DD/MM/YYYY HH:mm")} - ${moment(endDateTime).format("DD/MM/YYYY HH:mm")}`;

      const eventPayload = {
        ...newEvent,
        title: titleFormatted,
        start: startDateTime,
        end: endDateTime,
      };

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

      const createdEvent = await response.json();
      setEvents([...events, createdEvent]);
      alert("Evento criado com sucesso!");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:8001/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Um usuario comum nao pode deletar um evento");

      setEvents(events.filter((event) => event.id !== eventId));
      alert("Evento deletado com sucesso.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Gerenciador de Eventos</h2>

      <hr />

      <h4 className="mt-4">Lista de Eventos</h4>
      <ul className="list-group">
        {events.map((event) => (
          <li key={event.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span style={{ whiteSpace: "pre-line" }}>{event.title}</span>
            <button onClick={() => handleDeleteEvent(event.id)} className="btn btn-danger btn-sm">
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
