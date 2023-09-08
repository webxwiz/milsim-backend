import { ObjectId } from "mongoose";

import userService from "../service/userService.js";
import eventService from "../service/eventService.js";

const queryResolver = {
    Query: {
        getUserByToken: async (
            parent: any,
            args: any,
            contextValue: { token: string }
        ) => {
            const user = await userService.getUserByToken(contextValue.token);

            return user;
        },

        getAllUsers: async (parent: any, args: any) => {
            const users = await userService.getAllUsers();

            return users;
        },

        getAllEvents: async (parent: any, args: any) => {
            const events = await eventService.getAllEvents();

            return events;
        },

        getOneEvent: async (parent: any, { _id }: { _id: string }) => {
            const event = await eventService.getOneEvent(_id);

            return event;
        },
    },
};

export { queryResolver };
