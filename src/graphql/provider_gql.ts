import {
    addProviderListForUser,
    deleteProviderItem,
    getProviders,
    getProvidersForUser,
    insertProvider,
    updateProviderOfUser
} from "../db/provider_table";
import {Provider} from "../model/provider";
import {
    getAllPosts, getAllPostsOnPublishedDate,
    getAllPostsSincePublishedDate,
    getAllPostsSinceScrapedDate,
    getPostsCustom
} from "../db/post_table";

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
    
    extend type User {
        providers: [Provider]
    }

    input ProviderQuery {
        provider: String,
        source: String,
        
        _provider: String,
        _source: String,
        
        connector: String
    }
    
    extend type Query {
        getProviders(filters: [ProviderQuery]!, page: Int, range: Int, order: String, orderBy: String): [Provider]
        getProvidersForUser: [Provider]
        getPostsForUser(page: Int, range: Int, fruitPunch: Boolean, fruitLimit: Int): [Post]
        getPostScrapedSinceForUser(time: Int, page: Int, range: Int): [Post]
        getPostFromForUser(time: Int, page: Int, range: Int): [Post]
        getPostPublishedOnForUser(time: Int, page: Int, range: Int): [Post]
        getPostCustomizedForUser(jsonQuery: [FilterQuery!]!, page: Int, range: Int): [Post]
    }
    
    extend type Mutation {
        addProvider(provider: IProvider) : Provider
        addProviderList(providers: [IProvider]) : Boolean
        removeProvider(provider: IProvider) : Boolean
        updateProvider(provider: String! , source: String!, update: IProvider) : Provider
        cleanUpdateProviderList(providers: [IProvider]!) : Boolean
    }
`;

export const resolvers = {
    Query: {
        getProviders: async (_ , { filters , page , range , order , orderBy}) => {
            return getProviders(filters, page, range, orderBy, order)
        },
        getProvidersForUser: async (_ , __ , { user }) => {
            if (!await user.getUser()) throw new Error('You must be authenticated to access this');
            return getProvidersForUser((await user.getUser()).uid);
        },
        getPostsForUser: async ( _ , { page , range , fruitPunch , fruitLimit } , { user }) => {
            if (!await user.getUser()) throw new Error('You must be authenticated to access this');
            return await getAllPosts(page , range , (await user.getUser()).uid, fruitPunch , fruitLimit)
        },
        getPostCustomizedForUser: async (_ , { jsonQuery, page , range }, { user }) => {
            if (!await user.getUser()) throw new Error('You must be authenticated to access this');
            return await getPostsCustom(jsonQuery, page, range, (await user.getUser()).uid)
        },
        getPostScrapedSinceForUser: async (_, {time, page, range} , { user }) => {
            if (!await user.getUser()) throw new Error('You must be authenticated to access this');
            return await getAllPostsSinceScrapedDate(time, page, range , (await user.getUser()).uid)
        },
        getPostPublishedOnForUser: async (_, {time, page, range} , { user }) => {
            if (!await user.getUser()) throw new Error('You must be authenticated to access this');
            return await getAllPostsOnPublishedDate(time, page, range , (await user.getUser()).uid)
        },
        getPostFromForUser: async (_, {time, page, range} , { user }) => {
            if (!await user.getUser()) throw new Error('You must be authenticated to access this');
            return await getAllPostsSincePublishedDate(time, page, range, (await user.getUser()).uid)
        },

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

        addProviderList: async ( _ , { providers } , { user }) => {
            if (!await user.getUser()) throw new Error('You must be authenticated to access this');
            let uid = (await user.getUser()).uid;
            //providers.forEach(provider => provider.uid = uid);
            return addProviderListForUser(providers, uid , false)
        },

        cleanUpdateProviderList: async ( _ , { providers } , { user }) => {
            if (!await user.getUser()) throw new Error('You must be authenticated to access this');
            let uid = (await user.getUser()).uid;
            //providers.forEach(provider => provider.uid = uid);
            return addProviderListForUser(providers, uid , true)
        },
    }
};
