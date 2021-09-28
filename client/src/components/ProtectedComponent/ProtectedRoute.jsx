import React from 'react';
import { Route } from "react-router-dom";
import Room from "./Room/Room.jsx";
import NoRoom from "./NoRoom/NoRoom.jsx";
import * as api  from "../../api.js";

const ProtectedRoute = (props) => {

    const isThisValidRoom = api.checkRoom(props.match.params.roomId);

    return (
    	<div>
	    	{
                (isThisValidRoom === true)
                ? <Route component={Room} /> 
                : <Route component={NoRoom} />
            }
	    </div>
    );
}

export default ProtectedRoute;