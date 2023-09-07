export const userTypeDefs = `#graphql
  scalar Date
  type User {
      _id: ID!
      discordId: String!             
      role: String!
      createdAt: Date                    
  }
  type UserWithToken {
      user: User        
      token: String             
  }
  type UserDeleteResponse {        
      userStatus: UserDeleteStatus
      message: String
  }
  type UserDeleteStatus { 
      acknowledged: Boolean
      deletedCount: Int
  }

  type Query {
    getUserByToken: User
    getAllUsers: [User]    
  }
  type Mutation {
    saveUser(discordId: String!): UserWithToken
    deleteUser(discordId: String!): UserDeleteResponse
  }
`;
