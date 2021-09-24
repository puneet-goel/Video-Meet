import { useState } from "react";

export default function useArray(defaultValue){
    const [arr, setArr] = useState(defaultValue);

    function push(element) {
        setArr(a => [...a, element])
    }
    
    function filter(callback) {
        setArr(a => a.filter(callback))
    }

    function remove(index) {
        setArr(a => [...a.slice(0, index), ...a.slice(index + 1, a.length - 1)]);
    }

    function clear() {
        setArr([]);
    }

    return { arr, set: setArr, push, filter, remove, clear };
}