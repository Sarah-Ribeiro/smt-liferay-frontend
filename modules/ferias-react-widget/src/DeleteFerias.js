import React, { useState, useEffect } from "react";
import moment from "moment";

export default function DeleteFerias() {
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

  // Busca dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        alert("Usuário não autenticado. Faça login novamente.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/v1/auth/me/${utilizer}`, {
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

  // Busca lista de ferias
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8002/api/ferias", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Erro ao carregar ferias", err);
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
        throw new Error(errorData.message || "Erro ao adicionar ferias.");
      }

      const createdEvent = await response.json();
      setEvents([...events, createdEvent]);
      alert("Ferias adicionada com sucesso!");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (feriasId) => {
    try {
      const response = await fetch(`http://localhost:8002/api/ferias/${feriasId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Um usuario comum nao pode deletar um a ferias de outro usuario");

      setEvents(events.filter((event) => event.id !== feriasId));
      alert("Ferias deletada com sucesso.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Gerenciador de Ferias</h2>

      <hr />

      <h4 className="mt-4">Lista de Ferias</h4>
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
