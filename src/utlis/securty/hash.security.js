
import bcrypt from "bcrypt"


export const generatehash = ({planText =""  , salt= process.env.SALT} ={}) => {
    

    const hash = bcrypt.hashSync(planText , parseInt(salt))
return hash
}



export const comparehash = ({ planText = "", valuehash } = {}) => {

    const match = bcrypt.compareSync(planText, valuehash);
    return match;
};