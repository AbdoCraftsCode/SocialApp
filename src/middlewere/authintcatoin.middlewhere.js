import { asyncHandelr } from "../utlis/response/error.response.js";
import * as dbservice from "../DB/dbservice.js";
import { decodedToken } from "../utlis/securty/token.security.js";


export const authentication = () => {
    return asyncHandelr(async (req, res, next) => {
        req.user = await decodedToken({ authorization: req.headers.authorization });
        return next();
    });
};


export const authorization = (AccessRoles) => {
    return asyncHandelr(async (req, res, next) => {
        if (!AccessRoles.includes(req.user.role)) {
            
            return next(new Error("invalid authorization", { cause: 400 }));


        }
          
            
        return next();
    });
};