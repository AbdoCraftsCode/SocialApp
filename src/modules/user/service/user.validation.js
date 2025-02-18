import Joi from "joi";
import { generalfields } from "../../../middlewere/validiation.middlewere.js";


export const shareProfile = Joi.object().keys({
    
    profileId: generalfields.id.required()
    
}).required()
export const updateprofile = Joi.object().keys({

    username: generalfields.username.required(),
    phone: generalfields.phone,
    gender: generalfields.gender,
    DOB:generalfields.DOB,

}).required()
export const updatepassword = Joi.object().keys({

    oldpassword: generalfields.username.required(),
    password: generalfields.password.not(Joi.ref("oldpassword")).required(),
    confirmationpassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
      


}).required()


