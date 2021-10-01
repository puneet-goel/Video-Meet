import axios from "axios";

import url from "./baseUrl.js";

//axios return a promise, so anything not nested inside .then gets executed immediately.
export const checkRoom = async(room) => {

    try{
		const {data : rooms} = await axios.get(url + "/rooms");
		let flag = false;
		for(const key of rooms){
            if(key === room){
				flag = true;
			}   
        }
		return flag;
	}catch(error){
		// console.log(error);
		return false;
	}   
}