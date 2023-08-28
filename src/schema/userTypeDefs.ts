export const userTypeDefs = `#graphql
  scalar Date
  type User {
      _id: ID!
      email: String!             
      role: String!
      createdAt: Date                    
  }
  type UserWithToken {
      user: User        
      token: String
      message: String              
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
    saveUser(email: String!): User
    deleteUser(email: String!): UserDeleteResponse
  }
`;
