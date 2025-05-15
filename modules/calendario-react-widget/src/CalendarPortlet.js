// CalendarPortlet.js
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CalendarComponent from "./CalendarComponent";
import CreateEvent from "./CreateEvent";
import DeleteEvent from "./DeleteEvent";

export default function CalendarPortlet() {
  return (
    <Router basename={Liferay.ThemeDisplay.getLayoutRelativeURL()}>
      <Switch>
        <Route path="/" exact component={CalendarComponent} />
        <Route path="/criar-evento" component={CreateEvent} />
        <Route path="/deletar-evento" component={DeleteEvent} />
      </Switch>
    </Router>
  );
}
