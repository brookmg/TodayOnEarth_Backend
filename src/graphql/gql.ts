import {User} from "../model/user";

const { ApolloServer, gql } = require('apollo-server-express');
import {
    getAllPosts, getAllPostsBetweenPublishedDate, getAllPostsBetweenScrapedDate,
    getAllPostsFromProvider,
    getAllPostsFromSource,
    getAllPostsOnPublishedDate, getAllPostsOrdered,
    getAllPostsSincePublishedDate,
    getAllPostsSinceScrapedDate,
    getPostById,
    getPostsCustom,
    getPostWithKeyword
} from '../db/post_table'

import {
    generateToken,
    getUser,
    getUsers, isEmailUsed,
    isUsernameTaken,
    makeUserAdmin,
    signInUser,
    signUpUser,
    verifyUser
} from '../db/user_table';
import {
    addInterestForUser,
    addInterestListForUser, getInterestsForUser,
    muteInterestForUser,
    removeInterestForUser, unMuteOrResetInterestForUser, updateInterestForUser
} from "../db/interest_table";
import {NativeClass} from "../native";

const typeDef = gql`

    type Post {
        postid: Int,
        title: String,
        body: String,
        provider: String,
        source_link: String, 
        published_on: Int,
        scraped_on: Int,
        metadata: Metadata,
        keywords: [Keyword]
    }

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

    type Keyword {
        keyword: String,
        postid: Int
    }

    type Interest {
        interest: String,
        score: Float,
        uid: Int
    }

    input IInterest {
        interest: String!,
        score: Float!
    }

    input UInterest {
        interest: String,
        score: Float!
    }

    type CommunityInteraction {
        views: Int,
        likes: Int,
        replies: Int,
        retweets: Int,
        comments: Int,
        video_views: Int
    }
    
    input FilterQuery {
        title: String,
        body: String,
        provider: String,
        source: String,
        keyword: String,
        published_on: String,
        scraped_on: String,
        metadata: String,

        _title: String,
        _body: String,
        _provider: String,
        _source: String,
        _keyword: String,
        _published_on: String,
        _scraped_on: String,

        connector: String
    }

    type Owner {
        owner_id: Int,
        owner_user_name: String
    }
    
    type AdditionalThumbnails {
        config_height: Int,
        config_width: Int,
        src: String
    }

    type Dimentions {
        width: Int,
        height: Int
    }

    type Audio {
        src: String
    }

    type Image {
        src: String
    }

    interface Metadata {
        community_interaction: CommunityInteraction
    }

    type FacebookMetadata implements Metadata {
        community_interaction: CommunityInteraction
        post: FacebookPost
    }

    type TwitterMetadata implements Metadata {
        community_interaction: CommunityInteraction
        tweet: TwitterPost
    }

    type TelegramMetadata implements Metadata {
        community_interaction: CommunityInteraction
        message: TelegramPost
    }

    type InstagramMetadata implements Metadata {
        community_interaction: CommunityInteraction
        post: InstagramPost
    }

    interface PostElement {
        poster_avatar: String,
        poster_full_name: String,
        poster_user_name: String,
    }

    type FacebookPost implements PostElement {
        poster_avatar: String,
        poster_media_img: String,
        poster_media_metadata: String,
        poster_media_text: String,
        poster_full_name: String,
        poster_user_name: String,
    }

    type TwitterPost implements PostElement {
        poster_avatar: String,
        poster_full_name: String,
        poster_user_name: String,
    }

    type TelegramPost implements PostElement {
        poster_avatar: String,
        poster_full_name: String,
        poster_user_name: String,
        owner: Owner,
        audio: Audio,
        author_name: String,
        image: Image,
    }

    type InstagramPost implements PostElement {
        poster_avatar: String,
        poster_media_img: String,
        poster_media_metadata: String,
        poster_media_text: String,
        poster_full_name: String,
        poster_user_name: String,
        accessibility_caption: String,
        owner: Owner,
        dimensions: Dimentions
        is_video: Boolean
        full_size_image: String,
        additional_thumbnails: [AdditionalThumbnails],
        post_id: Int,
        thumbnail_image: String
    }

    type Query {
        getPosts(page: Int, range: Int, orderBy: String, order: String): [Post]
        getPost(id: Int) : Post
        getPostFromProvider(provider: String, page: Int, range: Int): [Post]
        getPostFromSource(source: String, page: Int, range: Int): [Post]
    
        getPostScrapedSince(time: Int, page: Int, range: Int): [Post]
        getPostFrom(time: Int, page: Int, range: Int): [Post]
        getPostPublishedOn(time: Int, page: Int, range: Int): [Post]
    
        getPostWithKeyword(keyword: String, page: Int, range: Int): [Post]
        getPostCustomized(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String): [Post]
        getAllUsers(page: Int, range: Int): [User]

        getUserWithId(uid: Int) : User  # ONLY FOR ADMIN ROLE USERS!
        me: User
        getUser: User   # The same as the above query but more explainatory naming
        
        isUserNameTaken(username: String) : Boolean
        isEmailUsed(email: String) : Boolean
        
        getInterestsOfUser: [Interest]

        getPostsScrapedBetween(startTime: Int, endTime: Int, page: Int, range: Int, orderBy: String, order: String): [Post]
        getPostsPublishedBetween(startTime: Int, endTime: Int, page: Int, range: Int, orderBy: String, order: String): [Post]
        
        getPostsSortedByCommunityInteraction(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean, workingOn: [String]): [Post]
        
    }

    type Mutation {
        # Auth
        
        signIn(email: String!, password: String!) : Token
        signUp(new_user: IUser) : Token
        makeUserAdmin(uid: Int) : Boolean
        signOut: Boolean
        
        addInterest(interest: IInterest!) : Boolean
        updateInterestList(interests: [IInterest]!) : Boolean
        cleanUpdateInterestList(interests: [IInterest]!) : Boolean
        updateInterest(interest: String!, update: UInterest!) : Boolean
        muteInterest(interest: String!) : Boolean
        unMuteOrResetInterest(interest: String!) : Boolean
        removeInterest(interest: String!) : Boolean
        
    } 

`;

