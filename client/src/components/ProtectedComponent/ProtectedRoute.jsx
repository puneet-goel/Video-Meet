import React from 'react';
import { Route } from "react-router-dom";
import Room from "./Room/Room.jsx";
import NoRoom from "./NoRoom/NoRoom.jsx";

const ProtectedRoute = () => {

    const isThisValidRoom = false; //check from the server 
    return (
    	<div>
	    	{
                (isThisValidRoom)
                ? <Route component={Room} /> 
                : <Route component={NoRoom} />
            }
	    </div>
    );
}

export default ProtectedRoute;