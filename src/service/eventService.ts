import { GraphQLError, graphql } from "graphql";

import EventModel from "../models/Event.js";
import { logger, checkAdminAuth, checkAuth } from "../utils/_index.js";

import {
    IEvent,
    IPlatoon,
    IRole,
    ISquad,
    IUsedRoles,
} from "../types/eventTypes.js";

import {Client } from "discord.js"
import formatBeautifulDate from "../utils/beautyDate.js";
const token = process.env.DISCORD_TOKEN; 

const client = new Client({
    intents: [
      // Здесь перечислите необходимые вам намерения (intents) для вашего бота
      "GuildMembers",
    "GuildModeration",
    "Guilds",
    "GuildBans",
    "GuildEmojisAndStickers",
    "GuildIntegrations",
    "GuildWebhooks",
    "GuildInvites",
    "GuildVoiceStates",
    "GuildPresences",
    "GuildMessages",
    "GuildMessageReactions",
    "GuildMessageTyping",
    "DirectMessages",
    "DirectMessageReactions",
    "DirectMessageTyping",
    "MessageContent",
    "GuildScheduledEvents",
    "AutoModerationConfiguration",
    "AutoModerationExecution"
      // и так далее...
    ],
  });
  client.login(token);

  const guildId = process.env.GUILD_ID!;

class EventService {
    async getAllEvents() {
        const events = await EventModel.find();
        if (!events) {
            logger.error("Can't find events in getAllEvents");
            throw new GraphQLError("Can't find events");
        }

        return events;
    }

    async getOneEvent(_id: string) {
        const event = await EventModel.findOne({ _id });
        if (!event) {
            logger.error("Can't find event in getOneEvent");
            throw new GraphQLError("Can't find event");
        }

        return event;
    }

    async getEventsByFinished(finished: boolean) {
        let events;
        if (finished) {
            events = await EventModel.find({ date: { $lte: Date.now() } });
        } else {
            events = await EventModel.find({ date: { $gt: Date.now() } });
        }
        if (!events) {
            logger.error("Can't find events in getEventsByFinished");
            throw new GraphQLError("Can't find events");
        }
        return events;
    }

