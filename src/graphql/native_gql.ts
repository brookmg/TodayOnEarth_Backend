const { gql } = require('apollo-server-express');
import {getAllPostsBetweenPublishedDate, getPostById, getPostsCustom} from "../db/post_table";
import {NativeClass} from "../native";

export const typeDef = gql`
    type Query {
        getPostsSortedByCommunityInteraction(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean, workingOn: [String]): [Post]
        getPostsSortedByRelativeCommunityInteraction(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean, workingOn: [String]): [Post]
        getPostsSortedByCustomKeywords(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean, keywords: [String]): [Post]
        getPostsSortedByTrendingKeyword(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean): [Post]
        getPostTopics(postId: Int, semantics: Boolean) : [Interest]
        getTodaysTrendingKeywords(semantics: Boolean, page: Int, range: Int) : [Interest]
    }
`;

export const resolvers = {
    Query: {
        getPostsSortedByCommunityInteraction: async (_, { jsonQuery, page, range, orderBy, order, workingOn }) => {
            let customQueryPosts = await getPostsCustom(jsonQuery , page, range, orderBy , order);
            customQueryPosts.forEach(item => item.keywords = []);

            let value = await NativeClass.sortByCommunityInteraction(
                JSON.stringify(customQueryPosts),
                JSON.stringify(workingOn)
            );

            return JSON.parse(value);
        },

        getPostsSortedByRelativeCommunityInteraction: async (_, { jsonQuery, page, range, orderBy, order, workingOn }) => {
            let customQueryPosts = await getPostsCustom(jsonQuery , page, range, orderBy , order);
            customQueryPosts.forEach(item => item.keywords = []);

            return JSON.parse(await NativeClass.sortByRelativeCommunityInteraction(
                JSON.stringify(customQueryPosts),
                JSON.stringify(workingOn)
            ));
        },

        getPostsSortedByCustomKeywords: async (_, { jsonQuery, page, range, orderBy, order, semantics, keywords }) => {
            let customQueryPosts = await getPostsCustom(jsonQuery , page, range, orderBy , order);
            customQueryPosts.forEach(item => item.keywords = []);
            let fakeInterests = [];
            keywords.forEach(keyword => fakeInterests.push([ keyword , 0.5 ]));

            return JSON.parse(await NativeClass.sortByUserInterest(
                JSON.stringify(customQueryPosts),
                JSON.stringify(fakeInterests),
                semantics
            ));
        },
        getPostsSortedByTrendingKeyword: async (_, { jsonQuery, page, range, orderBy, order, semantics }) => {
            let customQueryPosts = await getPostsCustom(jsonQuery , page, range, orderBy , order);
            customQueryPosts.forEach(item => item.keywords = []);

            return JSON.parse(await NativeClass.sortByTrendingKeyword(
                JSON.stringify(customQueryPosts),
                semantics
            ));
        },
        getPostTopics: async (_ , { postId, semantics }) => {
            let post = await getPostById(postId);
            if (!post) throw new Error(`Post doesn't exist`);
            let keywords =  JSON.parse(await NativeClass.getKeywordFrequency(JSON.stringify(post), semantics));
            let returnable = [];
            keywords.forEach(item => returnable.push({
                interest: item[0],
                score: item[1]
            }));
            return returnable;
        },
        getTodaysTrendingKeywords: async (_ , { semantics, page, range }) => {
            let posts = await getAllPostsBetweenPublishedDate(
                (new Date().getTime() - (24 * 60 * 60 * 1000)) / 1000,
                new Date().getTime() / 1000,
                page, range
            );

            if (posts.length == 0) throw new Error('No post were found in the time period');
            if (posts.length < 2) throw new Error('This method needs at least 2 posts to function');

            let returnable = [];
            let keywords = JSON.parse(await NativeClass.findKeywordListForPosts(JSON.stringify(posts) , semantics));
            keywords.forEach(item => returnable.push({
                interest: item[0],
                score: item[1]
            }));
            return returnable;
        }
    }
};
