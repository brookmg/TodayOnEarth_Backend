const { ApolloServer, gql } = require('apollo-server');
import { getAllPosts, getPostById, getAllPostsFromProvider,
    getAllPostsFromSource, getAllPostsSinceScrapedDate, getAllPostsOnPublishedDate,
    getAllPostsSincePublishedDate, getPostWithKeyword, getPostsCustom } from '../db/post_table'

import { signInUser, signUpUser, verifyUser, getUser } from '../db/user_table';

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

    type Query {
        getPosts: [Post]
        getPost(id: Int) : Post
        getPostFromProvider(provider: String): [Post]
        getPostFromSource(source: String): [Post]

        getPostScrapedSince(time: Int): [Post]
        getPostFrom(time: Int): [Post]
        getPostPublishedOn(time: Int): [Post]

        getPostWithKeyword(keyword: String): [Post]
        getPostCustomized(jsonQuery: [FilterQuery!]!): [Post]

        getPostsWithANDConnector(
            title: String,
            body: String,
            provider: String,
            source_link: String, 
            published_on: Int,
            scraped_on: Int,
        ) : [Post]

        getPostsWithORConnector(
            title: String,
            body: String,
            provider: String,
            source_link: String, 
            published_on: Int,
            scraped_on: Int,
        ) : [Post]
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

    type Mutation {
        # Auth

        getUserWithId(uid: Int) : User  # ONLY FOR ADMIN ROLE USERS!
        signIn(email: String!, password: String!) : Token
        signUp(new_user: IUser) : Boolean

    } 

`;

const resolvers = {
    Query: {
        getPostCustomized: async (_ , { jsonQuery }) => {
            let posts = getPostsCustom(jsonQuery);
            return posts
        },
        getPostsWithANDConnector: async (_ , query) => {
            
        },
        getPostsWithORConnector: async (_ , query) => {

        },
        getPosts: async () => {
            let posts = await getAllPosts();
            return posts
        },
        getPost: async (_,{ id }) => {
            let posts = await getPostById(id);
            return posts
        },
        getPostFromProvider: async (_ , {provider}) => {
            let posts = await getAllPostsFromProvider(provider);
            return posts
        },
        getPostFromSource: async (_, {source}) => {
            let posts = await getAllPostsFromSource(source);
            return posts
        },
        getPostScrapedSince: async (_, {time}) => {
            let posts = await getAllPostsSinceScrapedDate(time);
            return posts
        },
        getPostPublishedOn: async (_, {time}) => {
            let posts = await getAllPostsOnPublishedDate(time);
            return posts
        },
        getPostFrom: async (_, {time}) => {
            let posts = await getAllPostsSincePublishedDate(time);
            return posts
        },
        getPostWithKeyword: async (_, {keyword}) => {
            let posts = await getPostWithKeyword(keyword);
            return posts
        }
    },

    Metadata: {
        __resolveType(metadata, context, info) {
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
        },
        // metadata: (incoming) => {
        //     return JSON.stringify(incoming.metadata)
        // }
    },

    Mutation: {
        getUserWithId: async (_, { uid }, { user }) => {
            console.log(user)
            if (!user) throw new Error('You must be authenticated to access this')
            return getUser(uid)
        },
        signIn: async (_, { email, password }) => {
            let token = await signInUser(email, password)
            return { token }
        },
        signUp: async (_, { new_user }) => {
            let token = await signUpUser(new_user.first_name, new_user.middle_name, new_user.last_name, 
                new_user.phone_number, new_user.username, new_user.country, new_user.email, new_user.password)
           return token ? true : false
        },
        
    },

};

export function startGQLServer() {
    const server = new ApolloServer({ typeDefs: typeDef , resolvers, context: async ({ req }) => {
            const token = req.headers.authorization || '';
            if (token) {
                const user = await verifyUser(token);
                return { user };
            } else return { user: null }
        }
    });
    
    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
}