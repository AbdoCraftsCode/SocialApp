
import { nanoid  ,customAlphabet} from "nanoid";
import { EventEmitter } from "node:events";
import { sendemail } from "../email/sendemail.js";
import { vervicaionemailtemplet } from "../temblete/vervication.email.js";
import { generatehash } from "../securty/hash.security.js";
import Usermodel from "../../DB/model/User.model.js";
   export const Emailevent = new EventEmitter({})


Emailevent.on("confirmemail", async (data) => {
    const { email } = data;

    // توليد OTP مكون من 6 أرقام
    const otp = customAlphabet("0123456789", 6)();

    // بناء الـ HTML الخاص بالبريد الإلكتروني
    const html = vervicaionemailtemplet({ code: otp });

    // تشفير الـ OTP
    const emailOTP = generatehash({ planText: `${otp}` });

    // تعيين صلاحية الكود لدقيقتين (120,000 ميلي ثانية)
    const otpExpiresAt = Date.now() + 2 * 60 * 1000;

    // تحديث المستخدم في قاعدة البيانات
    await Usermodel.updateOne(
        { email },
        {
            emailOTP,
            otpExpiresAt,
            attemptCount: 0, // إعادة تعيين عدد المحاولات
        }
    );

    // إرسال البريد الإلكتروني
    await sendemail({ to: email, subject: "Confirm Email", html });

    console.log("Email sent successfully!");
});


Emailevent.on("forgetpassword", async (data) => {
    const { email } = data;

    // توليد OTP مكون من 6 أرقام
    const otp = customAlphabet("0123456789", 6)();

    // بناء الـ HTML الخاص بالبريد الإلكتروني
    const html = vervicaionemailtemplet({ code: otp });

    // تشفير الـ OTP
    const forgetpasswordOTP = generatehash({ planText: `${otp}` });

    // تعيين صلاحية الكود لدقيقتين (120,000 ميلي ثانية)
    const otpExpiresAt = Date.now() + 2 * 60 * 1000;

    // تحديث المستخدم في قاعدة البيانات
    await Usermodel.updateOne(
        { email },
        {
            forgetpasswordOTP,
            otpExpiresAt,
            attemptCount: 0, // إعادة تعيين عدد المحاولات
        }
    );

    // إرسال البريد الإلكتروني
    await sendemail({ to: email, subject: "forgetpassword", html });

    console.log("Email sent successfully!");
});



