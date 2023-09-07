import { GraphQLError } from "graphql";

import UserModel from "../models/User.js";
import { checkAdminAuth, checkAuth, generateToken } from "../utils/_index.js";

class UserService {
    async getUserByToken(token: string) {
        const { _id } = checkAuth(token);
        const user = await UserModel.findById(_id);
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

    async saveUser(discordId: string) {
        const candidate = await UserModel.findOne({ discordId });
        if (!candidate) {
            const user = await UserModel.create({ discordId });
            if (!user) {
                throw new GraphQLError("Database Error", {
                    extensions: { code: "DATABASE_ERROR" },
                });
            }
            const token = generateToken(discordId, user.role);
            return { user, token };
        } else {
            const token = generateToken(discordId, candidate.role);
            return { user: candidate, token };
        }
    }

    async deleteUser(discordId: string, token: string) {
        await checkAdminAuth(token);

        const userStatus = await UserModel.deleteOne({ discordId });

        return userStatus;
    }
}

export default new UserService();
