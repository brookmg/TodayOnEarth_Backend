const { ApolloServer, gql } = require('apollo-server');
import { getAllPosts, getPostById, getAllPostsFromProvider, getAllPostsFromSource} from '../db/post_table'

const typeDef = gql`

    type Post {
        postid: Int,
        title: String,
        body: String,
        provider: String,
        source_link: String, 
        published_on: Int,
        scraped_on: Int,
        metadata: String
    }

    type Query {
        getPosts: [Post]
    }

    type Mutation {
        getPost(id: Int) : Post
        getPostFromProvider(provider: String): [Post]
        getPostFromSource(source: String): [Post]
    } 

`;

const resolvers = {
    Query: {
        getPosts: async () => {
            let posts = await getAllPosts()
            return posts
        }
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
        }
    }

}

export function startGQLServer() {
    const server = new ApolloServer({ typeDefs: typeDef , resolvers });
    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
}