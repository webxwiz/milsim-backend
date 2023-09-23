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
import User from "../models/User.js";
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
        }: { roleName: string; roleId: string; squadId: string},
        token: string
    ) {
        const { _id } = checkAuth(token);

        const user = await User.findOne({discordId: _id})

        // const userId = process.env.DISCORD_USER_ID!;
        const eventReceive = await EventModel.findOne({
            "platoons.squads.roles._id": roleId,
            "platoons.squads.roles.count": { $gt: 0 },
            "platoons.squads._id": squadId
          });
          

        if (!eventReceive) {
            throw new GraphQLError("Event isn't received");
        }
        let discordColor
        if (eventReceive) {
            const platoonsArray = eventReceive.platoons; // Получаем массив "platoons" из найденного объекта
            if (platoonsArray && Array.isArray(platoonsArray)) {
              for (const platoon of platoonsArray) {
                if (platoon.color) {
                  discordColor = platoon.color;
                }
              }
            }
          }

        // console.log(eventReceive)
        console.log(discordColor)
        const date = eventReceive.date || new Date(); 
        const guild = await client.guilds.fetch(guildId);
        const role = await guild.roles.create({
            name: `${eventReceive.name} - ${formatBeautifulDate(date)}`,
            color: discordColor, // Цвет роли (может быть строкой или числом)
            permissions: ['SendMessages'], // Права роли (см. документацию Discord.js)
          });

          console.log(role.id)
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
                        playerName: user.name, 
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
            console.log(role.id);

            const fetchedRole = await guild.roles.fetch(role.id);
            // console.log(fetchedRole)
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
            {
              roleName,
              roleId,
              squadId,
            }: { roleName: string; roleId: string; squadId: string },
            token: string
          ) {
            const { _id } = checkAuth(token);
          
            const eventReceive = await EventModel.findOne({
              "platoons.squads.roles._id": roleId,
              "platoons.squads.roles.count": { $gt: 0 },
              "platoons.squads._id": squadId
            });
          
            if (!eventReceive) {
              throw new GraphQLError("Event isn't received");
            }

            const guild = await client.guilds.fetch(guildId);
          
            // Удалите роль из массива busyRoles
            const updatedEvent = await EventModel.findOneAndUpdate(
              { "platoons.squads.roles._id": roleId },
              {
                $inc: {
                  "platoons.$[].squads.$[].roles.$[xxx].count": 1, // Увеличьте счетчик на 1, так как роль возвращается
                },
                $pull: { // Удалите роль из busyRoles
                  "platoons.$[].squads.$[].busyRoles": {
                    discordId: _id,
                    role: roleName,
                    // roleDiscordId: role.id
                  },
                },
              },
              {
                arrayFilters: [
                  { "xxx._id": roleId },
                ],
                new: true,
              }
            );
        // После выполнения findOneAndUpdate и получения обновленного документа updatedEvent

// Найдите индекс объекта, который был удален из busyRoles
const removedRoleIndex = eventReceive.platoons
.flatMap(platoon => platoon.squads)
.flatMap(squad => squad.busyRoles)
.findIndex(role => role.discordId === _id && role.role === roleName);

// if (removedRoleIndex !== -1) {
const removedRole = eventReceive.platoons
  .flatMap(platoon => platoon.squads)
  .flatMap(squad => squad.busyRoles)
  .splice(removedRoleIndex, 1)[0]; // Извлекаем удаленный объект из массива

const roleDiscordId = removedRole.roleDiscordId;
// } else {
// console.log(`Объект с discordId: ${_id} и ролью: ${roleName} не найден в массиве busyRoles.`);
// }

            if (!updatedEvent) {
              logger.error("Modified forbidden in removeUserFromEvent");
              throw new GraphQLError("Modified forbidden");
            } else {
              // Найдите роль по ее ID
              console.log(typeof roleDiscordId);

              const member = await guild.members.fetch(_id);
              const roleDiscordIdString = String(roleDiscordId);
              console.log(typeof roleDiscordIdString)
              console.log(guild)
              const fetchedRole = await guild.roles.fetch(roleDiscordIdString);
              console.log(fetchedRole)
if (fetchedRole) {
    let removeRole = await member.roles.remove(fetchedRole);
    if (!removeRole) {
        throw new GraphQLError("Discord role error!");
    }
}            
                // Добавьте роль пользователю
                // await member.roles.remove(role);
          
                return updatedEvent;
            }
          }
          
          
          async addToWaitingList(
            {
              roleName,
              roleId,
              squadId,
              _id
            }: { roleName: string; roleId: string; squadId: string, _id: string },
            token: string
          ) {
            // const { _id } = checkAuth(token);
            await checkAdminAuth(token)
          
            const eventReceive = await EventModel.findOne({
              "platoons.squads.roles._id": roleId,
              "platoons.squads.roles.count": { $gt: 0 },
              "platoons.squads._id": squadId
            });
          
            if (!eventReceive) {
              throw new GraphQLError("Event isn't received");
            }

            const guild = await client.guilds.fetch(guildId);
            const user = await User.findOne({discordId: _id})
            // Удалите роль из массива busyRoles
            const updatedEvent = await EventModel.findOneAndUpdate(
              { "platoons.squads.roles._id": roleId },
              {
                $inc: {
                  "platoons.$[].squads.$[].roles.$[xxx].count": 1, // Увеличьте счетчик на 1, так как роль возвращается
                },
                $pull: { // Удалите роль из busyRoles
                  "platoons.$[].squads.$[].busyRoles": {
                    discordId: _id,
                    role: roleName,
                    // roleDiscordId: role.id
                  },
                },
                $push: { // Добавить роль в waitingList
                    "platoons.$[].squads.$[].waitingList": {
                      discordId: _id,
                      role: roleName,
                      playerName: user.name
                    },
                  },
              },
              {
                arrayFilters: [
                  { "xxx._id": roleId },
                ],
                new: true,
              }
            );
        // После выполнения findOneAndUpdate и получения обновленного документа updatedEvent

// Найдите индекс объекта, который был удален из busyRoles
const removedRoleIndex = eventReceive.platoons
.flatMap(platoon => platoon.squads)
.flatMap(squad => squad.busyRoles)
.findIndex(role => role.discordId === _id && role.role === roleName);

// if (removedRoleIndex !== -1) {
const removedRole = eventReceive.platoons
  .flatMap(platoon => platoon.squads)
  .flatMap(squad => squad.busyRoles)
  .splice(removedRoleIndex, 1)[0]; // Извлекаем удаленный объект из массива

const roleDiscordId = removedRole.roleDiscordId;
// } else {
// console.log(`Объект с discordId: ${_id} и ролью: ${roleName} не найден в массиве busyRoles.`);
// }

            if (!updatedEvent) {
              logger.error("Modified forbidden in removeUserFromEvent");
              throw new GraphQLError("Modified forbidden");
            } else {
              // Найдите роль по ее ID
              console.log(typeof roleDiscordId);

              const member = await guild.members.fetch(_id);
              const roleDiscordIdString = String(roleDiscordId);
              console.log(typeof roleDiscordIdString)
              console.log(guild)
              const fetchedRole = await guild.roles.fetch(roleDiscordIdString);
              console.log(fetchedRole)
if (fetchedRole) {
    let removeRole = await member.roles.remove(fetchedRole);
    if (!removeRole) {
        throw new GraphQLError("Discord role error!");
    }
}            
                // Добавьте роль пользователю
                // await member.roles.remove(role);
          
                return updatedEvent;
            }
          }

          async deleteFromWaitingList(
            {
              roleName,
              roleId,
              squadId,
              _id
            }: { roleName: string; roleId: string; squadId: string, _id: string },
            token: string
          ) {
            // const { _id } = checkAuth(token);
            await checkAdminAuth(token)
          console.log(roleName)
            const eventReceive = await EventModel.findOne({
              "platoons.squads.roles._id": roleId,
              "platoons.squads.roles.count": { $gt: 0 },
              "platoons.squads._id": squadId
            });
          
            if (!eventReceive) {
              throw new GraphQLError("Event isn't received");
            }

            const user = await User.findOne({discordId: _id})
            if (!user) {
                throw new GraphQLError("User is undefined")
            }
            // Удалите роль из массива busyRoles
            const updatedEvent = await EventModel.findOneAndUpdate(
              { "platoons.squads.roles._id": roleId },
              {
                $pull: { // Добавить роль в waitingList
                    "platoons.$[].squads.$[].waitingList": {
                      discordId: _id,
                      role: roleName,
                      playerName: user.name
                    },
                  },
              },
              {
                new: true,
              }
            );
return updatedEvent
          }

          async addToBusyRoleFromAdmin(
            {
                roleName,
                roleId,
                squadId,

                _id
            }: { roleName: string; roleId: string; squadId: string, _id: string },
            token: string
        ) {
            // const { _id } = checkAuth(token);
            await checkAdminAuth(token)
    
            // const userId = process.env.DISCORD_USER_ID!;
            const eventReceive = await EventModel.findOne({
                "platoons.squads.roles._id": roleId,
                "platoons.squads.roles.count": { $gt: 0 },
                "platoons.squads._id": squadId
              });
              
    
            if (!eventReceive) {
                throw new GraphQLError("Event isn't received");
            }
            let discordColor
            if (eventReceive) {
                const platoonsArray = eventReceive.platoons; // Получаем массив "platoons" из найденного объекта
                if (platoonsArray && Array.isArray(platoonsArray)) {
                  for (const platoon of platoonsArray) {
                    if (platoon.color) {
                      discordColor = platoon.color;
                    }
                  }
                }
              }
    
            // console.log(eventReceive)
            console.log(discordColor)
            const date = eventReceive.date || new Date(); 
            const guild = await client.guilds.fetch(guildId);
            const role = await guild.roles.create({
                name: `${eventReceive.name} - ${formatBeautifulDate(date)}`,
                color: discordColor, // Цвет роли (может быть строкой или числом)
                permissions: ['SendMessages'], // Права роли (см. документацию Discord.js)
              });
    
              console.log(role.id)
              const user = await User.findOne({discordId: _id})
            if (!user) {
                throw new GraphQLError("User is undefined")
            }
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
                            playerName: user.name, 
                            roleDiscordId: role.id
                        },
                    },
                    $pull: { // Добавить роль в waitingList
                        "platoons.$[].squads.$[].waitingList": {
                          discordId: _id,
                          role: roleName,
                          playerName: user.name
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
                console.log(role.id);
    
                const fetchedRole = await guild.roles.fetch(role.id);
                // console.log(fetchedRole)
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
    // async addToWaitingList(
    //     { squadId, usedRole }: { squadId: string; usedRole: IUsedRoles },
    //     token: string
    // ) {
    //     checkAdminAuth(token);
    //     const updatedEvent = await EventModel.findOneAndUpdate(
    //         { "platoons.squads._id": squadId },
    //         {
    //             $inc: {
    //                 "platoons.$[].squads.$[].roles.$[xxx].count": 1,
    //             },
    //             $pull: {
    //                 "platoons.$[].squads.$[yyy].busyRoles": {
    //                     discordId: usedRole.discordId,
    //                 },
    //             },
    //             $push: {
    //                 "platoons.$[].squads.$[yyy].waitingList": usedRole,
    //             },
    //         },
    //         {
    //             arrayFilters: [
    //                 { "xxx.name": usedRole.role },
    //                 { "yyy._id": squadId },
    //             ],
    //             new: true,
    //         }
    //     );
    //     if (!updatedEvent) {
    //         logger.error("Modified forbidden in addToWaitingList");
    //         throw new GraphQLError("Modified forbidden");
    //     } else return updatedEvent;
    // }

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
