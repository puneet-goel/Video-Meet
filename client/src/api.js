import axios from "axios";
import url from "./baseUrl.js";

//axios return a promise, so anything not nested inside .then gets executed immediately.
export const checkRoom = async(room) => {

    try{
		const {data} = await axios.get(url+"rooms");
        const a = data.find((r) => r === room);

        if(a !== room){
            return true;
        }

        return false;
	}catch(error){
		console.log(error);
	}
    
}