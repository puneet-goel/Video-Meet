import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Peer from "simple-peer";
import io from "socket.io-client";
import { v1 as uuid } from "uuid";
import 'react-toastify/dist/ReactToastify.css';

import url from "../../baseUrl.js";
import { getTime, addParticipant, removeParticipant } from "../../api.js";
import ToolTip from "../UI/ToolTip/ToolTip.jsx";
import PopOver from "../UI/PopOver/PopOver.jsx";
import "./Room.css";
import "./Chat.css";

const Video = (props) => {
    const ref = useRef();
    
    props.peer.on("stream", stream => {
        ref.current.srcObject = stream;
    });

    return (
        <video className="video-element m-2" playsInline ref={ref} autoPlay />
    );
}

const Message = ({message}) => {

    if(message.dir === 'center'){
        return (
            <div className="d-flex justify-content-center fw-bold mb-3">
                {message.message}
            </div>
        );
    }

    if(message.dir === 'end'){
        // my messages
        return (
            <div className="d-flex justify-content-end">
                <div className="message text-break mb-3 p-3">
                    <span className="my-2"> {message.message} </span>
                    <div className="d-flex justify-content-end">
                        <div className="fw-italic time"> {message.time} </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-start">
            <div className="message text-break mb-3 p-3">
                <div className="fw-bold text-center"> {message.name} </div>
                <div className="my-2"> {message.message} </div>
                <div className="d-flex justify-content-end">
                    <div className="fw-italic time"> {message.time} </div>
                </div>
            </div>
        </div>
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
        setVideo((cur) => !cur);
        if(myVideo.current.srcObject){
            if(myVideo.current.srcObject.getVideoTracks().length > 0){
                myVideo.current.srcObject.getVideoTracks()[0].enabled = !video;
            }        
        }
    };

    const handleAudio = (event) => {
        event.preventDefault();
        setAudio((cur) => !cur);
        if(myVideo.current.srcObject){
            if(myVideo.current.srcObject.getAudioTracks().length > 0){
                myVideo.current.srcObject.getAudioTracks()[0].enabled = !audio;
            }        
        }
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

        if(event.key !== 'Enter'){
            setMessage(message + event.key);
            return;
        }

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
                initiator: false,
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
            if(myVideo.current.srcObject){
                if(myVideo.current.srcObject.getVideoTracks().length > 0){
                    myVideo.current.srcObject.getVideoTracks()[0].enabled = sessionStorage.getItem('video') === 'true';
                }        
                if(myVideo.current.srcObject.getAudioTracks().length > 0){
                    myVideo.current.srcObject.getAudioTracks()[0].enabled = sessionStorage.getItem('audio') === 'true';
                } 
            }
            
            socket.current.emit("join room", roomID, myName.current);

            socket.current.on("room full", () => {
                alert("Room full!");
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

                    addParticipant(receiver[0], receiver[1]);
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
                addParticipant(data.sender, data.senderName);
                peersRef.current.push(x);
                setPeers([...peersRef.current]);
            });

            socket.current.on("user-left", (id) => {
                const item = peersRef.current.find(p => p.peerID === id);
                item.peer.destroy();
                const x = peersRef.current.filter(p => p.peerID !== id);
                peersRef.current = x;
                removeParticipant(id);
                setPeers(x);
            });

            socket.current.on("receiving returned signal", (data) => {
                const item = peersRef.current.find(p => p.peerID === data.receiver);
                item.peer.signal(data.signal);
            });

            socket.current.on("incoming message", (data) => {
                
                let dir = 'start';
                if(data.sender === socket.current.id){
                    dir = 'end';
                }

                if(data.type === 'user-join' || data.type === 'user-left'){
                    dir = 'center';

                    if(data.sender !== socket.current.id){
                        toast(`${data.message}`, {
                            position: "bottom-left",
                            autoClose: 1500,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'dark'
                        });
                    }
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

        //socket instance deleted, when user clicks back button in history
        const remove = () => {
            socket.current.emit('forceDisconnect');
        }
        window.addEventListener('popstate', remove);
        return () => {
            window.removeEventListener('popstate', remove);
        }
    }, [history, roomID]);

    return (
        <div className="container-fluid p-0">
            <div className="row vh-100 m-0">
                <main className="col-7 col-sm-8 p-0 room-videos">
                    <div className="video-grid overflow-auto">

                        <video className="video-element m-2" playsInline ref={myVideo} autoPlay muted/>
                        
                        {peers.map((peer) => {
                            return (
                                <Video key={peer.peerID} peer={peer.peer} name={peer.peerName}/>
                            );
                        })}  

                    </div>
                    
                    <nav className="navbar justify-content-center p-3 controls">
                        <div className="control-block d-flex">
                            <div onClick={handleAudio} className={`text-${audio?'white':'danger'} control-button p-2`} data-for="tool-tip" data-tip="Mic">
                                <i className={`fa fa-microphone${audio?'':'-slash'}`} />
                            </div>
                            <div onClick={handleVideo} className={`text-${video?'white':'danger'} control-button p-2`} data-for="tool-tip" data-tip="Cam">
                                <i className={`bi bi-camera-video${video?'':'-off'}-fill`} />
                            </div>
                            <div className="control-button text-white p-2" id="participants" >
                                <i className="fas fa-user-friends" />
                            </div>
                            <div onClick={handleLeave} className="control-button text-danger p-2" data-for="tool-tip" data-tip="Leave">
                                <i className="fas fa-phone" />
                            </div>
                        </div>
                    </nav>
                </main>

                <div className="col-5 col-sm-4 p-0 room-chat">                    
                    <div className="chat-header text-center text-white pt-2 p-1">
                        <i className="fas fa-comment-alt p-1" /> Chat
                    </div>
                    <div className="chat-window overflow-auto text-break">
                        <div className="messages">
                            {chat.map((cur) => {
                                return(
                                    <Message key={cur.id} message={cur}/>
                                )
                            })}
                        </div>
                    </div>
                    <nav className="navbar p-1 chat-form">
                        <input className="input-message" spellCheck="false" autoComplete="off" placeholder='Type message here...' value={message} onChange={messageChange} onKeyPress={sendMessage}/>
                    </nav>
                </div>
            </div>
            <ToastContainer
                position="bottom-left"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
            />
            <ToolTip />
            <PopOver />
        </div>
    );
        
};

export default Room; 