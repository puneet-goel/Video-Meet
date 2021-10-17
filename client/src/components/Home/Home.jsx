import React,{ useEffect, useState } from "react";
import { Formik, ErrorMessage, Field, Form } from 'formik';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useHistory } from "react-router-dom";
import { v1 as uuid } from "uuid";
import * as Yup from 'yup';

import { addRoom, sendEmail } from "../../api.js";
import init from "../../storageInit.js";
import Clock from "../UI/Clock/Clock.jsx";
import "./Home.css";

const schema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(15, 'Too Long!')
        .required('Required'),
    emails: Yup.array()
        .required('Required')
        .transform(function(value, originalValue) {
            if (this.isType(value) && value !== null) {
                return value;
            }
            return originalValue ? originalValue.split(',').map(x => x.trim()) : [];
        })
        .of(Yup.string().email(({ value }) => `${value} is not a valid email`))
});

const Home = () => {
    const arr = ['V','We','Video'];
    init();

    const [room, setRoom] = useState(() => '');
    const [index,setIndex] = useState(() => 0);
    const [share,setShare] = useState(() => false);

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
        setRoom(event.target.value);
    }

    const handleJoin = (event) => {
        event.preventDefault();
        history.push(`/check/${room}`);
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
                        <input name="room" spellCheck="false" autoComplete="off" className="form-control" placeholder="Enter Room Code" onChange={handleChange} value={room} />
                        <span className="input-group-text dustbin" onClick={handleClear} > 
                            <i className="fas fa-trash" />
                        </span>
                    </div>
                    {
                        (share)?<Formik
                            initialValues= {{
                                name: '',
                                emails: '',
                            }}
                            validationSchema = {schema}
                            onSubmit= {values => {
                                alert("Email sent successfully!!!");
                                setShare(false);
                                sendEmail(room, values.emails, values.name);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form >
                                    <div className="mb-3 mt-4">
                                        <Field id="name" name="name" type="text" spellCheck="false" autoComplete="off" placeholder="Enter Your Name" className="email-input form-control"/>
                                        <ErrorMessage name="name" render={ msg => 
                                            <div className="form-text text-danger">
                                                {msg}
                                            </div>
                                        }/>
                                    </div>

                                    <label htmlFor="emails" className="form-label">Comma Separated Emails</label> 
                                    <div className="input-group email-input">
                                        <Field id="emails" name="emails" spellCheck="false" autoComplete="off" type="emails" placeholder="Emails" className="form-control" />
                                        <button type="submit" className="input-group-text plane" > 
                                            <i className="fas fa-paper-plane" />
                                        </button> 
                                    </div>
                                    <ErrorMessage name="emails" render={ msg => 
                                        <div className="form-text text-danger">
                                            {msg}
                                        </div>
                                    }/>
                                </Form>
                            )}
                        </Formik>
                        :null
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
                                <CopyToClipboard text={`https://v-meet-puneet.netlify.app/${room}`} >
                                    <button className="btn btn-primary function" >
                                        <i className="fas fa-copy p-2" /> 
                                    </button>
                                </CopyToClipboard>
                                <h6 className="pt-3">Copy</h6>
                            </div>
                        </div>
                        <div className="block2 ms-1 ms-sm-2">
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