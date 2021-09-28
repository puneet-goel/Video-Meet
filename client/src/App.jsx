import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./components/Home/Home.jsx";
import ProtectedRoute from "./components/ProtectedComponent/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ Home } />   
        <Route exact path="/:roomId" component={ ProtectedRoute } />
      </Switch>
    </BrowserRouter>
  );
}

export default App;