import React,{ useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v1 as uuid } from "uuid";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { addRoom, sendEmail } from "../../api.js";
import Clock from "../UI/Clock/Clock.jsx";
import "./Home.css";

const Home = () => {
    const arr = ['V','Video','We'];

    const [room, setRoom] = useState(() => '');
    const [index,setIndex] = useState(() => 0);
    const [share,setShare] = useState(() => false);
    const [emailDetails,setEmailDetails] = useState({
        name: '',
        emails: ''
    });

    const history = useHistory();

    const handleCreate = (event) => {
        event.preventDefault();
        const roomID = uuid();
        setRoom(roomID);
        addRoom(roomID);
    }

    const handleClear = (event) => {
        event.preventDefault();
        setRoom('');
    }
    
    const handleShare = (event) => {
        event.preventDefault();
        setShare((cur) => !cur);
    }

    const changeHeader = () => {
        setIndex((cur) => (cur+1)%3);
    }

    const handleChange = (event) => {
        event.preventDefault();
        const target = event.target.name;
        if(target === 'room'){
            setRoom(event.target.value);
        }else if(target === 'emails'){
            setEmailDetails({
                ...emailDetails,
                emails: event.target.value
            });
        }else if(target === 'name'){
            setEmailDetails({
                ...emailDetails,
                name: event.target.value
            });
        }
    }

    const handleJoin = (event) => {
        event.preventDefault();
        history.push(`/check/${room}`);
    }

    const handleEmailSent = (event) => {
        event.preventDefault();
        alert("Email sent successfully!!!");
        sendEmail(room,emailDetails.emails,emailDetails.name);
        setEmailDetails({
            name: '',
            emails: ''
        });
        setShare(false);
    }

    useEffect(() => {
        const timerId = setInterval(changeHeader, 2000);
        return function cleanup() {
            clearInterval(timerId);
        };
    },[]);

    return(
        <div className="container-fluid">
            <div className="row m-0 py-5 px-3 px-sm-5 home"> 
            
                <div className="col-12 col-sm-6">
                    <div className="mb-5 intro">
                        <h1 className="fw-bold mt-sm-5"> {arr[index]} Meet </h1>
                        <h4 className="fst-italic mt-3"> Connect, Chat, Conference </h4>
                        <h6 className="fst-italic mt-3">V Meet is the Video Conferencing app. It’s free and simple. Invite friends for a group call.</h6>
                    </div>
                    <div className="input-group room-input pt-sm-5">
                        <input name="room" spellCheck="false" className="form-control" placeholder="Enter Room Code" onChange={handleChange} value={room} />
                        <span className="input-group-text dustbin" onClick={handleClear} > 
                            <i className="fas fa-trash" />
                        </span>
                    </div>
                    {
                        (!share)?<div />:
                        <div className="input-group room-input pt-3 pt-sm-5">
                            <input name="name" spellCheck="false" className="form-control" placeholder="Your Name" onChange={handleChange} value={emailDetails.name} />
                            <input name="emails" spellCheck="false" className="form-control" placeholder="xyz@example.com" onChange={handleChange} value={emailDetails.emails} />
                            <span className="input-group-text mail" onClick={handleEmailSent} > 
                                <i className="fas fa-paper-plane" />
                            </span>
                        </div>
                    }
                </div>

                <div className="col-12 col-sm-6 pt-sm-5 right-function">
                    <Clock />
                    <div className="d-flex flex-column">
                        <div className="block1 pb-5">
                            <div className="d-flex flex-column align-items-center">
                                <button onClick={handleCreate} type="submit" className="btn function func-video">
                                    <i className="fas fa-video p-1" />
                                </button>
                                <h6 className="pt-3">New Meeting</h6>
                            </div>
                            
                            <div className="d-flex flex-column align-items-center">
                                <CopyToClipboard text={room} >
                                    <button className="btn btn-primary function" >
                                        <i className="fas fa-copy p-1" /> 
                                    </button>
                                </CopyToClipboard>
                                <h6 className="pt-3">Copy</h6>
                            </div>
                        </div>
                        <div className="block2 ms-3">
                            <div className="d-flex flex-column align-items-center">
                                <button onClick={handleJoin} type="submit" className="btn btn-primary function">
                                    <i className="bi bi-plus-square-fill p-2" />
                                </button>
                                <h6 className="pt-3">Join</h6>
                            </div>

                            <div className="d-flex flex-column align-items-center">
                                <button onClick={handleShare}  type="submit" className="btn function func-share">
                                    <i className="fas fa-share-alt p-2" />
                                </button>
                                <h6 className="pt-3">Share</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    );
}

export default Home;