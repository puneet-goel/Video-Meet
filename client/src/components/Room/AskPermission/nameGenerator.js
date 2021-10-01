import { uniqueNamesGenerator, adjectives, names, languages } from "unique-names-generator";
  
const coolName = () => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    
    const config = {
        dictionaries: [adjectives, names, languages, numbers],
        separator: "-",
        length: 4,
        style: "capital"
    };
  
    const randomString = uniqueNamesGenerator(config);
    return randomString;
};

export default coolName;