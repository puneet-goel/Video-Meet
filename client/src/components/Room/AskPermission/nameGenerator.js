import { uniqueNamesGenerator, adjectives, names } from "unique-names-generator";
  
const coolName = () => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    
    const config = {
        dictionaries: [adjectives, names, numbers],
        separator: "-",
        length: 3,
        style: "capital"
    };
  
    const randomString = uniqueNamesGenerator(config);
    return randomString;
};

export default coolName;