import mongoose from "mongoose";
const { Schema, model } = mongoose;

const squadSchema = new Schema({
    name: String,
    roles: [{
        name: String,
        count: Number
    }],
    busyRoles: [{
        discordId: String,
        role: String
    }],
    waitingList: [{
        discordId: String,
        role: String
    }],
    enlisted: [{
        discordId: String,
        role: String
    }],
    platoonid: 
},
{
    timestamps: true,
    versionKey: false
});

const eventSchema = new Schema({
    name: String,
    date: Date,
    duration: Number,
    description: String,
    image: String,
    platoons: [
        {
            name: String,
            color: String,
            image: String,
        }
    ],
},
{
    timestamps: true,
    versionKey: false,
    collection: "events"
});

export default model("Event", eventSchema);

