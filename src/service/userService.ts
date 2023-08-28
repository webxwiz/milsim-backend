import bcrypt from "bcrypt";
import crypto from "crypto";

import { GraphQLError } from "graphql";

import UserModel from "../models/User.js";
import { checkAuth } from "../utils/_index.js";
import { userValidate } from "../validation/userValidation.js";

class UserService {
    async getUserByToken(token: string) {
        const id = checkAuth(token);
        const user = await UserModel.findById(id);
        if (!user) {
            throw new GraphQLError("Can't find user");
        }

        return user;
    }

    async getAllUsers() {
        const users = await UserModel.find();
        if (!users) {
            throw new GraphQLError("Can't find user");
        }

        return users;
    }

    async saveUser(email: string) {
        await userValidate({ email });
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw new GraphQLError(`User ${email} already exist`, {
                extensions: { code: "BAD_USER_INPUT" },
            });
        }

        const user = await UserModel.create({ email });
        if (!user) {
            throw new GraphQLError("Database Error", {
                extensions: { code: "DATABASE_ERROR" },
            });
        }

        return user;
    }

    async deleteUser(email: string, token: string) {
        const { role } = checkAuth(token);

        if (role === "ADMIN") {
            const userStatus = await UserModel.deleteOne({ email });

            return userStatus;
        } else {
            throw new GraphQLError("Authorization error");
        }
    }
}

export default new UserService();