const resolvers = {
    Query: {
        getPostCustomized: async (_ , { jsonQuery, page, range, orderBy, order }) => {
            return await getPostsCustom(jsonQuery, page, range, orderBy, order)
        },
        getPosts: async (_ , {page , range, orderBy, order}) => {
            return await getAllPostsOrdered(page, range, orderBy, order)
        },
        getPost: async (_,{ id }) => {
            return await getPostById(id)
        },
        getPostFromProvider: async (_ , {provider, page, range}) => {
            return await getAllPostsFromProvider(provider, page, range)
        },
        getPostFromSource: async (_, {source, page, range}) => {
            return await getAllPostsFromSource(source, page, range)
        },
        getPostScrapedSince: async (_, {time, page, range}) => {
            return await getAllPostsSinceScrapedDate(time, page, range)
        },
        getPostPublishedOn: async (_, {time, page, range}) => {
            return await getAllPostsOnPublishedDate(time, page, range)
        },
        getPostFrom: async (_, {time, page, range}) => {
            return await getAllPostsSincePublishedDate(time, page, range)
        },
        getPostWithKeyword: async (_, {keyword, page, range}) => {
            return await getPostWithKeyword(keyword, page, range)
        },
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

        me: async ( _ , __ , { user }) => { return user.getUser() },
        getUser: async (_ , __ , { user }) => { return user.getUser() },

        isUserNameTaken: async ( _ , { username }) => { return await isUsernameTaken(username) },
        isEmailUsed: async ( _ , { email }) => { return await isEmailUsed(email) },

        getInterestsOfUser: async ( _ , __ , { user }) => {
            user = await user.getUser();
            if (!user) throw new Error('You must be authenticated to access this');
            return getInterestsForUser(user.uid);
        },

        getPostsScrapedBetween: async (_, {startTime, endTime, page, range}) => {
            return await getAllPostsBetweenScrapedDate(startTime, endTime, page, range)
        },
        getPostsPublishedBetween: async (_, {startTime, endTime, page, range}) => {
            return await getAllPostsBetweenPublishedDate(startTime, endTime, page, range)
        },

        getPostsSortedByCommunityInteraction: async (_, { jsonQuery, page, range, orderBy, order, workingOn }) => {
            let customQueryPosts = await getPostsCustom(jsonQuery , page, range, orderBy , order);
            customQueryPosts.forEach(item => item.keywords = []);

            let value = await NativeClass.sortByCommunityInteraction(
                JSON.stringify(customQueryPosts),
                JSON.stringify(workingOn)
            );

            return JSON.parse(value);
        }

    },

    Metadata: {
        __resolveType(metadata) {
            if (metadata.message) return 'TelegramMetadata';
            else if (metadata.post && metadata.post.additional_thumbnails) return 'InstagramMetadata';
            else if (metadata.post) return 'FacebookMetadata';
            else if (metadata.tweet) return 'TwitterMetadata';
            else return null
        },
    },

    Post: {
        published_on: (incoming) => {
            return new Date(incoming.published_on).getTime() / 1000
        },
        scraped_on: (incoming) => {
            return new Date(incoming.scraped_on).getTime() / 1000   // sec time instead of micro
        }
    },

    Mutation: {

        makeUserAdmin: async (_, { uid }, { user }) => {
            user = await user.getUser();
            if (!user) throw new Error('You must be authenticated to access this');
            if (user.role < 4) throw new Error('You are not an admin');
            return makeUserAdmin(uid)
        },
        signIn: async (_, { email, password }, { user }) => {
            let token = await signInUser(email, password);
            await user.signInUser(token);
            return { token }
        },
        signUp: async (_, { new_user }, {user}) => {
            let token = await signUpUser(new_user.first_name, new_user.middle_name, new_user.last_name,
                new_user.phone_number, new_user.username, new_user.country, new_user.email, new_user.password);
            const generatedToken = await generateToken(token)
            await user.signInUser(generatedToken);
            return { token:  generatedToken}
        },

        signOut: async (_, __, {user}) => {
            return !await user.signOutUser();
        },

        addInterest: async (_ , {interest} , {user}) => {
            let userObj = await user.getUser();
            if (!userObj) throw new Error('You must be authenticated to access this');
            return !!await addInterestForUser(interest.interest , interest.score, userObj.uid);
        },

        updateInterest: async (_ , { interest , update } , {user}) => {
            let userObj = await user.getUser();
            if (!userObj) throw new Error('You must be authenticated to access this');
            return !!await updateInterestForUser(interest , update , userObj.uid);
        },

        updateInterestList: async (_ , {interests} , {user}) => {
            let userObj = await user.getUser();
            if (!userObj) throw new Error('You must be authenticated to access this');
            return addInterestListForUser(interests , userObj.uid)
        },

        cleanUpdateInterestList: async (_ , {interests} , {user}) => {
            let userObj = await user.getUser();
            if (!userObj) throw new Error('You must be authenticated to access this');
            return addInterestListForUser(interests , userObj.uid , true)
        },

        muteInterest: async (_ , {interest} , {user}) => {
            let userObj = await user.getUser();
            if (!userObj) throw new Error('You must be authenticated to access this');
            return !!await muteInterestForUser(interest, userObj.uid)
        },

        unMuteOrResetInterest: async (_ , {interest} , {user}) => {
            let userObj = await user.getUser();
            if (!userObj) throw new Error('You must be authenticated to access this');
            return !!await unMuteOrResetInterestForUser(interest, userObj.uid)
        },

        removeInterest: async (_ , {interest} , {user}) => {
            let userObj = await user.getUser();
            if (!userObj) throw new Error('You must be authenticated to access this');
            return removeInterestForUser(interest , userObj.uid)
        },
    },

};

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

export const server = new ApolloServer({ typeDefs: typeDef , resolvers,
    context: async ({ req, res }) => {
        return {user: new UserHandler(req, res)}
    },
    playground: {
        settings: {
            // include cookies in the requests from the GraphQL playground
            'request.credentials': 'include',
        },
    },
});
