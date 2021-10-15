/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import { UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";

import "./PopOver.css";

const PopOver = () => {
    
    const participants = JSON.parse(sessionStorage.getItem('participants'));

    return (
        <UncontrolledPopover target="participants" trigger="click" placement="top" >
            <PopoverHeader className="h2 fw-bold text-center text-uppercase">Participants</PopoverHeader>
            <PopoverBody className="ps-0 p-3">
                <ol>
                    {
                        participants.map((participant) => {
                            return (
                                <li key={participant.key} className="fst-italic"> {participant.name} </li>
                            );
                        })
                    }
                </ol>
            </PopoverBody>
        </UncontrolledPopover>
    )

};

export default PopOver;