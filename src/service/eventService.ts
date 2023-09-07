import { ObjectId } from "mongoose";
import { GraphQLError } from "graphql";

import EventModel from "../models/Event.js";
import { logger, checkAdminAuth, checkAuth } from "../utils/_index.js";

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
        { data, squadId }: { data: IRoleTypes; squadId: string },
        token: string
    ) {
        // checkAdminAuth(token);
        const updatedEvent = await EventModel.findOneAndUpdate(
            { "platoons.squads._id": squadId },
            {
                $push: { "platoons.$[].squads.$[xxx].roles": data },
            },
            { arrayFilters: [{ "xxx._id": squadId }], new: true }
        );
        if (!updatedEvent) {
            logger.error("Modified forbidden in addRoleToSquad");
            throw new GraphQLError("Modified forbidden");
        } else return updatedEvent;
    }

    async changeAllRolesInSquad(
        { data, squadId }: { data: IRoleTypes; squadId: string },
        token: string
    ) {
        // checkAdminAuth(token);
        const updatedEvent = await EventModel.findOneAndUpdate(
            { "platoons.squads._id": squadId },
            {
                $set: {
                    "platoons.$[].squads.$[xxx].roles": data,
                },
            },
            { arrayFilters: [{ "xxx._id": squadId }], new: true }
        );
        if (!updatedEvent) {
            logger.error("Modified forbidden in changeAllRolesInSquad");
            throw new GraphQLError("Modified forbidden");
        } else return updatedEvent;
    }

    async deleteRoleFromSquad(
        { squadId, roleId }: { squadId: string; roleId: string },
        token: string
    ) {
        // checkAdminAuth(token);
        const updatedEvent = await EventModel.findOneAndUpdate(
            { "platoons.squads._id": squadId },
            {
                $pull: { "platoons.$[].squads.$[xxx].roles": { _id: roleId } },
            },
            { arrayFilters: [{ "xxx._id": squadId }], new: true }
        );
        if (!updatedEvent) {
            logger.error("Modified forbidden in deleteRoleFromSquad");
            throw new GraphQLError("Modified forbidden");
        } else return updatedEvent;
    }

    async addPlatoonByEventId() {}

    async changePlatoonById() {}

    async deletePlatoonById() {}

    async addSquadByPlatoonId() {}

    async changeSquadById() {}

    async deleteSquadById() {}

    async addUserToEvent(
        { roleName, roleId, squadId }: { roleName: string; roleId: string; squadId: string; },
        token: string
    ) {
        const { _id } = checkAuth(token);
        const updatedEvent = await EventModel.findOneAndUpdate(
            { "platoons.squads.roles._id": roleId },
            {
                $inc: {
                    "platoons.$[].squads.$[].roles.$[xxx].count": -1,
                },
                $push: {
                    "platoons.$[].squads.$[yyy].busyRoles": {
                        discordId: _id,
                        role: roleName,
                    },
                },
            },
            {
                arrayFilters: [
                    { "xxx._id": roleId, "xxx.count": { $gt: 0 } },
                    { "yyy._id": squadId },
                ],
                new: true,
            }
        );
        if (!updatedEvent) {
            logger.error("Modified forbidden in addUserToEvent");
            throw new GraphQLError("Modified forbidden");
        } else return updatedEvent;
    }
}

export default new EventService();
