import {getInterestsForUser} from "../db/interest_table";

const { gql } = require('apollo-server-express');
import {getAllPostsBetweenPublishedDate, getPostById, getPostsCustom} from "../db/post_table";
import {NativeClass} from "../native";
import {getVectorPairFromInterests} from "./post_gql";

export const typeDef = gql`
    extend type Post {
        interests: [Interest]
    }
    
    type Query {
        getPostsSortedByCommunityInteraction(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean, workingOn: [String]): [Post]
        getPostsSortedByRelativeCommunityInteraction(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean, workingOn: [String]): [Post]
        getPostsSortedByCustomKeywords(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean, keywords: [String]): [Post]
        getPostsSortedByTrendingKeyword(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean): [Post]
        getPostTopics(postId: Int, semantics: Boolean) : [Interest]
        getTodaysTrendingKeywords(semantics: Boolean, page: Int, range: Int) : [Interest]
        getPostRelevance(postId: Int!, keywords: [String]!, semantics: Boolean) : [Interest]
        getPostRelevancePerUserInterests(postId: Int!, semantics: Boolean) : [Interest]
        getPostsSortedByUserInterest(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean): [Post]
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
        },
        getPostsSortedByUserInterest: async (_, { jsonQuery, page, range, orderBy, order, semantics }, { user }) => {
            let userObject = (await user.getUser());
            if (!userObject) throw new Error('You must be authenticated & be an admin to access this');

            let customQueryPosts = await getPostsCustom(jsonQuery , page, range, orderBy , order);
            customQueryPosts.forEach(item => item.keywords = []);
            let interestRaw = await getInterestsForUser(userObject.uid);
            if (!interestRaw) throw new Error('User has no interests');

            let interests = getVectorPairFromInterests(interestRaw);
            let postsPre = JSON.parse(await NativeClass.sortByUserInterest(
                JSON.stringify(customQueryPosts),
                JSON.stringify(interests),
                semantics
            ));

            postsPre.forEach(post => {
                let interestComputations = [];
                interestRaw.forEach(interest => {
                    interestComputations.push({
                        interest: interest.interest,
                        score: post[`score_interest_:${interest.interest}`]
                    })
                });
                post.interests = interestComputations;
            });

            return postsPre;

        },
        getPostRelevance: async (_ , { postId, keywords , semantics}) => {
            let post = await getPostById(postId);
            if (!post) throw new Error('Post is not found or available');

            let fakeInterests = [];
            keywords.forEach(keyword => fakeInterests.push([ keyword , 0.5 ]));

            let postComputations = JSON.parse(await NativeClass.sortByUserInterest(
                JSON.stringify([post]),
                JSON.stringify(fakeInterests),
                semantics
            ));

            let interestComputations = [];
            keywords.forEach(keyword => {
                interestComputations.push({
                    interest: keyword,
                    score: postComputations[0][`score_interest_:${keyword}`]
                })
            });

            return interestComputations;
        },
        getPostRelevancePerUserInterests: async (_ , { postId, semantics}, { user }) => {
            let userObject = (await user.getUser());
            if (!userObject) throw new Error('You must be authenticated & be an admin to access this');

            let post = await getPostById(postId);
            if (!post) throw new Error('Post is not found or available');

            let fakeInterests = [];
            let keywords = await getInterestsForUser(userObject.uid);
            keywords.forEach(keyword => fakeInterests.push([ keyword.interest , keyword.score ]));

            let postComputations = JSON.parse(await NativeClass.sortByUserInterest(
                JSON.stringify([post]),
                JSON.stringify(fakeInterests),
                semantics
            ));

            let interestComputations = [];
            keywords.forEach(keyword => {
                interestComputations.push({
                    interest: keyword.interest,
                    score: postComputations[0][`score_interest_:${keyword.interest}`]
                })
            });

            return interestComputations;
        }
    }
};
