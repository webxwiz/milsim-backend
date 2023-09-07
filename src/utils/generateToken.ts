import jwt from "jsonwebtoken";

import "dotenv/config";

export const generateToken = (_id: string, role: string) => {
    return jwt.sign({ _id, role }, process.env.TOKEN_SECRET_KEY!, {
        expiresIn: "2d",
    });
};
