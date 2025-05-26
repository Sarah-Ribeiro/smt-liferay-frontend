import React from "react";
import ReactDOM from "react-dom";

import EscalaPortlet from "./EscalaPortlet";

export default function main(params) {
  ReactDOM.render(
    <EscalaPortlet />,
    document.getElementById(params.portletElementId)
  );
}
