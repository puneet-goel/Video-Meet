const init = () => {

    sessionStorage.setItem("isRoomValid",false);
    sessionStorage.setItem("video",true);
    sessionStorage.setItem("audio",true);
    sessionStorage.setItem("name",'');
    sessionStorage.setItem("participants",'[]');
    
}

export default init;