import eventService from "../service/eventService.js";
import userService from "../service/userService.js";

import {
    IEvent,
    IPlatoon,
    IRole,
    ISquad,
    IUsedRoles,
} from "../types/eventTypes.js";

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
            { createEventInput }: { createEventInput: IEvent },
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
            }: { updateEventInput: { data: IEvent; _id: string } },
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
                addRoleToSquadInput: { data: IRole; squadId: string };
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
                    data: IRole;
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

        addPlatoonByEventId: async (
            parent: any,
            {
                addPlatoonByEventIdInput,
            }: {
                addPlatoonByEventIdInput: {
                    eventId: string;
                    platoon: IPlatoon;
                };
            },
            contextValue: { token: string }
        ) => {
            const event = await eventService.addPlatoonByEventId(
                addPlatoonByEventIdInput,
                contextValue.token
            );
            return event;
        },

        deletePlatoonById: async (
            parent: any,
            {
                deletePlatoonByIdInput,
            }: {
                deletePlatoonByIdInput: {
                    eventId: string;
                    platoonId: string;
                };
            },
            contextValue: { token: string }
        ) => {
            const event = await eventService.deletePlatoonById(
                deletePlatoonByIdInput,
                contextValue.token
            );
            return event;
        },

        addSquadByPlatoonId: async (
            parent: any,
            {
                addSquadByPlatoonIdInput,
            }: {
                addSquadByPlatoonIdInput: {
                    platoonId: string;
                    squad: ISquad;
                };
            },
            contextValue: { token: string }
        ) => {
            const event = await eventService.addSquadByPlatoonId(
                addSquadByPlatoonIdInput,
                contextValue.token
            );
            return event;
        },

        deleteSquadById: async (
            parent: any,
            {
                deleteSquadByIdInput,
            }: {
                deleteSquadByIdInput: {
                    platoonId: string;
                    squadId: string;
                };
            },
            contextValue: { token: string }
        ) => {
            const event = await eventService.deleteSquadById(
                deleteSquadByIdInput,
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
                    playerName: string
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

        addToWaitingList: async (
            parent: any,
            {
                addToWaitingListInput,
            }: {
                addToWaitingListInput: {
                    squadId: string;
                    usedRole: IUsedRoles;
                };
            },
            contextValue: { token: string }
        ) => {
            const event = await eventService.addToWaitingList(
                addToWaitingListInput,
                contextValue.token
            );
            return event;
        },

        addToBusyRoles: async (
            parent: any,
            {
                addToBusyRolesInput,
            }: {
                addToBusyRolesInput: {
                    squadId: string;
                    usedRole: IUsedRoles;
                };
            },
            contextValue: { token: string }
        ) => {
            const event = await eventService.addToBusyRoles(
                addToBusyRolesInput,
                contextValue.token
            );
            return event;
        },
    },
};

export { mutationResolver };
