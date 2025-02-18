
import mongoose, { Schema, Types, model } from "mongoose";

const Subjectschema = new Schema({


    Name: {

        type: String,
    
        required: true
    },

       classId: {
            
            type: Types.ObjectId,
            ref:"Class"
        },

    

},



  


    { timestamps: true })

const Subjectmodel = mongoose.models.Subject || model("Subject", Subjectschema)

export default Subjectmodel