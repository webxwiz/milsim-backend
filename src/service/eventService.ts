import { ObjectId } from "mongoose";
import { GraphQLError } from "graphql";

import EventModel from "../models/Event.js";
import { logger, checkAdminAuth } from "../utils/_index.js";

import { ICreateEvent, IRoleTypes, IUpdateEvent } from "../types/eventTypes.js";

class EventService {
    async getAllEvents() {
        const events = await EventModel.find();
        if (!events) {
            logger.error("Can't find events in getAllEvents");
            throw new GraphQLError("Can't find events");
        }

        return events;
    }

    async getOneEvent(_id: ObjectId) {
        const event = await EventModel.findOne({ _id });
        if (!event) {
            logger.error("Can't find event in getOneEvent");
            throw new GraphQLError("Can't find event");
        }

        return event;
    }

    async createEvent(data: ICreateEvent, token: string) {
        checkAdminAuth(token);

        const event = EventModel.create({ ...data });
        if (!event) {
            logger.error("Database Error in createEvent");
            throw new GraphQLError("Database Error", {
                extensions: { code: "DATABASE_ERROR" },
            });
        }

        return event;
    }

    async updateEvent(
        { data, _id }: { data: IUpdateEvent; _id: string },
        token: string
    ) {
        checkAdminAuth(token);

        const updatedEvent = await EventModel.findOneAndUpdate(
            { _id },
            {
                $set: { ...data },
            },
            { new: true }
        );
        if (!updatedEvent) {
            logger.error("Modified forbidden in updateEvent");
            throw new GraphQLError("Modified forbidden");
        } else return updatedEvent;
    }

    async addRoleToSquad(
        { data, _id }: { data: IRoleTypes; _id: string },
        token: string
    ) {
        checkAdminAuth(token);
        const updatedSquad = await EventModel.findOneAndUpdate(
            { "platoons.squads._id": _id },
            {
                $push: { "platoons.$[].squads.$[xxx].roles": data },
            },
            { arrayFilters: [{ "xxx._id": _id }], new: true }
        );
        if (!updatedSquad) {
            logger.error("Modified forbidden in addRoleToSquad");
            throw new GraphQLError("Modified forbidden");
        } else return updatedSquad;
    }

    async changeRoleInSquad(
        { data, _id }: { data: IRoleTypes; _id: string },
        token: string
    ) {
        checkAdminAuth(token);
        const updatedSquad = await EventModel.findOneAndUpdate(
            { "platoons.squads": { _id } },
            {
                $pull: {
                    "platoons.$[].squads.$[xxx].roles": {
                        _id: "64f9baba319fa2ee702f7d03",
                    },
                },
            },
            { arrayFilters: [{ "xxx._id": _id }], new: true }
        );
        if (!updatedSquad) {
            logger.error("Modified forbidden in addRoleToSquad");
            throw new GraphQLError("Modified forbidden");
        } else return updatedSquad;
    }

    async deleteRoleFromSquad(token: string) {
        checkAdminAuth(token);
    }
}

export default new EventService();
