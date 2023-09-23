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
            default: "USER",
        },
        name: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "users",
    }
);

export default model("User", userSchema);
