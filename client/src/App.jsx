import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedComponent/ProtectedRoute.jsx";
import AskPermission from "./components/AskPermission/AskPermission.jsx";
import Error from './components/Error/Error.jsx';
import Home from "./components/Home/Home.jsx";
import init from './storageInit.js';

const App = () => {

  init();
  
  //  Conditional Rendering 
  const Check = (props) => {
    const roomID = props.match.params.roomID;
    const x = sessionStorage.getItem("isRoomValid");
    
    if(x === 'false'){
      return ( <Redirect to={`/check/${roomID}`} /> );
    }else{
      return ( <AskPermission roomID={roomID}/> );
    }
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ Home } />  
        <Route exact path="/uh-oh" component={ Error } />
        <Route exact path="/check/:roomID" component={ ProtectedRoute } /> 
        <Route exact path="/:roomID" >
          {Check}
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;