import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CadastroComponent from "./CadastroComponent";
import InformacoesUsuario from "./InformacoesUsuario";

export default function CadastroPortlet() {
  return (
    <Router basename={Liferay.ThemeDisplay.getLayoutRelativeURL()}>
      <Routes>
        <Route path="/" element={<CadastroComponent />} />
        <Route path="/informacoes-usuario" element={<InformacoesUsuario />} />
      </Routes>
    </Router>
  );
}
