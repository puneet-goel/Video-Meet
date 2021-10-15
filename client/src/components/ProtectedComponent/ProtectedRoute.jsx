import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";

import { checkRoom } from "../../api.js"
import Loader from "../UI/Loader/Loader.jsx";

const ProtectedRoute = (props)  => {

    const history =  useHistory();
    useEffect(() => {
        const roomID = props.match.params.roomID;
        const check  = async() => {
            const response = await checkRoom(roomID); 
            if(response === true) {
                //history get executed once this component unmounts and everything after this gets executed
                sessionStorage.setItem("isRoomValid",true);
                history.push(`/${roomID}`);
            }else{
                history.push(`/uh-oh`);
            }
        }

        check();
    }, [history,props]);

    return (
    	<div className="vh-100 bg-dark">
            <Loader />
        </div>
    );
}

export default ProtectedRoute;