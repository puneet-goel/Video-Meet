import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Home from "./components/Home/Home.jsx";
import ProtectedRoute from "./components/ProtectedComponent/ProtectedRoute.jsx";
import Error from './components/Error/Error.jsx';
import AskPermission from "./components/Room/AskPermission/AskPermission.jsx";

const App = () => {

  //browser storage
  sessionStorage.setItem("isRoomValid",false);
  sessionStorage.setItem("video",true);
  sessionStorage.setItem("audio",true);
  sessionStorage.setItem("name",'');
  
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