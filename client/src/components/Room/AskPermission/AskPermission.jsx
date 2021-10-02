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

    return (
        <div>
            {
                ask
                ?<Room roomID={props.roomID} />
                :(<div className="container-fluid vh-100">
                    <div className="row vh-100 ">
                        
                        <div className="col-12 col-lg-6 m-auto">
                            <div className="tablet m-5"> 
                                <div className="content"> 
                                    <video className="ratio ratio-1x1 myVideo" ref={myVideo} muted autoPlay playsInline /> 
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6 m-auto">
                            <div className="input-group mb-4">
                                <span className="input-group-text">@Username</span>
                                <input type="text" name="user" className="form-control" placeholder={name} onChange={handleName} />
                            </div>
                            <button onClick={handleVideo} className="btn btn-secondary btn-icon mx-3">
                                {
                                    (video)
                                    ?<i className="fa fa-video-camera fa-2x" />
                                    :<i className="fa fa-video-camera-slash fa-2x" />
                                }
                            </button>
                            <button onClick={handleAudio} className="btn btn-secondary btn-icon mx-3">
                                {
                                    (audio)
                                    ?<i className="fa fa-microphone fa-2x" />
                                    :<i className="fa fa-microphone-slash fa-2x" />
                                }
                            </button>
                            <button onClick={handleJoin} className="btn btn-secondary btn-icon mx-3">
                                <i class="fa fa-handshake-o fa-2x" />
                            </button>
                        </div>
                    </div>
                </div>)
            }
        </div>
    );
};

export default AskPermission; 