import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Peer from "simple-peer";
import io from "socket.io-client";

import url from "../../../baseUrl.js";

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        });
    },[]);

    return (
        <div className="card col-sm-12 col-md-6 col-lg-4 mx-3" >
            <video playsInline autoPlay ref={ref} />
            <div className="card-body">
                <h5 className="card-title">{props.id}</h5>
            </div>
        </div>
    );
}

const Room = (props) => {

    const [peers, setPeers] = useState(() => []);
    const [video, setVideo] = useState(() => sessionStorage.getItem('video') === 'true');
    const [audio, setAudio] = useState(() => sessionStorage.getItem('audio') === 'true');

    const myVideo = useRef();
    const peersRef = useRef([]);
    
    const history = useHistory();

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

    useEffect(() => {

        const socket = io(url);
        const roomID = props.roomID;
        const createPeer = (receiver, sender, stream) => {
            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream,
            });
            peer.on("signal", signal => {
                socket.emit("sending signal", { receiver, signal, sender })
            });
            return peer;
        }
    
        const addPeer = (incomingSignal, sender, stream) => {
            const peer = new Peer({
                trickle: false,
                stream,
            });
    
            peer.on("signal", signal => {
                socket.emit("returning signal", { signal, sender });
            });
            peer.signal(incomingSignal);
            return peer;
        }

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            myVideo.current.srcObject = stream; 
            socket.emit("join room", roomID);

            socket.on("room full", () => {
                history.push("/");
            });
            socket.on("allExceptMe", users => {
                const peers = [];
                users.forEach( (receiver) => {
                    const peer = createPeer(receiver, socket.id, stream);
                    const x = {
                        peerID: receiver,
                        peer,
                    };
                    peersRef.current.push(x);
                    peers.push(x);
                });
                setPeers(peers);
            });

            socket.on("user-joined", (data) => {
                const peer = addPeer(data.signal, data.sender, stream);
                const x = {
                    peerID: data.sender,
                    peer,
                };
                peersRef.current.push(x);
                setPeers([...peersRef.current]);
            });

            socket.on("user-left", (id) => {
                const item = peersRef.current.find(p => p.peerID === id);
                item.peer.destroy();
                const x = peersRef.current.filter(p => p.peerID !== id);
                peersRef.current = x;
                setPeers(x);
            });

            socket.on("receiving returned signal", (data) => {
                const item = peersRef.current.find(p => p.peerID === data.receiver);
                item.peer.signal(data.signal);
            });
        });
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="card col-sm-12 col-md-6 col-lg-4 mx-3" >
                    <video className="card-img-top" muted ref={myVideo} autoPlay playsInline />
                    <div className="card-body">
                        <button onClick={handleVideo} className="btn btn-primary">Cam</button>
                        <button onClick={handleAudio} className="btn btn-primary">Mic</button>
                    </div>
                </div>
                {peers.map((peer) => {
                    return (
                        <Video key={peer.peerID} peer={peer.peer} id={peer.peerID}/>
                    );
                })}  
            </div>
        </div>
    );
};

export default Room;