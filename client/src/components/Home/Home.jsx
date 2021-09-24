import React from "react";
import { useHistory } from "react-router-dom";
import "./Home.css";
import { v1 as uuid } from "uuid";

const Home = () => {

    let history = useHistory();

    const handleSubmit = (event) => {
        event.preventDefault();
        localStorage.setItem('name',event.target.name.value);
        let room = uuid();
        history.push(`/${room}`);
    }

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