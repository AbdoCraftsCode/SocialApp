import { asyncHandelr } from "../../../utlis/response/error.response.js";
import { successresponse } from "../../../utlis/response/sucsess.response.js";
import *as dbservice from "../../../DB/dbservice.js";
import Usermodel from "../../../DB/model/User.model.js";
import { comparehash, generatehash } from "../../../utlis/securty/hash.security.js";


export const getprofile = asyncHandelr(async (req, res, next) => {
    const user = await dbservice.findOne({
        model: Usermodel,
        filter: { _id: req.user._id },  // استخدام _id بدلاً من userId
        select: "username email _id friends",  // تأكد من جلب friends

        populate: [
            {
                path: "friends",
                select: "username image"  // تعبئة بيانات الأصدقاء فقط
            }
        ]
    });

    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }

    return successresponse(res, { user });
});


export const getuser = asyncHandelr(async (req, res, next) => {



    const { userId } = req.params;
    if (userId != req.user.userId) {

        return next(new Error("user not found", { cause: 404 }))

    }
    
    const user = await dbservice.findOne({
        model: Usermodel,
        filter: { userId: req.user.userId },
        select: "username email -_id userId",
     
    
    });



    return successresponse(res, { user });
});




export const updateprofile = asyncHandelr(async (req, res, next) => {

const{username , phone ,DOB}= req.body

    const user = await dbservice.findOneAndUpdate({
        model: Usermodel,
        filter: { _id: req.user._id },
        data: req.body,
        options: {
            new: true
        }
    });



    return successresponse(res, "user updated sucsess", 200, {
        username: req.user.username,
        phone: req.user.phone,
        DOB: req.user.DOB,
    });
});

export const updatepassword = asyncHandelr(async (req, res, next) => {

    const { oldpassword, password, confirmationpassword } = req.body
    
        if (!comparehash({ planText: oldpassword, valuehash: req.user.password }))

            return next(new Error("password not correct", { cause: 404 }))

    const user = await dbservice.findOneAndUpdate({
        model: Usermodel,
        filter: { _id: req.user._id },
        data: { password: generatehash({ planText: password }), changechangecredintialTime: Date.now()},
        options: {
            new: true
        }
    });



    return successresponse(res, "user updated sucsess", 200, {
  user
    });
});


export const vistedprrofile = asyncHandelr(async (req, res, next) => {
    const { profileId } = req.params;
    const user = await dbservice.findOne({
        model: Usermodel,
        filter: {

            _id: profileId,
            isDeleted: false,

        },
        select: "username   phone gender"

    })

    if (!user) {

        return next(new Error("user not found check please again", { cause: 404 }))
    }

    if (profileId !== req.user._id.toString()) {
        // حذف أي زيارة سابقة لهذا المستخدم
        await dbservice.updateOne({
            model: Usermodel,
            filter: { _id: profileId },
          
            data: {
                $pull: { viewers: { userId: req.user._id } }
            }
        });


        await dbservice.updateOne({
            model: Usermodel,
            filter: { _id: profileId },
            data: {
                $push: { viewers: { userId: req.user._id, visitedAt: new Date() } }
            }
        });
    }

    return successresponse(res, "Profile visit recorded successfully", 200, { user});
});


export const updateimage = asyncHandelr(async (req, res, next) => {

  
   const user = await dbservice.findOneAndUpdate({

        model: Usermodel,
        filter: {
            _id: req.user._id,
            
        },
        data: {
            
            image: req.file.finalPath
            },
            options: {
            new:true,
        }
    })


    return successresponse(res, "user updated sucsess", 200, {
        file: req.file,
      user,
    });
});
export const coverimages = asyncHandelr(async (req, res, next) => {


    const user = await dbservice.findOneAndUpdate({

        model: Usermodel,
        filter: {
            _id: req.user._id,

        },
        data: {

            coverimages: req.files.map(file=>file.finalPath)
        },
        options: {
            new: true,
        }
    })



    return successresponse(res, "user updated sucsess", 200, {
        file: req.files,
        user
   
    });
});
export const identety = asyncHandelr(async (req, res, next) => {

    // تحويل كائن الملفات إلى مصفوفة واستخراج الملفات حسب الحقل
    const imageFiles = (req.files.image || []).map(file => file.finalPath);
    const documentFiles = (req.files.document || []).map(file => file.finalPath);


    const user = await dbservice.findOneAndUpdate({
        model: Usermodel,
        filter: {
            _id: req.user._id,
        },
        data: {
            coverimages: imageFiles,  // استخدام المسار النهائي للصورة
            documents: documentFiles  // إضافة مسارات الملفات المرفوعة للمستندات
        },
        options: {
            new: true,
        }
    });

    return successresponse(res, "user updated success", 200, {
        files: req.files,
        user
    });
});







export const adduser = asyncHandelr(async (req, res, next) => {
const {friendId} = req.params
    const friend = await dbservice.findOneAndUpdate({
        
        model: Usermodel,
        filter: {
            _id:friendId,

        },
        data: {

            $addToSet: { friends: req.user._id }
        },
        options: {
            new: true,
        }

    })

    if (!friend) {
        
return next(new Error("invalied-friendId"  ,{cause:404}))

    }
    const user = await dbservice.findOneAndUpdate({

        model: Usermodel,
        filter: {
            _id: req.user._id,
            isDeleted: false,

        },
        data: {

          $addToSet:{friends:friendId}
        },
        options: {
            new: true,
        }
    })


    return successresponse(res, );
});