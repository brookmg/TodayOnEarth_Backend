const { ApolloServer, gql } = require('apollo-server');
import { getAllPosts, getPostById, getAllPostsFromProvider, getAllPostsFromSource, getAllPostsSinceScrapedDate, getAllPostsOnPublishedDate, getAllPostsSincePublishedDate} from '../db/post_table'

const typeDef = gql`

    type Post {
        postid: Int,
        title: String,
        body: String,
        provider: String,
        source_link: String, 
        published_on: Int,
        scraped_on: Int,
        metadata: Metadata
    }

    type Query {
        getPosts: [Post]
    }

    type CommunityInteraction {
        view: Int,
        likes: Int,
        replies: Int,
        retweets: Int,
        comments: Int,
        video_views: Int
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
        getPost(id: Int) : Post
        getPostFromProvider(provider: String): [Post]
        getPostFromSource(source: String): [Post]

        getPostScrapedSince(time: Int): [Post]
        getPostFrom(time: Int): [Post]
        getPostPublishedOn(time: Int): [Post]
    } 

`;

const resolvers = {
    Query: {
        getPosts: async () => {
            let posts = await getAllPosts()
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
        getPost: async (_,{ id }) => {
            let posts = await getPostById(id);
            return posts
        },
        getPostFromProvider: async (_ , {provider}) => {
            let posts = await getAllPostsFromProvider(provider)
            return posts
        },
        getPostFromSource: async (_, {source}) => {
            let posts = await getAllPostsFromSource(source)
            return posts
        },
        getPostScrapedSince: async (_, {time}) => {
            let posts = await getAllPostsSinceScrapedDate(time)
            return posts
        },
        getPostPublishedOn: async (_, {time}) => {
            let posts = await getAllPostsOnPublishedDate(time)
            return posts
        },
        getPostFrom: async (_, {time}) => {
            let posts = await getAllPostsSincePublishedDate(time)
            return posts
        }
    }

}

export function startGQLServer() {
    const server = new ApolloServer({ typeDefs: typeDef , resolvers });
    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
}