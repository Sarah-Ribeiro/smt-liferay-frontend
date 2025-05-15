import React from "react";
import ReactDOM from "react-dom";
import CadastroPortlet from "./CadastroPortlet";

export default function main(params) {
  ReactDOM.render(
    <CadastroPortlet />,
    document.getElementById(params.portletElementId)
  );
}
