import {getProviders, getProvidersForUser} from "../db/provider_table";

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
    
`;

export const resolvers = {
    Query: {
        getProviders: async () => { return getProviders() },
        getProvidersForUser: async (_ , __ , { user }) => {
            if (!await user.getUser()) throw new Error('You must be authenticated to access this');
            return getProvidersForUser((await user.getUser()).uid);
        }
    },
}
