


import { asyncHandelr } from "../../../utlis/response/error.response.js";
import Usermodel, { roletypes } from "../../../DB/model/User.model.js";
import { comparehash, generatehash } from "../../../utlis/securty/hash.security.js";
import { successresponse } from "../../../utlis/response/sucsess.response.js";
import { decodedToken, generatetoken, tokenTypes, verifytoken } from "../../../utlis/securty/token.security.js";
import { Emailevent } from "../../../utlis/events/email.event.js";






 export const login = asyncHandelr(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password);

    const checkUser = await Usermodel.findOne({ email });
    if (!checkUser) {
        return next(new Error("User not found", { cause: 404 }));
    }

    if (!checkUser.confirmEmail) {
        return next(new Error("Please confirm your email tmm ", { cause: 404 }));
    }

    if (!comparehash({ planText: password, valuehash: checkUser.password })) {
        return next(new Error("Password is incorrect", { cause: 404 }));
    }

    const access_Token = generatetoken({
        payload: { id: checkUser._id },
        signature: checkUser.role === roletypes.Admin ? process.env.SYSTEM_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN,
      
    });

    const refreshToken = generatetoken({
        payload: { id: checkUser._id },
        signature: checkUser.role === roletypes.Admin ? process.env.SYSTEM_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,
        expiresIn: 31536000,
    });

    return successresponse(res, "Login successful", 200, { access_Token, refreshToken });
});



export const refreshToken = asyncHandelr(async (req, res, next) => {

const user = await decodedToken({authorization: req.headers.authorization , tokenType:tokenTypes.refresh})
  
    const accessToken = generatetoken({
        payload: { id: user._id },
        signature: user.role === 'Admin' ? process.env.SYSTEM_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN,
    });

    // 7. إنشاء refresh token جديد
    const newRefreshToken = generatetoken({
        payload: { id: user._id },
        signature: user.role === 'Admin' ? process.env.SYSTEM_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN,
        expiresIn: 31536000, // سنة واحدة
    });

    // 8. إرجاع الرد الناجح
    return successresponse(res, "Token refreshed successfully", 200, { accessToken, refreshToken: newRefreshToken });
});

export const forgetpassword = asyncHandelr(async (req, res, next) => {
    const { email  } = req.body;
    console.log(email);

    const checkUser = await Usermodel.findOne({ email });
    if (!checkUser) {
        return next(new Error("User not found", { cause: 404 }));
    }

    Emailevent.emit("forgetpassword" ,{email})

    return successresponse(res);
});

export const resetpassword = asyncHandelr(async (req, res, next) => {
    const { email  ,password,code} = req.body;
    console.log(email, password, code);

    const checkUser = await Usermodel.findOne({ email  ,isDeleted:false});
    if (!checkUser) {
        return next(new Error("User not found", { cause: 404 }));
    }

    if (!comparehash({ planText: code, valuehash: checkUser.forgetpasswordOTP })) {
        
        return next(new Error("code not match", { cause: 404 }));
    }

    const hashpassword = generatehash({ planText: password })
    await Usermodel.updateOne({ email }, {
        
        password: hashpassword,
        confirmEmail: true,
        changecredintialTime: Date.now(),
        $unset: { forgetpasswordOTP: 0 ,otpExpiresAt: 0, attemptCount: 0 },
        
    })

    return successresponse(res);
});

















