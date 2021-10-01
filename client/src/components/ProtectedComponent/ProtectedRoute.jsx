import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";

import { checkRoom } from "../../api.js"

const ProtectedRoute = (props)  => {

    const history =  useHistory();
    useEffect(() => {
        const roomID = props.match.params.roomID;
        const roomInBroswerStorage = sessionStorage.getItem("RoomID");
        const check  = async() => {
            const response = await checkRoom(roomID); 
            if(response === true || roomID === roomInBroswerStorage) {
                //history get executed once this component unmounts and everything after this gets executed
                sessionStorage.setItem("isRoomValid",true);
                history.push(`/${roomID}`);
            }else{
                history.push(`/uh-oh`);
            }
        }
        check();
    }, []);

    return (
    	<div>
        </div>
    );
}

export default ProtectedRoute;