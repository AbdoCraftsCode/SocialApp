

import mongoose, { Schema, Types, model } from "mongoose";
export const gendertypes = { male: "male", female: "female" }
export const roletypes = { User: "User", Admin: "Admin" }
const userschema = new Schema({


    userId: {

        type: String,
        unique: true,
        required: true
    },

    // classId: {
        
    //     type: Types.ObjectId,
    //     ref:"Class"
    // },

    username: {

        type: String,
        required: true,
        minlength: 2,
        maxlength: 25,
        trim: true
    },


    email: {
        type: String,
        unique: true,  
        required: true,



    },
    password: {

        type: String,
        required: true
    },
    phone: {
        type: String,

    },


    DOB: Date,
    confirmEmail: {

        type: Boolean,
        default: false

    },

    isDeleted: {

        type: Boolean,
        default: false

    },
    gender: {
        type: String,
        enum: Object.values(gendertypes),
        default: gendertypes.male,

    },
    role: {
        type: String,
        enum: Object.values(roletypes),
        default: roletypes.User,

    },
    image: String,
    coverimages: [String],
    changecredintialTime: Date,
    emailOTP: String,
    forgetpasswordOTP: String,
    attemptCount: Number,
    otpExpiresAt: Date,
    blockUntil: {
        type: Date,
    },
    viewers: [
        {
            userId: { type: Types.ObjectId, ref: "User" },
            visitedAt: { type: Date, default: Date.now },
        },
    ],

    friends: [{ type: Types.ObjectId, ref: "User" }]
 

},



  


    { timestamps: true })

 const Usermodel= mongoose.models.User || model("User", userschema)

export default Usermodel
export const scketConnections = new Map()
export const onlineUsers = new Map();
