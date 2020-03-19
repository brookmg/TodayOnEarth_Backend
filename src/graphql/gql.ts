const { ApolloServer } = require('apollo-server-express');
const Redis = require('ioredis');
import { merge } from 'lodash';
import { verifyUser } from '../db/user_table';

import { typeDef as UserType , resolvers as UserResolver } from "./user_gql";
import { typeDef as PostType , resolvers as PostResolver } from "./post_gql";
import { typeDef as InterestType , resolvers as InterestResolver } from "./interest_gql";
import { typeDef as NativeType , resolvers as NativeResolver } from "./native_gql";
import { typeDef as ProviderType , resolvers as ProviderResolver } from "./provider_gql";
import { typeDef as SocialsType , resolvers as SocialsResolver } from "./socials_gql";

import {RedisPubSub} from "graphql-redis-subscriptions";
const cookie = require('cookie');

const redisurl = process.env.REDIS_URL;

export const PubSub = new RedisPubSub({
    publisher: new Redis(redisurl),
    subscriber: new Redis(redisurl)
});

export const [ POST_ADDED, POST_REMOVED, USER_ADDED, USER_REMOVED ] = [ "post_added" , "post_removed", "user_added", "user_removed" ];

export class UserHandler {
    req;
    res;

    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async signOutUser() {
       await this.res.clearCookie('userId');
    }

    async signInUser(token) {
        let time = new Date().getTime() + (process.env.USER_SESSION_EXPIRES_AFTER);   // one week
        const cookieOptions = { httpOnly: false, expires: new Date(time) };
        this.res.cookie('userId', token, cookieOptions);
    }

    async getUser() {
        let token = this.req.headers.authorization;

        if (!token && this.req.cookies) token = this.req.cookies.userId || '';

        if (token) return await verifyUser(token);
        else return null
    }
}

async function getCookieFromWebSocket(webSocket): Promise<any> {
    return new Promise((resolve , reject) => resolve(cookie.parse(webSocket.upgradeReq.headers.cookie)));
}

export const server = new ApolloServer({
    typeDefs: [ UserType , PostType , InterestType , NativeType , SocialsType , ProviderType] ,
    resolvers: merge(UserResolver, PostResolver, InterestResolver, NativeResolver, SocialsResolver, ProviderResolver),
    subscriptions: {
        onConnect: async (connectionParams, webSocket) => {
            if (connectionParams.authToken) {
                return { currentUser: await verifyUser(connectionParams.authToken) }
            } else {
                try {
                    const cookies = await getCookieFromWebSocket(webSocket);
                    if (cookies.userId) return {currentUser: await verifyUser(cookies.userId)};
                } catch (e) {
                    throw new Error(`You must be signed in. more_info: ${e}`)
                }
            }
        }
    },
    context: async ({ req, res, connection }) => {
        if (!req || !req.headers) return connection.context;
        else return {user: new UserHandler(req, res)}
    },
    playground: {
        settings: {
            // include cookies in the requests from the GraphQL playground
            'request.credentials': 'include',
        },
    },
});
