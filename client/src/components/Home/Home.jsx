import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v1 as uuid } from "uuid";
import "./Home.css";
import { updateRooms } from "../../api.js";

const Home = () => {

    const history = useHistory();
    const [room,setRoom] = useState(undefined);

    const handleSubmit = (event) => {
        event.preventDefault();
        localStorage.setItem('name',event.target.name.value);
        setRoom(uuid());
    }

    useEffect(() => {
        const update = async() => {
            const response = await updateRooms(room);
            history.push(`/${room}`);
        }

        if(room !== undefined){
            update();
        }
    }, [room]);

    return(
        <div className="p-5 m-5 d-flex justify-content-center w-100">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="userName" className="form-label">Your Name</label>
                    <input type="user" name="user" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    );
}

export default Home;