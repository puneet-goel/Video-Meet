import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./components/Home/Home.jsx";
import Room from "./components/Room/Room.jsx";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/:roomId" component={Room} />
        <Route exact path="/" component={Home} />    
      </Switch>
    </BrowserRouter>
  );
}

export default App;