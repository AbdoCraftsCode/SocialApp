import { Router } from "express";
import { adduser, coverimages, getprofile, getuser, identety, updateimage, updatepassword, updateprofile, vistedprrofile } from "./service/profile.service.js";
import { authentication, authorization } from "../../middlewere/authintcatoin.middlewhere.js";
import * as validators from "../user/service/user.validation.js"
import { validation } from "../../middlewere/validiation.middlewere.js";
import {  fileValidationTypes, uploadDiskFile } from "../../utlis/multer/local.multer.js";
const router = Router()

router.patch("/adduser/:friendId", authentication(), adduser)
router.get("/getprofile", authentication() ,getprofile)
router.get("/getprofile/:userId", authentication(), getuser)
router.post("/vistedprrofile/:profileId", validation(validators.shareProfile), authentication(), vistedprrofile);
router.patch("/updateprofile", validation(validators.updateprofile), authentication(), updateprofile);
router.patch("/updatepassword", validation(validators.updatepassword), authentication(), updatepassword);
router.patch("/profile/image", authentication(), uploadDiskFile("user/profile", fileValidationTypes.image).single('image'), updateimage);
router.patch("/profile/coverimage", authentication(), uploadDiskFile("user/profile/coverimage", fileValidationTypes.image).array('image', 5), coverimages);
router.patch("/profile/identety",
    authentication(),
    uploadDiskFile("user/profile/identety", [
        ...fileValidationTypes.image,
        ...fileValidationTypes.document
    ]).fields([
        { name: 'image', maxCount: 1 },
        { name: 'document', maxCount: 1 }
    ]),
    identety
);

export default router
identety