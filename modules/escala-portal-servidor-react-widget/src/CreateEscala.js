import React, { useState, useEffect } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";

export default function CreateEscala() {
  const token = localStorage.getItem("token");
  const utilizer = localStorage.getItem("utilizer");
  const userId = parseInt(localStorage.getItem("userId")); // Forçar para número
  const history = useHistory();

  const [periodo, setPeriodo] = useState("");
  const [periodos, setPeriodos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [novaEscala, setNovaEscala] = useState({ start: "", end: "", author: {} });

  const determinarPeriodo = (horaMoment) => {
    const hora = moment(horaMoment, "HH:mm");
    if (hora.isBetween(moment("08:00", "HH:mm"), moment("12:59", "HH:mm"), null, "[]")) return "MANHA";
    if (hora.isBetween(moment("13:00", "HH:mm"), moment("18:59", "HH:mm"), null, "[]")) return "TARDE";
    if (
      hora.isBetween(moment("19:00", "HH:mm"), moment("23:59", "HH:mm"), null, "[]") ||
      hora.isBetween(moment("00:00", "HH:mm"), moment("07:59", "HH:mm"), null, "[]")
    ) return "NOITE";
    return null;
  };

  const validarHorarioPorPeriodo = (horaMoment, periodo) => {
    const hora = moment(horaMoment, "HH:mm");
    if (periodo === "MANHA") return hora.isBetween(moment("08:00", "HH:mm"), moment("12:59", "HH:mm"), null, "[]");
    if (periodo === "TARDE") return hora.isBetween(moment("13:00", "HH:mm"), moment("18:59", "HH:mm"), null, "[]");
    if (periodo === "NOITE") {
      return (
        hora.isBetween(moment("19:00", "HH:mm"), moment("23:59", "HH:mm"), null, "[]") ||
        hora.isBetween(moment("00:00", "HH:mm"), moment("07:59", "HH:mm"), null, "[]")
      );
    }
    return false;
  };

  useEffect(() => {
    if (utilizer) {
      setNovaEscala((prev) => ({ ...prev, author: utilizer }));
    }
  }, [utilizer]);

  useEffect(() => {
    if (!token) {
      alert("Usuário não autenticado. Faça login novamente.");
      return;
    }

    const fetchPeriodos = async () => {
      try {
        const response = await fetch("http://localhost:8003/api/v1/escala/periods", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao buscar períodos");
        }

        const data = await response.json();
        setPeriodos(data);
      } catch (error) {
        console.error("Erro ao buscar períodos:", error);
        alert("Erro ao carregar períodos.");
      }
    };

    fetchPeriodos();
  }, [token]);

  useEffect(() => {
    if (!novaEscala.start) return;

    const startMoment = moment(novaEscala.start);
    const calculatedEnd = startMoment.clone().add(9, "hours").format("YYYY-MM-DDTHH:mm:ss");

    setNovaEscala((prev) => ({
      ...prev,
      end: calculatedEnd,
    }));
  }, [novaEscala.start]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const currentTime = novaEscala.start ? moment(novaEscala.start).format("HH:mm") : "00:00";
    const fullDateTime = moment(`${selectedDate}T${currentTime}`).format("YYYY-MM-DDTHH:mm:ss");
    setNovaEscala((prev) => ({ ...prev, start: fullDateTime }));
  };

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    const currentDate = novaEscala.start ? moment(novaEscala.start).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
    const fullDateTime = moment(`${currentDate}T${selectedTime}`).format("YYYY-MM-DDTHH:mm:ss");

    const periodoDetectado = determinarPeriodo(selectedTime);

    if (periodo && !validarHorarioPorPeriodo(selectedTime, periodo)) {
      alert(`Horário inválido para o período ${periodo}.`);
      return;
    }

    setNovaEscala((prev) => ({ ...prev, start: fullDateTime }));

    if (!periodo && periodoDetectado) {
      setPeriodo(periodoDetectado);
    }
  };

  const handleCreateEscala = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const startMoment = moment(novaEscala.start);
      const escalaData = startMoment.format("DD/MM/YYYY");
      const horarioInicio = startMoment.format("HH:mm");

      const response = await fetch("http://localhost:8003/api/v1/escala/add", {
        method: "POST",
        body: JSON.stringify({
          data: escalaData,
          horarioInicio: horarioInicio,
          userId: userId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar evento");
      }

      alert("Evento criado com sucesso!");
      setNovaEscala({ start: "", end: "", author: {} });
      setPeriodo("");

      window.location.href = "/web/portal-do-servidor/escala"; // Redirecionamento com React Router
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <h2>Criar Escala</h2>

      <div className="form-group">
        <label>Funcionário</label>
        <input type="text" className="form-control" value={utilizer} readOnly />
      </div>

      <div className="form-group">
        <label htmlFor="periodo">Período</label>
        <select
          className="form-control"
          name="periodo"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          required
        >
          <option value="">Selecione um período</option>
          {periodos.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Data</label>
        <input
          type="date"
          className="form-control"
          value={novaEscala.start ? moment(novaEscala.start).format("YYYY-MM-DD") : ""}
          onChange={handleDateChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Horário Início</label>
        <input
          required
          type="time"
          className="form-control"
          value={novaEscala.start ? moment(novaEscala.start).format("HH:mm") : ""}
          onChange={handleTimeChange}
        />
      </div>

      <div className="form-group">
        <label>Horário Fim</label>
        <input
          required
          type="time"
          className="form-control"
          value={novaEscala.end ? moment(novaEscala.end).format("HH:mm") : ""}
          readOnly
        />
      </div>

      <button
        onClick={handleCreateEscala}
        type="button"
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adicionando..." : "Adicionar escala"}
      </button>
    </div>
  );
}