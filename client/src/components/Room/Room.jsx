import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Peer from "simple-peer";
import io from "socket.io-client";
import { v1 as uuid } from "uuid";

import url from "../../baseUrl.js";
import { getTime } from "../../api.js";
import "./Room.css";
import "./Chat.css";

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        });
    },[]);

    return (
        <div className="video-element d-flex">
            <div class="ratio ratio-1x1">
                <video playsInline autoPlay ref={ref} />
            </div>
        </div>
    );
}

const Message = ({message, id}) => {

    return (
        <li className={`msg ${message.dir}-msg mb-1`}>
            <div className="msg-bubble p-1">
                <div className="msg-info ">
                    <div className="fw-bold mr-1">{message.name}</div>
                    <div className="msg-info-time">{message.time}</div>
                </div>
                {message.message}
            </div>
        </li>
    );
}

const Room = (props) => {

    const roomID = props.roomID;

    const [peers, setPeers] = useState(() => []);
    const [video, setVideo] = useState(() => sessionStorage.getItem('video') === 'true');
    const [audio, setAudio] = useState(() => sessionStorage.getItem('audio') === 'true');
    const [chat,setChat] = useState(() => []);
    const [message,setMessage] = useState(() => '');

    const myVideo = useRef();
    
    const socket = useRef(io(url));
    const myName = useRef(sessionStorage.getItem('name'));
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

    const handleLeave = (event) => {
        event.preventDefault();
        socket.current.emit('forceDisconnect');
        history.push('/');
    }

    const messageChange = (event) => {
        event.preventDefault();
        setMessage(event.target.value);
    }

    const sendMessage = (event) => {
        event.preventDefault();
        socket.current.emit('send message',{
            message: message, 
            sender: socket.current.id, 
            name: myName.current,   
            type: 'user-message',
            time: getTime(),
            roomID: roomID
        });
        setMessage('');
    }

    useEffect(() => {
        
        const createPeer = (receiver, senderName, sender, stream) => {
            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream,
            });
            peer.on("signal", signal => {
                socket.current.emit("sending signal", { receiver, senderName, signal, sender })
            });
            return peer;
        }
    
        const addPeer = (incomingSignal, sender, stream) => {
            const peer = new Peer({
                trickle: false,
                stream,
            });
    
            peer.on("signal", signal => {
                socket.current.emit("returning signal", { signal, sender });
            });
            peer.signal(incomingSignal);
            return peer;
        }

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            myVideo.current.srcObject = stream; 
            
            //syncing video and audio with landing page(AskPermission)
            myVideo.current.srcObject.getTracks()[0].enabled = audio;
            myVideo.current.srcObject.getTracks()[1].enabled = video;
            
            socket.current.emit("join room", roomID, myName.current);

            socket.current.on("room full", () => {
                history.push("/");
            });

            socket.current.on("allExceptMe", users => {
                const peers = [];
                //receiver[0] = id, receiver[1] =name
                users.forEach( (receiver) => {
                    const peer = createPeer(receiver[0], myName.current, socket.current.id, stream);
                    const x = {
                        peerID: receiver[0],
                        peerName: receiver[1],
                        peer,
                    };
                    peersRef.current.push(x);
                    peers.push(x);
                });
                setPeers(peers);
            });

            socket.current.on("user-joined", (data) => {
                const peer = addPeer(data.signal, data.sender, stream);
                const x = {
                    peerID: data.sender,
                    peerName: data.senderName,
                    peer,
                };
                peersRef.current.push(x);
                setPeers([...peersRef.current]);
            });

            socket.current.on("user-left", (id) => {
                const item = peersRef.current.find(p => p.peerID === id);
                item.peer.destroy();
                const x = peersRef.current.filter(p => p.peerID !== id);
                peersRef.current = x;
                setPeers(x);
            });

            socket.current.on("receiving returned signal", (data) => {
                const item = peersRef.current.find(p => p.peerID === data.receiver);
                item.peer.signal(data.signal);
            });

            socket.current.on("incoming message", (data) => {
                
                let dir = 'left';
                if(data.sender === socket.current.id){
                    dir = 'right';
                }

                if(data.type === 'user-join' || data.type === 'user-left'){
                    dir = 'center';
                }

                const x = {
                    id: uuid(),
                    message: data.message,
                    name: data.name,
                    dir: dir,
                    time: data.time
                };

                setChat((cur) => [...cur,x]);
            });

        }).catch(err => {
            console.log(err);
        });
    }, []);

    return (
        <div className="main">

            <div className="videos_left">
                <div className="main_videos p-3">
                    <div id="video-grid">
                        <div className="video-element d-flex">
                            <div class="ratio ratio-1x1">
                                <video playsInline autoPlay muted ref={myVideo} />
                            </div>
                        </div>
                        {peers.map((peer) => {
                            return (
                                <Video key={peer.peerID} peer={peer.peer} name={peer.peerName}/>
                            );
                        })}  
                    </div>
                </div>
                <div className="main_controls">
                    <div className="d-flex">
                        <div onClick={handleAudio} className={`text-${audio?'white':'danger'} control_button`}>
                            <i className={`fa fa-microphone${audio?'':'-slash'}`} />
                        </div>
                        <div onClick={handleVideo} className={`text-${video?'white':'danger'} control_button`}>
                            <i className={`bi bi-camera-video${video?'':'-off'}-fill`} />
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="control_button text-white">
                            <i className="fas fa-user-friends" />
                        </div>
                        <div onClick={handleLeave} className="control_button text-danger">
                            <i className="fas fa-phone" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="chat_right">
                <div className="chat_header p-1">
                    <i className="fas fa-comment-alt" />Chat
                </div>
                <div className="chat_window">
                    <ul className="messages">
                    </ul>
                </div>
                <div className="chat_form">
                    <input className="message_send" placeholder='Type message here...' value={message} onChange={messageChange}/>
                    <i className="fa fa-paper-plane" onClick={sendMessage} ></i> 
                </div>
            </div>

        </div>
    )
};

export default Room;                     