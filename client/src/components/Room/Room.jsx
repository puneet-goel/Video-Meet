import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";

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
                <a href="/" className="btn btn-primary">Go somewhere</a>
            </div>
        </div>
    );
}

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const [myID, setMyID] = useState(0);
    const userVideo = useRef();
    const peersRef = useRef([]);
    const history = useHistory();

    useEffect(() => {
        const socket = io("http://localhost:5000");
        
        socket.on("connect", () => {
            setMyID(socket.id);
        });

        const roomID = props.match.params.roomId;
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

        navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
            userVideo.current.srcObject = stream;
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
        })
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="card col-sm-12 col-md-6 col-lg-4 mx-3" >
                    <video className="card-img-top" muted ref={userVideo} autoPlay playsInline />
                    <div className="card-body">
                        <h5 className="card-title">Me - {myID}</h5>
                        <a href="/" className="btn btn-primary">Go somewhere</a>
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