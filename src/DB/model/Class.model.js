
import mongoose, { Schema, model } from "mongoose";

const Classschema = new Schema({


    Name: {

        type: String,
    
        required: true
    },

    

},



  


    { timestamps: true })

 const Classmodel= mongoose.models.Class|| model("Class", Classschema)

export default Classmodel