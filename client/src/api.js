import axios from "axios";
import url from "./baseUrl.js";

//axios return a promise, so anything not nested inside .then gets executed immediately.
export const checkRoom = async(room) => {

    try{
		const {data} = await axios.get(url + "rooms");
        const a = data.find((r) => r === room);

		if(a === undefined){
			return false;
		}
		return true;
	}catch(error){
		console.log(error);
	}
    
}

export const updateRooms = async(id) => {

	try{
		const {data} = await axios.patch(url + "rooms", id);
		return data;
	}catch(error){
		console.log(error);
	}

}