import React, { useState, useEffect, useRef } from "react";

import Room from "../Room/Room.jsx";
import coolName from "./nameGenerator.js";

const AskPermission = (props) => {

    const [name, setName] = useState(() => coolName());
    const [ask, setAsk] = useState(false);
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);

    const myVideo = useRef(null);

    const handleVideo = (event) => {
        event.preventDefault();
        sessionStorage.setItem("video",!video);
        setVideo((cur) => !cur);
        myVideo.current.srcObject.getTracks()[1].enabled = !video;
    };

    const handleAudio = (event) => {
        event.preventDefault();
        sessionStorage.setItem("audio",!audio);
        setAudio((cur) => !cur);
        myVideo.current.srcObject.getTracks()[0].enabled = !audio;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setAsk(true);
    };

    const handleName =(event) => {
        event.preventDefault();
        sessionStorage.setItem("name",event.target.value);
        setName(event.target.value);
    }

    useEffect(() => {

        sessionStorage.setItem("name",name);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
            myVideo.current.srcObject = currentStream;
        }).catch((err) => {
            console.error(err);
        });
        
    },[]);

    return (
        <div>
            {
                ask
                ?<Room roomID={props.roomID} />
                :(<div className="container mt-5">
                    <div className="row">
                        <div className="card col-sm-12 col-md-6 col-lg-4 mx-3" >
                            <video className="card-img-top" ref={myVideo} muted autoPlay playsInline />
                            <div className="card-body">
                                <button onClick={handleVideo} className="btn btn-primary">Cam</button>
                                <button onClick={handleAudio} className="btn btn-primary">Mic</button>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="userName" className="form-label">Your Name</label>
                        <input type="user" name="user" className="form-control" placeholder={name} onChange={handleName}/>
                    </div>
                    <button onClick={handleSubmit} type="submit" className="btn btn-primary" >Join</button>
                </div>)
            }
        </div>
    );
};

export default AskPermission; 