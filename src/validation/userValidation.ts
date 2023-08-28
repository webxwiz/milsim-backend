import * as yup from "yup";
import { GraphQLError } from "graphql";

const userSchema = yup.object().shape({
    email: yup.string().email().max(100),
});

export const userValidate = async (validateData: { [key: string]: string }) => {
    try {
        await userSchema.validate(validateData);
    } catch (err: any) {
        throw new GraphQLError(err.message);
    }
};
