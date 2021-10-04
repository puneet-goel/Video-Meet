import React,{ useEffect, useRef } from 'react';

import "./Videos.css";

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        });
    },[]);

    return (
        <div className="col-12 col-md-6 col-lg-4 mx-3 mt-3" >
            <div className="ratio ratio-4x3">
                <video playsInline autoPlay ref={ref} />
            </div>
            <h6 className="text-center text-white mt-3">{props.name}</h6>
        </div>
    );
}

const Videos = ({myVideo, myName, peers, handleAudio, handleVideo, handleLeave}) => {
    return (
        <div className="container-fluid room bg-dark">
            <div className="row vh-100">
                <div className="video-grid d-flex p-5">
                    <div className="col-12 col-md-6 col-lg-4 mx-3 mt-3" >
                        <div className="ratio ratio-4x3">
                            <video playsInline autoPlay ref={myVideo} />
                        </div>
                        <h6 className="text-center text-white mt-3">{myName.current}</h6>
                    </div>
                    {peers.map((peer) => {
                        return (
                            <Video key={peer.peerID} peer={peer.peer} name={peer.peerName}/>
                        );
                    })}  
                </div>
    
                <div className="controls p-3 d-flex fixed-bottom">
                    <div className="d-flex">
                        <div className="control_button p-1 d-flex">
                            <i onClick={handleAudio} className="fas fa-microphone"></i>
                            <span>Mute</span>
                        </div>
                        <div className="control_button p-1 d-flex">
                            <i onClick={handleVideo} className="fas fa-video"></i>
                            <span>Stop Video</span>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="control_button p-1 d-flex">
                            <i className="fas fa-user-friends"></i>
                            <span>Participants</span>
                        </div>
                        <div className="control_button p-1 d-flex">
                            <i className="fas fa-comment-alt"></i>
                            <span>Chat</span>
                        </div>
                    </div>
                    <div className="control_button p-1 d-flex">
                        <span onClick={handleLeave} className="leave">Leave Meeting</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 

export default Videos;