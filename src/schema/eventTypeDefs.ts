export const eventTypeDefs = `#graphql
  scalar Date
  
  type Event {
    _id: ID!
    createdAt: Date
    name: String
    image: String
    description: String
    date: Date
    duration: Int
    platoons: [PlatoonSchemaTypes]
  }
  type PlatoonSchemaTypes {
    _id: ID!
    name: String
    color: String
    image: String
    squads: [SquadsSchemaTypes]
  }
  type SquadsSchemaTypes {
    _id: ID!
    name: String,
    roles: [RoleSchemaTypes]
    busyRoles: [UsedSchemaTypes]
    waitingList: [UsedSchemaTypes]
    enlisted: [UsedSchemaTypes]
  }
  type RoleSchemaTypes {
    _id: ID!
    name: String
    count: Int
  }
  type UsedSchemaTypes {
    _id: ID!
    discordId: String
    role: String
  }
  
  input EventInput {
    name: String
    duration: Int
    date: String
    description: String
    image: String
    platoons: [PlatoonInput]
  }
  input PlatoonInput {
    name: String
    color: String
    image: String
    squads: [SquadsInput]
  }
  input SquadsInput {
    name: String
    roles: [RoleInput]
    busyRoles: [UsedRolesInput]
    waitingList: [UsedRolesInput]
    enlisted: [UsedRolesInput]
  }
  input RoleInput {
    name: String
    count: Int
  }
  input UsedRolesInput {
    discordId: String
    role: String
  }
  input UpdateEventInput {
    data: EventInput
    _id: ID
  }
  input AddRoleToSquadInput {
    squadId: ID
    data: RoleInput
  }
  input ChangeAllRolesInSquadInput {
    squadId: ID
    data: [RoleInput]
  }
  input DeleteRoleFromSquadInput {
    squadId: ID
    roleId: ID
  }
  input AddUserToEventInput {
    squadId: ID
    roleId: ID
    roleName: String
  }
  input RemoveFromBusyRolesInput {
    squadId: ID
    roleId: ID
  }
  input AddPlatoonByEventIdInput {
    eventId: ID
    platoon: PlatoonInput
  }
  input DeletePlatoonByIdInput {
    eventId: ID
    platoonId: ID
  }
  input AddSquadByPlatoonIdInput {
    platoonId: ID
    squad: SquadsInput
  }
  input DeleteSquadByIdInput {
    platoonId: ID
    squadId: ID
  }
  input MoveUsedRoleInput {
    squadId: ID
    usedRole: UsedRolesInput
  }

  type Query {
    getAllEvents: [Event]
    getOneEvent(_id: ID): Event      
  }
  type Mutation {
    createEvent(createEventInput: EventInput): Event
    updateEvent(updateEventInput: UpdateEventInput): Event

    addRoleToSquad(addRoleToSquadInput: AddRoleToSquadInput): Event
    changeAllRolesInSquad(changeAllRolesInSquadInput: ChangeAllRolesInSquadInput): Event
    deleteRoleFromSquad(deleteRoleFromSquadInput: DeleteRoleFromSquadInput): Event

    addPlatoonByEventId(addPlatoonByEventIdInput: AddPlatoonByEventIdInput): Event
    deletePlatoonById(deletePlatoonByIdInput: DeletePlatoonByIdInput): Event
    addSquadByPlatoonId(addSquadByPlatoonIdInput: AddSquadByPlatoonIdInput): Event
    deleteSquadById(deleteSquadByIdInput: DeleteSquadByIdInput): Event

    addUserToEvent(addUserToEventInput: AddUserToEventInput): Event
    removeFromBusyRoles(removeFromBusyRolesInput: RemoveFromBusyRolesInput): Event

    addToWaitingList(addToWaitingListInput: MoveUsedRoleInput): Event
    addToBusyRoles(addToBusyRolesInput: MoveUsedRoleInput): Event
  }
`;
