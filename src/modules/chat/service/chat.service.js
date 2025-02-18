import { asyncHandelr } from "../../../utlis/response/error.response.js";
import * as dbservice from "../../../DB/dbservice.js";
import ChatModel from "../../../DB/model/chat.model.js";
import { successresponse } from "../../../utlis/response/sucsess.response.js";



export const findonechat = asyncHandelr(async (req, res, next) => {
    
    const { destId } = req.params;
    const chat = await dbservice.findOneAndUpdate({
        model: ChatModel,
       
        filter: {
            
            $or:[
           {
                mainUser: req.user._id,
                subpartisipant: destId,
                       

            },
            {
                mainUser: destId,
                subpartisipant: req.user._id,

            }


            ]
        },
        populate: [
            {
                path:"mainUser"  
            },
            {
                path: "subpartisipant"
            },
           
            {
                path: "messages.senderId"
            }

        ]

    })
    
successresponse(res ,{chat})


})