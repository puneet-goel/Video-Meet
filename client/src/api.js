import axios from "axios";
import { uniqueNamesGenerator, adjectives, names, starWars } from "unique-names-generator";

import url from "./baseUrl.js";

//axios return a promise, so anything not nested inside .then gets executed immediately.
export const checkRoom = async(roomID) => {

    try{
		const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
		for(let i=0;i<rooms.length;i++){
			if(rooms[i] === roomID){
				return true;
			}
		}

		const {data} = await axios.get(url + "/rooms");
		let flag = false;
		for(const room of data){
            if(room === roomID){
				flag = true;
			}   
        }
		return flag;
	}catch(error){
		// console.log(error);
		return false;
	}   
}

export const sendEmail = async(link,users,name) => {
    try{
	    await axios.post(url + "/sendMail",{
            link: link,
            users: users,
            name: name
        });

	}catch(error){
		// console.log(error);
	}   
};

export const addRoom = (roomID) => {
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    rooms.push(roomID);
    localStorage.setItem('rooms', JSON.stringify(rooms));
};

export const getTime = () => {
    const time = new Date();
    return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};
  
export const coolName = () => {
    const configA = {
        dictionaries: [adjectives, names],
        separator: "_",
        length: 2,
        style: "lowerCase"
    };
  
    const A = uniqueNamesGenerator(configA);

    const configB = {
        dictionaries: [starWars]
    };
  
    const B = uniqueNamesGenerator(configB);

    const randomNumber = Math.floor(Math.random()*2);
    if(randomNumber === 0){
        return A;
    }
    
    return B;
};

export const addParticipant = (id, name) => {
    const participants = JSON.parse(sessionStorage.getItem('participants'));

    participants.push({
        key: id,
        name: name
    });
    sessionStorage.setItem('participants', JSON.stringify(participants));
}

export const removeParticipant = (id) => {
    let participants = JSON.parse(sessionStorage.getItem('participants')) || [];
    participants = participants.filter(participant => participant.key !== id);
    sessionStorage.setItem('participants', JSON.stringify(participants));
}