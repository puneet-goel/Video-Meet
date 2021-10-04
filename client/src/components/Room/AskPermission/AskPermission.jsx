import React, { useState, useEffect, useRef } from "react";

import Room from "../Room/Room.jsx";
import coolName from "./nameGenerator.js";
import "./AskPermission.css";

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

    const handleJoin = (event) => {
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

    if(ask){
        return <Room roomID={props.roomID} />
    }

    return (
        <div>
            <div className="container-fluid">
                <div className="row vh-100">
                    
                    <div className="col-12 col-lg-6 m-auto">
                        <div className="tablet m-5"> 
                            <div className="content"> 
                                <video className="ratio ratio-1x1 myVideo" ref={myVideo} muted autoPlay playsInline /> 
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6 m-auto ">
                        <label htmlFor="username" className="form-label mb-1">@Username</label>
                        <input type="text" name="user" className="form-control mb-4" placeholder={name} onChange={handleName} />
                        <div className="d-flex justify-content-between mb-5">
                            <button onClick={handleVideo} className="btn btn-dark btn-icon">
                                {
                                    (video)
                                    ?<i className="bi bi-camera-video-fill fa-2x icons" />
                                    :<i className="bi bi-camera-video-off-fill fa-2x icons" />
                                }
                            </button>
                            <button onClick={handleAudio} className="btn btn-dark btn-icon">
                                {
                                    (audio)
                                    ?<i className="fa fa-microphone fa-2x icons" />
                                    :<i className="fa fa-microphone-slash fa-2x icons" />
                                }
                            </button>
                            <button onClick={handleJoin} className="btn btn-dark btn-icon">
                                <i className="fa fa-handshake-o fa-2x icons" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AskPermission; 