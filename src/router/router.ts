import sharp from "sharp";
import crypto from "crypto";

import { Router } from "express";
import { Request, Response, NextFunction } from "express";

import { GraphQLError } from "graphql";

import awsS3Service from "../service/awsS3Service.js";
import { multerConfig } from "../utils/_index.js";

const router = Router();

router.post(
    "/image",
    multerConfig.single("image"),
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file) throw new GraphQLError("No file to upload");

            const firstPart = crypto.randomBytes(16).toString("hex");
            const fileName = `${firstPart}-image.webp`;

            let buffer;

            await sharp(req.file.buffer)
                .resize(1000)
                .webp()
                .toBuffer()
                .then((data) => {
                    buffer = data;
                });

            const imageURL = await awsS3Service.uploadImageToS3(
                buffer,
                `images/${fileName}`
            );

            res.json({
                imageURL,
                message: "Image successfully uploaded.",
            });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
