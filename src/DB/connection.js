import mongoose from "mongoose";
import { error, log } from "node:console";


export const connectDB = async() => {
    return await mongoose.connect(process.env.DB_URL).then(res => {
        
        console.log("DB connected sucssesfly mr abdo tmm");
        
    }).catch(error => {
        
        console.log("DB connected  invailid" , error);
    })

}


