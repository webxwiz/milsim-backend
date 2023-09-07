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
    createdAt: Date
    squads: [SquadsSchemaTypes]
  }
  type SquadsSchemaTypes {
    _id: ID!
    createdAt: Date
    roles: [RoleSchemaTypes]
  }
  type RoleSchemaTypes {
    _id: ID!
    createdAt: Date
    name: String
    count: Int
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
    squads: [SquadsInput]
  }
  input SquadsInput {
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
    data: AddRoleToSquadInputData
    _id: ID
  }
  input AddRoleToSquadInputData {
    name: String
    count: Int
  }

  type Query {
    getAllEvents: [Event]
    getOneEvent(_id: ID): Event      
  }
  type Mutation {
    createEvent(createEventInput: CreateEventInput): Event
    updateEvent(updateEventInput: UpdateEventInput): Event
    addRoleToSquad(addRoleToSquadInput: AddRoleToSquadInput): Event
    changeRoleInSquad(changeRoleInSquadInput: AddRoleToSquadInput): Event
    deleteRoleFromSquad(deleteRoleFromSquadInput: AddRoleToSquadInput): Event
  }
`;
