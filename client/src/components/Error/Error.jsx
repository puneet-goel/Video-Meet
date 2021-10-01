import React from 'react';
import { useHistory } from "react-router-dom";

import "./Error.css";

//when user tried to redirect to a room that don't exist
const Error = () => {

    const history = useHistory();
    const homePage = (event) => {
        event.preventDefault();
        history.push("/");
    }

    return (
        <div className="notfound position-absolute text-center w-100">
            <div className="notfound-404">
                <h1 className="four">
                    4<span className="cry d-inline-block"></span>4
                </h1>
            </div>
            <h2 className="oops"> Oops! Page Not Be Found </h2>
            <p className="text m-3"> Sorry but the Room you are looking for does not exist, have been removed. name changed or is temporarily unavailable </p>
            <button onClick={homePage} className="btn py-3 px-4" id='home' > Join Another Room </button>
        </div>
    );
}

export default Error;