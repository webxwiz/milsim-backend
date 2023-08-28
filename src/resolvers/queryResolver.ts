import userService from '../service/userService.js';

const queryResolver = {
    Query: {

        getUserByToken: async (parent: any, args: any, contextValue: { token: string; }) => {
            const user = await userService.getUserByToken(contextValue.token);

            return user;
        },

        getAllUsers: async (parent: any, args: any) => {
            const users = await userService.getAllUsers();

            return users;
        },
    },
};

export { queryResolver };