    async createEvent(data: IEvent, token: string) {
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
        { data, _id }: { data: IEvent; _id: string },
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
        { data, squadId }: { data: IRole; squadId: string },
        token: string
    ) {
        checkAdminAuth(token);
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
        { data, squadId }: { data: IRole; squadId: string },
        token: string
    ) {
        checkAdminAuth(token);
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
        checkAdminAuth(token);
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

    async addPlatoonByEventId(
        { eventId, platoon }: { eventId: string; platoon: IPlatoon },
        token: string
    ) {
        checkAdminAuth(token);
        const updatedEvent = await EventModel.findOneAndUpdate(
            { _id: eventId },
            {
                $push: { platoons: platoon },
            },
            { new: true }
        );
        if (!updatedEvent) {
            logger.error("Modified forbidden in addPlatoonByEventId");
            throw new GraphQLError("Modified forbidden");
        } else return updatedEvent;
    }

    async deletePlatoonById(
        { eventId, platoonId }: { eventId: string; platoonId: string },
        token: string
    ) {
        checkAdminAuth(token);
        const updatedEvent = await EventModel.findOneAndUpdate(
            { _id: eventId },
            {
                $pull: { platoons: { _id: platoonId } },
            },
            { new: true }
        );
        if (!updatedEvent) {
            logger.error("Modified forbidden in addPlatoonByEventId");
            throw new GraphQLError("Modified forbidden");
        } else return updatedEvent;
    }

    async addSquadByPlatoonId(
        { platoonId, squad }: { platoonId: string; squad: ISquad },
        token: string
    ) {
        checkAdminAuth(token);
        const updatedEvent = await EventModel.findOneAndUpdate(
            { "platoons._id": platoonId },
            {
                $push: { "platoons.$[].squads": squad },
            },
            { new: true }
        );
        if (!updatedEvent) {
            logger.error("Modified forbidden in addSquadByPlatoonId");
            throw new GraphQLError("Modified forbidden");
        } else return updatedEvent;
    }

    async deleteSquadById(
        { squadId, platoonId }: { platoonId: string; squadId: string },
        token: string
    ) {
        checkAdminAuth(token);
        const updatedEvent = await EventModel.findOneAndUpdate(
            { "platoons._id": platoonId },
            {
                $pull: { "platoons.$[].squads": { _id: squadId } },
            },
            { new: true }
        );
        if (!updatedEvent) {
            logger.error("Modified forbidden in deleteSquadById");
            throw new GraphQLError("Modified forbidden");
        } else return updatedEvent;
    }

    async addUserToEvent(
        {
            roleName,
            roleId,
            squadId,
            playerName
        }: { roleName: string; roleId: string; squadId: string,  playerName: string },
        token: string
    ) {
        const { _id } = checkAuth(token);

        // const userId = process.env.DISCORD_USER_ID!;
        const eventReceive = await EventModel.findOne({ "platoons.squads.roles._id": roleId });

        if (!eventReceive) {
            throw new GraphQLError("Event isn't received");
        }
        const date = eventReceive.date || new Date(); 
        const guild = await client.guilds.fetch(guildId);
        const role = await guild.roles.create({
            name: `${eventReceive.name} - ${formatBeautifulDate(date)}`,
            color: 'Random', // Цвет роли (может быть строкой или числом)
            permissions: ['SendMessages'], // Права роли (см. документацию Discord.js)
          });
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
                        playerName, 
                        roleDiscordId: role.id
                    },
                },
            },
            {
                arrayFilters: [
                    { "xxx._id": roleId, "xxx.count": { $gt: 0 } },
                    {
                        "yyy._id": squadId,
                        "yyy.busyRoles.discordId": { $ne: _id },
                        "yyy.roles.count": { $ne: 0 },
                    },
                ],
                new: true,
            }
        );
        if (!updatedEvent) {
            logger.error("Modified forbidden in addUserToEvent");
            throw new GraphQLError("Modified forbidden");
        } else {

        // console.log(role)
            const member = await guild.members.fetch(_id);
            const fetchedRole = await guild.roles.fetch(role.id);
    
        if (fetchedRole) {
            let addRole = await member.roles.add(fetchedRole);
            if (!addRole) {
                throw new GraphQLError("Discord role error!")
        }
        
              // Обновляем ID роли в объекте busyRoles

        } else {
          console.log(`Роль с id ${roleId} не найдена.`);
          // Здесь вы можете обработать ситуацию, когда роль не найдена.
        }

   

        
        return updatedEvent;
        }}

    async removeFromBusyRoles(
        { roleId, squadId }: { roleId: string; squadId: string },
        token: string
    ) {
        const { _id } = checkAuth(token);
        const updatedEvent = await EventModel.findOneAndUpdate(
            { "platoons.squads._id": squadId },
            {
                $inc: {
                    "platoons.$[].squads.$[].roles.$[xxx].count": 1,
                },
                $pull: {
                    "platoons.$[].squads.$[yyy].busyRoles": { discordId: _id },
                },
            },
            {
                arrayFilters: [{ "xxx._id": roleId }, { "yyy._id": squadId }],
                new: true,
            }
        );
        // const pipeline = [
        //     {
        //       $match: {
        //         "platoons.squads._id": squadId,
        //         "platoons.squads.roles._id": roleId, // Добавьте дополнительные условия фильтрации, если необходимо
        //       },
        //     },
        //     {
        //       $unwind: "$platoons",
        //     },
        //     {
        //       $unwind: "$platoons.squads",
        //     },
        //     {
        //       $unwind: "$platoons.squads.roles",
        //     },
        //     {
        //       $unwind: "$platoons.squads.roles.busyRoles",
        //     },
        //     {
        //       $match: {
        //         "platoons.squads.roles.busyRoles.roleDiscordId": _id,
        //       },
        //     },
        //     {
        //       $project: {
        //         _id: 0, // Исключите _id из результата
        //         roleDiscordId: "$platoons.squads.roles.busyRoles.roleDiscordId",
        //       },
        //     },
        //   ];
          
        //   const updatedEvent2 = await EventModel.aggregate(pipeline);
        //   console.log(updatedEvent2)
          
        //   if (updatedEvent2.length > 0) {
        //     const discordId = updatedEvent2[0].busyRoles[0].discordId;
        //     console.log('discordId:', discordId);
        //   } else {
        //     logger.error("Modified forbidden in removeFromBusyRoles");
        //     throw new GraphQLError("Modified forbidden");
        //   }
        if (!updatedEvent) {
            logger.error("Modified forbidden in removeFromBusyRoles");
            throw new GraphQLError("Modified forbidden");
        } else {
            // try {
            //     const guild = await client.guilds.fetch(guildId);
            //     const member = await guild.members.fetch(_id);
            
            //     if (member) {
            //       const role = guild.roles.cache.get(); // Получаем объект роли по ID
            
            //       if (role) {
            //         await member.roles.remove(role); // Удаляем роль у пользователя
            //         console.log(`Роль ${role.name} удалена у пользователя ${member.user.tag}`);
            //       } else {
            //         console.log(`Роль с ID ${roleId} не найдена.`);
            //       }
            //     } else {
            //       console.log(`Пользователь с ID ${_id} не найден.`);
            //     }
            //   } catch (error) {
            //     console.error('Ошибка при выполнении операции:', error);
            //   }
            return updatedEvent;
    }}

    async addToWaitingList(
        { squadId, usedRole }: { squadId: string; usedRole: IUsedRoles },
        token: string
    ) {
        checkAdminAuth(token);
        const updatedEvent = await EventModel.findOneAndUpdate(
            { "platoons.squads._id": squadId },
            {
                $inc: {
                    "platoons.$[].squads.$[].roles.$[xxx].count": 1,
                },
                $pull: {
                    "platoons.$[].squads.$[yyy].busyRoles": {
                        discordId: usedRole.discordId,
                    },
                },
                $push: {
                    "platoons.$[].squads.$[yyy].waitingList": usedRole,
                },
            },
            {
                arrayFilters: [
                    { "xxx.name": usedRole.role },
                    { "yyy._id": squadId },
                ],
                new: true,
            }
        );
        if (!updatedEvent) {
            logger.error("Modified forbidden in addToWaitingList");
            throw new GraphQLError("Modified forbidden");
        } else return updatedEvent;
    }

    async addToBusyRoles(
        { squadId, usedRole }: { squadId: string; usedRole: IUsedRoles },
        token: string
    ) {
        checkAdminAuth(token);
        const updatedEvent = await EventModel.findOneAndUpdate(
            { "platoons.squads._id": squadId },
            {
                $inc: {
                    "platoons.$[].squads.$[].roles.$[xxx].count": -1,
                },
                $pull: {
                    "platoons.$[].squads.$[yyy].waitingList": {
                        discordId: usedRole.discordId,
                    },
                },
                $push: {
                    "platoons.$[].squads.$[yyy].busyRoles": usedRole,
                },
            },
            {
                arrayFilters: [
                    { "xxx.name": usedRole.role },
                    { "yyy._id": squadId },
                ],
                new: true,
            }
        );
        if (!updatedEvent) {
            logger.error("Modified forbidden in addToBusyRoles");
            throw new GraphQLError("Modified forbidden");
        } else return updatedEvent;
    }

    
    async deleteEvent(_id: string, token: string) {
        await checkAdminAuth(token);

        const eventStatus = await EventModel.deleteOne({_id});
        if (!eventStatus) {
            throw new GraphQLError("Something went wrong")
        }
        return "Done";
    }
}

export default new EventService();
