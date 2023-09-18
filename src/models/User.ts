import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        discordId: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ["ADMIN", "USER"],
            default: "ADMIN",
        },
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "users",
    }
);

export default model("User", userSchema);
