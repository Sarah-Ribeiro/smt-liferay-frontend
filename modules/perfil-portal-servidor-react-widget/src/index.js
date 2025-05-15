import React from "react";
import ReactDOM from "react-dom";
import PerfilFuncionarioComponent from "./PerfilFuncionarioComponent";

export default function main(params) {
  ReactDOM.render(
    <PerfilFuncionarioComponent />,
    document.getElementById(params.portletElementId)
  );
}
