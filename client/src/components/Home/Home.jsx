import React,{ useState } from "react";
import { useHistory } from "react-router-dom";
import { v1 as uuid } from "uuid";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { addRoom } from "../../api.js";
import "./Home.css";

const Home = () => {

    const [room, setRoom] = useState(() => 'Enter Room Code');
    const history = useHistory();

    const handleCreate = (event) => {
        event.preventDefault();
        const roomID = uuid();
        setRoom(roomID);
        addRoom(roomID);
    }

    const handleInput = (event) => {
        event.preventDefault();
        console.log(event.target.value);
        setRoom(event.target.value);
    }

    const handleClear = (event) => {
        event.preventDefault();
        setRoom('Enter Room Code');
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        history.push(`/check/${room}`);
    }

    return(
        <div className="p-5 d-flex justify-content-center w-100">
            <button onClick={handleCreate} type="submit" className="btn btn-primary"> Create Room </button>
            <CopyToClipboard text={room} >
                <button className="btn btn-primary" >Copy Room Link </button>
            </CopyToClipboard>
            <input name="room" className="form-control" placeholder={room} onChange={handleInput}/>
            <button onClick={handleSubmit} type="submit" className="btn btn-primary"> Submit  </button>
            <button onClick={handleClear} type="submit" className="btn btn-primary"> Clear </button>
        </div>  
    );
}

export default Home;