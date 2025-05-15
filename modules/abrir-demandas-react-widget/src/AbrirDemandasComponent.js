import React from "react";

export default function AbrirDemandasComponent() {
  return (
    <div>
      <h1 className="my-5">Abrir de Demandas</h1>

      <div
        className="border-top border-primary rounded"
        style={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)" }}
      >
        <div className="p-3">
          <span>Busca por processo</span>
        </div>

        <hr />


        <div>
          <span className="px-3 font-weight-bold">Processo</span>
          <div className="input-group smt_input_busca_abrir_demandas p-3">
          <input
            type="search"
            className="form-control rounded"
            id="smt_busca_abrir_demandas"
            aria-label="Buscar"
            onClick={() => window.location.href = "/web/portal-do-servidor/processos"}
          />
          <div className="input-group-append">
            <button
              className="input-group-text btn btn-danger"
              type="submit"
              id="smt_botao_busca_abrir_demandas"
            >
              <img
                src="/documents/d/portal-do-servidor/trash-solid"
                alt="Ícone Lixo"
              />
            </button>
          </div>
          <div className="input-group-append">
            <button
              className="input-group-text btn btn-primary"
              type="submit"
              id="smt_botao_busca_abrir_demandas"
              onClick={() => window.location.href = "/web/portal-do-servidor/processos"}
            >
              <img
                src="/documents/d/portal-do-servidor/magnifying-glass-solid"
                alt="Ícone Busca"
              />
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
