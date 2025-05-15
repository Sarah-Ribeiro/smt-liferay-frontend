// CalendarPortlet.js
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FeriasComponent from "./FeriasComponent";
import CreateFerias from "./CreateFerias";
import DeleteFerias from "./DeleteFerias";

export default function FeriasPortlet() {
  return (
    <Router basename={Liferay.ThemeDisplay.getLayoutRelativeURL()}>
      <Switch>
        <Route path="/" exact component={FeriasComponent} />
        <Route path="/adicionar-ferias" component={CreateFerias} />
        <Route path="/deletar-ferias" component={DeleteFerias} />
      </Switch>
    </Router>
  );
}
