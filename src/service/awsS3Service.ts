import AWS from "aws-sdk";
import { logger } from "../utils/_index.js";

import { GraphQLError } from "graphql";

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

interface IParams {
    Bucket: string;
    Key: string;
    Body?: any;
    ContentType?: string;
}

class awsS3Service {
    async uploadImageToS3(file: any, keyName: string) {
        const params: IParams = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: keyName,
            Body: file,
            ContentType: "image/webp",
        };

        try {
            const uploadResult = await s3.upload(params).promise();

            return uploadResult.Location;
        } catch (error: any) {
            logger.error(error.code + ": " + error.message);
            throw new GraphQLError(error.code + ": " + error.message);
        }
    }

    async deleteImageFromS3(keyName: string) {
        const params: IParams = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: keyName,
        };

        try {
            const deleteResult = await s3.deleteObject(params).promise();

            return deleteResult;
        } catch (error: any) {
            logger.error(error.code + ": " + error.message);
            throw new GraphQLError(error.code + ": " + error.message);
        }
    }
}

export default new awsS3Service();
