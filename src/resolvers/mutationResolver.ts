import eventService from "../service/eventService.js";
import userService from "../service/userService.js";

import { ICreateEvent, IRoleTypes, IUpdateEvent } from "../types/eventTypes.js";

const mutationResolver = {
    Mutation: {
        saveUser: async (parent: any, { discordId }: { discordId: string }) => {
            const { user, token } = await userService.saveUser(discordId);

            return { user, token };
        },

        deleteUser: async (
            parent: any,
            { discordId }: { discordId: string },
            contextValue: { token: string }
        ) => {
            const userStatus = await userService.deleteUser(
                discordId,
                contextValue.token
            );

            return {
                userStatus,
                message: "User successfully deleted",
            };
        },

        createEvent: async (
            parent: any,
            { createEventInput }: { createEventInput: ICreateEvent },
            contextValue: { token: string }
        ) => {
            const event = await eventService.createEvent(
                createEventInput,
                contextValue.token
            );

            return event;
        },
        updateEvent: async (
            parent: any,
            {
                updateEventInput,
            }: { updateEventInput: { data: IUpdateEvent; _id: string } },
            contextValue: { token: string }
        ) => {
            const event = await eventService.updateEvent(
                updateEventInput,
                contextValue.token
            );

            return event;
        },
        addRoleToSquad: async (
            parent: any,
            {
                addRoleToSquadInput,
            }: { addRoleToSquadInput: { data: IRoleTypes; _id: string } },
            contextValue: { token: string }
        ) => {
            const event = await eventService.addRoleToSquad(
                addRoleToSquadInput,
                contextValue.token
            );

            return event;
        },
        changeRoleInSquad: async (
            parent: any,
            {
                changeRoleInSquadInput,
            }: { changeRoleInSquadInput: { data: IRoleTypes; _id: string } },
            contextValue: { token: string }
        ) => {
            const event = await eventService.changeRoleInSquad(
                changeRoleInSquadInput,
                contextValue.token
            );

            return event;
        },
    },
};

export { mutationResolver };
