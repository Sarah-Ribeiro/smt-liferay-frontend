// CalendarPortlet.js
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AppComponent from "./AppComponent";
import CreateEvent from "./CreateEvent";
import DeleteEvent from "./DeleteEvent";

export default function CalendarPortlet() {
  return (
    <Router basename={Liferay.ThemeDisplay.getLayoutRelativeURL()}>
      <Switch>
        <Route path="/" exact component={AppComponent} />
        <Route path="/create" component={CreateEvent} />
        <Route path="/delete" component={DeleteEvent} />
      </Switch>
    </Router>
  );
}