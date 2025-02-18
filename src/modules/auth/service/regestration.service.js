
import { asyncHandelr } from "../../../utlis/response/error.response.js";
import Usermodel from "../../../DB/model/User.model.js";
import { comparehash, generatehash } from "../../../utlis/securty/hash.security.js";
import { successresponse } from "../../../utlis/response/sucsess.response.js";
import { Emailevent } from "../../../utlis/events/email.event.js";
import { nanoid, customAlphabet } from "nanoid";
import { vervicaionemailtemplet } from "../../../utlis/temblete/vervication.email.js";
import { sendemail } from "../../../utlis/email/sendemail.js";
import  *as dbservice from"../../../DB/dbservice.js"





export const signup = asyncHandelr(async (req, res, next) => {
    const { username, email, password, confirmationpassword } = req.body;
    console.log(username, email, password);

    // التحقق من وجود البريد الإلكتروني مسبقًا
    const checkUser = await dbservice.findOne({ model: Usermodel, filter: { email } });
    if (checkUser) {
        return next(new Error("email already exists", { cause: 404 }));
    }

    // التحقق من أن كلمة المرور والتأكيد متطابقين
    if (password !== confirmationpassword) {
        return next(new Error("Passwords do not match tmm", { cause: 400 }));
    }

    // توليد رقم عشوائي مكون من 7 أرقام والتأكد من عدم تكراره
    let userId;
    let isUnique = false;
    while (!isUnique) {
        userId = Math.floor(1000000 + Math.random() * 9000000); // يولد رقمًا بين 1000000 و 9999999
        // تحقق من عدم وجود هذا userId في قاعدة البيانات
        const existingUser = await dbservice.findOne({ model: Usermodel, filter: { userId } });
        if (!existingUser && userId !== null) isUnique = true; // إضافة تحقق للتأكد من أن userId ليس null
    }

    // إذا كانت قيمة userId فارغة، أوقف العملية
    if (!userId) {
        return next(new Error("Failed to generate a unique userId ok", { cause: 500 }));
    }

    // تشفير كلمة المرور
    const hashPassword = generatehash({ planText: password });

    // إنشاء المستخدم في قاعدة البيانات
    const user = await dbservice.create({
        model: Usermodel,
        data: { username, email, password: hashPassword, userId }
    });

  
    Emailevent.emit("confirmemail", { email });

    return successresponse(res, "User created successfully", 201, { user });
});







export const confirmemail = asyncHandelr(
    async (req, res, next) => {
        const { code, email } = req.body;

       
        const user = await dbservice.findOne({model:Usermodel ,filter:{email}})
        if (!user) {
            return next(new Error("Email does not exist tmm", { cause: 404 }));
        }

        // التحقق إذا كان المستخدم في حالة حظر
        if (user.blockUntil && Date.now() < new Date(user.blockUntil).getTime()) {
            const remainingTime = Math.ceil((new Date(user.blockUntil).getTime() - Date.now()) / 1000);
            return next(new Error(`Too many attempts. Please try again after ${remainingTime} seconds.`, { cause: 429 }));
        }

        // التحقق إذا كان البريد الإلكتروني قد تم تأكيده بالفعل
        if (user.confirmEmail) {
            return next(new Error("Email is already confirmed", { cause: 400 }));
        }

        // التحقق من صلاحية OTP (انتهاء الوقت)
        if (Date.now() > new Date(user.otpExpiresAt).getTime()) {
            return next(new Error("OTP has expired", { cause: 400 }));
        }

        // التحقق من صحة الكود (OTP)
        const isValidOTP = comparehash({ planText: `${code}`, valuehash: user.emailOTP });
        if (!isValidOTP) {
            // زيادة عدد المحاولات عند الفشل
            await dbservice.updateOne({ model: Usermodel, data: { $inc: { attemptCount: 1 } }})

            // التحقق إذا تجاوز المستخدم الحد الأقصى للمحاولات
            if (user.attemptCount + 1 >= 5) {
                const blockUntil = new Date(Date.now() + 2 * 60 * 1000); // حظر لمدة دقيقتين
                await Usermodel.updateOne({ email }, { blockUntil, attemptCount: 0 });
                return next(new Error("Too many attempts. You are temporarily blocked for 2 minutes.", { cause: 429 }));
            }

            return next(new Error("Invalid OTP. Please try again.", { cause: 400 }));
        }

        // إذا كان التحقق ناجحًا، تأكيد البريد الإلكتروني وإزالة الحقول المؤقتة
        await Usermodel.updateOne(
            { email },
            {
                confirmEmail: true,
                $unset: { emailOTP: 0, otpExpiresAt: 0, attemptCount: 0, blockUntil: 0 },
            }
        );

      
        return successresponse(res, "Email confirmed successfully", 200, { user });
    }
);


















export const requestNewOTP = asyncHandelr(
    async (req, res, next) => {
        const { email } = req.body;

       
        const user = await Usermodel.findOne({ email });
        if (!user) {
            return next(new Error("Email does not exist ", { cause: 404 }));
        }
        if (user.confirmEmail===true) {
            return next(new Error("Email already confrmed ", { cause: 404 }));
        }

       
        if (user.blockUntil && Date.now() < new Date(user.blockUntil).getTime()) {
            const remainingTime = Math.ceil((new Date(user.blockUntil).getTime() - Date.now()) / 1000);
            return next(new Error(`You are temporarily blocked. Try again after ${remainingTime} seconds.`, { cause: 429 }));
        }

     
        Emailevent.emit("confirmemail", { email })
        return successresponse(res, "A new OTP has been sent to your email.", 200);
    }
);






 





 