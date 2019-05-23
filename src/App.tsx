import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { SearchPage } from "./components/SearchPage";
import { MoviePage } from "./components/MoviePage";

export const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={SearchPage} />
          <Route path="/:imdbid/" component={MoviePage} />
        </Switch>
      </div>
    </Router>
  );
};
