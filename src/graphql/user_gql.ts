const { gql } = require('apollo-server-express');
import {
    generateToken, getUser,
    getUsers,
    isEmailUsed,
    isUsernameTaken,
    makeUserAdmin,
    signInUser,
    signUpUser
} from "../db/user_table";
import {PubSub, USER_ADDED, USER_REMOVED} from "./gql";

export const typeDef = gql`
    type User {
        uid: Int!,
        first_name: String!,
        middle_name: String,
        last_name: String!,
        email: String!,
        username: String!,
        phone_number: String,
        interests: [Interest],
        country: String,
        last_location: String
    }

    input IUser {
        first_name: String!,
        middle_name: String,
        last_name: String!,
        email: String!,
        username: String!,
        phone_number: String,
        country: String,
        last_location: String,
        password: String!
    }

    type Token {
        token: String
    }

    extend type Query {
        getUserWithId(uid: Int) : User  # ONLY FOR ADMIN ROLE USERS!
        me: User
        getUser: User   # The same as the above query but more explainatory naming
        getAllUsers(page: Int, range: Int): [User]
        isUserNameTaken(username: String) : Boolean
        isEmailUsed(email: String) : Boolean
    }
    
    extend type Mutation {
        signIn(email: String!, password: String!) : Token
        signUp(new_user: IUser) : Token
        makeUserAdmin(uid: Int) : Boolean
        signOut: Boolean
    }

    type Subscription {
        userAdded: [User]
        userRemoved: [User]
    }
`;

export const resolvers = {
    Query: {
        me: async ( _ , __ , { user }) => { return user.getUser() },
        getUser: async (_ , __ , { user }) => { return user.getUser() },

        isUserNameTaken: async ( _ , { username }) => { return await isUsernameTaken(username) },
        isEmailUsed: async ( _ , { email }) => { return await isEmailUsed(email) },

        getAllUsers: async (_ , __, { user, page, range }) => {
            let userObject = (await user.getUser());
            if (!userObject) throw new Error('You must be authenticated & be an admin to access this');
            if (!userObject.role && userObject.role < 2) throw new Error('You must be an admin');    // These numbers might change
            return await getUsers(page, range);
        },

        getUserWithId: async (_, { uid }, { user }) => {
            if (!await user.getUser()) throw new Error('You must be authenticated to access this');
            let returnableUser = await getUser(uid);
            returnableUser.password_hash = undefined;
            return returnableUser;
        },
    },

    Mutation: {
        makeUserAdmin: async (_, {uid}, {user}) => {
            user = await user.getUser();
            if (!user) throw new Error('You must be authenticated to access this');
            if (user.role < 4) throw new Error('You are not an admin');
            return makeUserAdmin(uid)
        },

        signIn: async (_, {email, password}, {user}) => {
            let token = await signInUser(email, password);
            await user.signInUser(token);
            return {token}
        },

        signUp: async (_, {new_user}, {user}) => {
            let token = await signUpUser(new_user.first_name, new_user.middle_name, new_user.last_name,
                new_user.phone_number, new_user.username, new_user.country, new_user.email, new_user.password);
            const generatedToken = await generateToken(token)
            await user.signInUser(generatedToken);
            return {token: generatedToken}
        },

        signOut: async (_, __, {user}) => {
            return !await user.signOutUser();
        },
    },

    Subscription: {
        userAdded: { subscribe: (_ , __, { user }) => { return PubSub.asyncIterator([USER_ADDED]) } },
        userRemoved: { subscribe: (_ , __, { user }) => { return PubSub.asyncIterator([USER_REMOVED]) } },
    }
};
