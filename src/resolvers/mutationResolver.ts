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
            }: {
                addRoleToSquadInput: { data: IRoleTypes; squadId: string };
            },
            contextValue: { token: string }
        ) => {
            const event = await eventService.addRoleToSquad(
                addRoleToSquadInput,
                contextValue.token
            );
            return event;
        },

        changeAllRolesInSquad: async (
            parent: any,
            {
                changeAllRolesInSquadInput,
            }: {
                changeAllRolesInSquadInput: {
                    data: IRoleTypes;
                    squadId: string;
                };
            },
            contextValue: { token: string }
        ) => {
            const event = await eventService.changeAllRolesInSquad(
                changeAllRolesInSquadInput,
                contextValue.token
            );
            return event;
        },

        deleteRoleFromSquad: async (
            parent: any,
            {
                deleteRoleFromSquadInput,
            }: {
                deleteRoleFromSquadInput: {
                    roleId: string;
                    squadId: string;
                };
            },
            contextValue: { token: string }
        ) => {
            const event = await eventService.deleteRoleFromSquad(
                deleteRoleFromSquadInput,
                contextValue.token
            );
            return event;
        },

        addUserToEvent: async (
            parent: any,
            {
                addUserToEventInput,
            }: {
                addUserToEventInput: {
                    roleId: string;
                    roleName: string;
                    squadId: string;
                };
            },
            contextValue: { token: string }
        ) => {
            const event = await eventService.addUserToEvent(
                addUserToEventInput,
                contextValue.token
            );
            return event;
        },

        removeFromBusyRoles: async (
            parent: any,
            {
                removeFromBusyRolesInput,
            }: {
                removeFromBusyRolesInput: {
                    roleId: string;
                    squadId: string;
                };
            },
            contextValue: { token: string }
        ) => {
            const event = await eventService.removeFromBusyRoles(
                removeFromBusyRolesInput,
                contextValue.token
            );
            return event;
        },
    },
};

export { mutationResolver };
