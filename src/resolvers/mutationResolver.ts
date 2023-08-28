import userService from '../service/userService.js';

const mutationResolver = {
    Mutation: {
        saveUser: async (parent: any, { email }: { email: string }) => {
            const user = await userService.saveUser(email);

            return {
                user,                
                message: `User ${user.email} successfully saved`,
            };
        },

        deleteUser: async (parent: any, { email }: { email: string }, contextValue: { token: string; }) => {
            const userStatus = await userService.deleteUser(email, contextValue.token);

            return {
                userStatus,
                message: 'User successfully deleted'
            };
        },        
    }
};

export { mutationResolver };
