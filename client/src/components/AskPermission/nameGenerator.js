import { uniqueNamesGenerator, adjectives, names, starWars } from "unique-names-generator";
  
const coolName = () => {
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

export default coolName;