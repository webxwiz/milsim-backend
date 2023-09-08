export const eventTypeDefs = `#graphql
  scalar Date
  
  type Event {
    _id: ID!
    createdAt: Date
    name: String
    image: String
    description: String
    platoons: [PlatoonSchemaTypes]
    date: Date
    duration: Int
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
  
  input CreateEventInput {
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
  }
  input RoleInput {
    name: String
    count: Int
  }
  input UpdateEventInput {
    data: UpdateEventInputData
    _id: ID
  }
  input UpdateEventInputData {
    name: String
    duration: Int
    date: String
    description: String
    image: String
  }
  input AddRoleToSquadInput {
    squadId: ID
    data: RoleInputData
  }
  input ChangeAllRolesInSquadInput {
    squadId: ID
    data: [RoleInputData]
  }
  input RoleInputData {
    name: String
    count: Int
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

  type Query {
    getAllEvents: [Event]
    getOneEvent(_id: ID): Event      
  }
  type Mutation {
    createEvent(createEventInput: CreateEventInput): Event
    updateEvent(updateEventInput: UpdateEventInput): Event

    addRoleToSquad(addRoleToSquadInput: AddRoleToSquadInput): Event
    changeAllRolesInSquad(changeAllRolesInSquadInput: ChangeAllRolesInSquadInput): Event
    deleteRoleFromSquad(deleteRoleFromSquadInput: DeleteRoleFromSquadInput): Event

    addUserToEvent(addUserToEventInput: AddUserToEventInput): Event
    removeFromBusyRoles(removeFromBusyRolesInput: RemoveFromBusyRolesInput): Event
  }
`;
