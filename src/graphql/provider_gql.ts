import {
    deleteProviderItem,
    getProviders,
    getProvidersForUser,
    insertProvider,
    updateProviderOfUser
} from "../db/provider_table";
import {Provider} from "../model/provider";

const { gql } = require('apollo-server-express');

export const typeDef = gql`

    type Provider {
        provider_id: Int,
        provider: String,
        source: String,
        added_on: Int,
        uid: Int,
        frequency: String
    }

    input IProvider {
        provider: String!,
        source: String!,
        frequency: String!
    }
    
    extend type Query {
        getProviders: [Provider]
        getProvidersForUser: [Provider]
    }
    
    extend type Mutation {
        addProvider(provider: IProvider) : Provider
        removeProvider(provider: IProvider) : Boolean
        updateProvider(update: IProvider, provider: String! , source: String!) : Provider
    }
`;

export const resolvers = {
    Query: {
        getProviders: async () => { return getProviders() },
        getProvidersForUser: async (_ , __ , { user }) => {
            if (!await user.getUser()) throw new Error('You must be authenticated to access this');
            return getProvidersForUser((await user.getUser()).uid);
        }
    },

    Mutation: {
        addProvider: async (_, { provider } , {user}) => {
            if (!await user.getUser()) throw new Error('You must be authenticated to access this');
            let provider_item : Provider = provider;
            provider_item.uid = (await user.getUser()).uid;
            provider_item.added_on = new Date().toUTCString();
            return (await insertProvider(provider_item)).toJSON()
        },

        removeProvider: async ( _, { provider } , { user }) => {
            if (!await user.getUser()) throw new Error('You must be authenticated to access this');
            provider.uid = (await user.getUser()).uid;
            return (await deleteProviderItem(provider)) > 0;
        },

        updateProvider: async ( _, { update, provider, source } , { user }) => {
            if (!await user.getUser()) throw new Error('You must be authenticated to access this');
            return (await updateProviderOfUser(update , provider , source, (await user.getUser()).uid)).toJSON()
        },
    }
};
