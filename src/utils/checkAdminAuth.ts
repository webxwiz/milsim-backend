import jwt from "jsonwebtoken";

import { GraphQLError } from "graphql";

export const checkAdminAuth = (auth: string) => {
    if (!auth) {
        throw new GraphQLError("No authorization data");
    }
    try {
        const token = auth.split(" ")[1];
        const { _id, role }: any = jwt.verify(
            token,
            process.env.TOKEN_SECRET_KEY as string
        );

        if (role === "ADMIN") return _id;
        else throw new GraphQLError("You don't have appropriate permission");
    } catch {
        throw new GraphQLError("Authorization error");
    }
};
