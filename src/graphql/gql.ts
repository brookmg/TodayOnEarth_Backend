const { ApolloServer, gql } = require('apollo-server');
import { getAllPosts } from '../db/post_table'

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

`;

const resolvers = {
    Query: {
        getPosts: async () => {
            let posts = await getAllPosts()
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