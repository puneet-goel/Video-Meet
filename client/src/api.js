import axios from "axios";

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
		console.log(data);
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

export const addRoom = (roomID) => {
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    rooms.push(roomID);
    localStorage.setItem('rooms', JSON.stringify(rooms));
};

export const getTime = () => {
    const time = new Date();
    return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}