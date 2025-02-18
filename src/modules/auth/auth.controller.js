import { Router } from "express";
import { confirmemail, signup, requestNewOTP} from "./service/regestration.service.js";
import { validation } from "../../middlewere/validiation.middlewere.js";
import  * as validators from  "./auth.validate.js"
import { forgetpassword, login, refreshToken, resetpassword } from "./service/authonticaton.service.js";
const router = Router()





router.post("/signup", validation(validators.signup), signup)
router.post("/login", validation(validators.login),login)
router.patch("/confirmemail", validation(validators.confirmemail),confirmemail )
router.patch("/newotp", validation(validators.newotp), requestNewOTP)

router.get("/refreshToken",refreshToken)
router.patch("/forgetpassword" ,forgetpassword)
router.patch("/resetpassword",resetpassword)
export default router