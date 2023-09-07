import multer, { memoryStorage } from "multer";
import { Request } from "express";


const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new Error("Wrong file format. Please upload only images"), false);
    }
};

const limits = {
    fileSize: 10240000, // 10 Mb
    files: 10,
    fields: 20,
};

export const multerConfig = multer({
    storage: memoryStorage(),
    fileFilter,
    limits,
});
