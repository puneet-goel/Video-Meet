import React, { useEffect, useState } from "react";

import "./clock.css";

const Clock = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const options = {hour: 'numeric', minute: 'numeric', hour12: true  };

    const [clock,setClock] = useState(() => new Date());
    
    const refreshClock = () => {
        setClock(new Date());
    }

    useEffect(() => {
        const timerId = setInterval(refreshClock, 1000);
        return function cleanup() {
            clearInterval(timerId);
        };
    },[]);
    
    return (
        <div className="text-center date mt-5">
          <h1 className="fw-bold">{clock.toLocaleString('en-US',options)}</h1>
          <p className="fst-italic">{`${days[clock.getDay()]}, ${months[clock.getMonth()]} ${clock.getDate()}`}</p>
        </div>
    );
}

export default Clock;