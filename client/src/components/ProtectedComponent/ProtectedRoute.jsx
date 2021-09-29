import React, { useEffect, useState } from 'react';
import { Route } from "react-router-dom";
import Room from "./Room/Room.jsx";
import SpamRoom from "../SpamRoom/SpamRoom.jsx";
import { checkRoom } from "../../api.js";
import {SocketContext, socket} from '../../context/socket.js';

const ProtectedRoute = (props)  => {

    const [isThisValidRoom,setIsThisValidRoom] = useState(undefined);

    useEffect(() => {
        const check = async() => {
            const response = await checkRoom(props.match.params.roomId);
            setIsThisValidRoom(response);
        }
        check();
    }, []);
    
    if(isThisValidRoom === undefined){
        return <div></div>
    }

    const ROOM = () => {
        return (
            <SocketContext.Provider value={socket}>
                <Room room={props.match.params.roomId}/>
            </SocketContext.Provider>
        );
    }

    return (
    	<div>
	    	{
                (isThisValidRoom === true)
                ? <Route component={ROOM} /> 
                : <Route component={SpamRoom} />
            }
	    </div>
    );
}

export default ProtectedRoute;