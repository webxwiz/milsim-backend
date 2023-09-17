import mongoose from "mongoose";
const { Schema, model } = mongoose;

const roleSchema = new Schema(
    {
        name: String,
        count: Number,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const usedRolesSchema = new Schema(
    {
        discordId: String,
        role: String,
        playerName: String,
        roleDiscordId: Number
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const squadSchema = new Schema(
    {
        name: String,
        roles: [roleSchema],
        busyRoles: [usedRolesSchema],
        waitingList: [usedRolesSchema],
        enlisted: [usedRolesSchema],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const platoonSchema = new Schema(
    {
        name: String,
        color: String,
        image: String,
        squads: [squadSchema],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const eventSchema = new Schema(
    {
        name: String,
        date: Date,
        duration: Number,
        description: String,
        image: String,
        platoons: [platoonSchema],
    },
    {
        timestamps: true,
        versionKey: false,
        collection: "events",
    }
);

export default model("Event", eventSchema);
