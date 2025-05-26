// CalendarPortlet.js
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AppComponent from "./AppComponent";
import CreateEscala from "./CreateEscala";
import DeleteEscala from "./DeleteEscala";

export default function CalendarPortlet() {
  return (
    <Router basename={Liferay.ThemeDisplay.getLayoutRelativeURL()}>
      <Switch>
        <Route path="/" exact component={AppComponent} />
        <Route path="/create" component={CreateEscala} />
        <Route path="/delete" component={DeleteEscala} />
      </Switch>
    </Router>
  );
}
