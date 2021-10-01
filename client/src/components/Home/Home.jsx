import React from "react";
import { useHistory } from "react-router-dom";
import { v1 as uuid } from "uuid";

import "./Home.css";

const Home = () => {

    const history = useHistory();

    const handleCreate = (event) => {
        event.preventDefault();
        const roomID = uuid();
        sessionStorage.setItem("RoomID",roomID);
        history.push(`/check/${roomID}`);
    }

    return(
        <div className="p-5 m-5 d-flex justify-content-center w-100">
            <button onClick={handleCreate} type="submit" className="btn btn-primary"> Create Room </button>
        </div>
    );
}

export default Home;