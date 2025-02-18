import multer from "multer";
import path from "node:path";
import fs from "fs";

export const fileValidationTypes = {
    image: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'],
    document: ['application/json', 'application/pdf'],
};

export const uploadDiskFile = (customPath = "general", fileValidation = []) => {

    const basepath = `uploads/${customPath}`; // تحديد المسار الأساسي للمجلد
    const fullPath = path.resolve(`./src/${basepath}`);

    // التأكد من أن المجلد موجود
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }

    console.log(fullPath, basepath);

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, fullPath); // حفظ الملف في المجلد المحدد
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
            file.finalPath = `${basepath}/${uniqueSuffix}_${file.originalname}`; // إنشاء المسار الكامل للملف
            cb(null, `${uniqueSuffix}_${file.originalname}`); // تحديد اسم الملف النهائي
        }
    });

    function fileFilter(req, file, cb) {
        if (fileValidation.includes(file.mimetype)) {
            cb(null, true); // السماح بأنواع الملفات المحددة
        } else {
            cb(new Error("❌ الملف غير مدعوم!"), false); // رفض الملفات غير المدعومة
        }
    }

    return multer({ storage, fileFilter });
};
