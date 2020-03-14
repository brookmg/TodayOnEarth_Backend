const { gql, withFilter } = require('apollo-server-express');
import {POST_ADDED, POST_REMOVED, PubSub} from "./gql";
import {Interest} from "../model/interest";
import {Post} from "../model/post";
import {NativeClass} from "../native";
import {
    activationFunction,
    addInterestForUser,
    changeInterestScoreForUser,
    getInterestsForUser
} from "../db/interest_table";
import {
    getAllPostsBetweenPublishedDate,
    getAllPostsBetweenScrapedDate,
    getAllPostsFromProvider,
    getAllPostsFromSource, getAllPostsOnPublishedDate,
    getAllPostsOrdered, getAllPostsSincePublishedDate, getAllPostsSinceScrapedDate,
    getPostById,
    getPostsCustom, getPostWithKeyword
} from "../db/post_table";

export const typeDef = gql`
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

    type Keyword {
        keyword: String,
        postid: Int
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
    
    extend type Query {
        getPosts(page: Int, range: Int, orderBy: String, order: String): [Post]
        getPost(id: Int) : Post
        getPostFromProvider(provider: String, page: Int, range: Int): [Post]
        getPostFromSource(source: String, page: Int, range: Int): [Post]

        getPostScrapedSince(time: Int, page: Int, range: Int): [Post]
        getPostFrom(time: Int, page: Int, range: Int): [Post]
        getPostPublishedOn(time: Int, page: Int, range: Int): [Post]

        getPostWithKeyword(keyword: String, page: Int, range: Int): [Post]
        getPostCustomized(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String): [Post]

        getPostsScrapedBetween(startTime: Int, endTime: Int, page: Int, range: Int, orderBy: String, order: String): [Post]
        getPostsPublishedBetween(startTime: Int, endTime: Int, page: Int, range: Int, orderBy: String, order: String): [Post]    
    }
    
    extend type Mutation { 
        postOpened(postId: Int): Boolean,
        postLiked(postId: Int): Boolean,
        postDisLiked(postId: Int): Boolean,
        postUnLiked(postId: Int): Boolean,
        postImpressionReceived(postId: Int, ms: Int) : Boolean 
    }
    
    extend type Subscription {
        postAdded: [Post]
        postRemoved: [Post]
    }
    
`;

export function getVectorPairFromInterests(interests: Interest[]) {
    const returnable = [];
    interests.forEach(interest => returnable.push([ interest.interest , interest.score ]));
    return returnable;
}

function filterFn(actualPayload , variables , { currentUser }) {
    actualPayload.forEach((item: Post) => item.keywords = []);
    const vector = getVectorPairFromInterests(currentUser.interests);

    const interestScore = JSON.parse(
        NativeClass.sortByUserInterest(
            JSON.stringify([actualPayload[0]]),
            JSON.stringify(vector),
            false
        )
    );

    return activationFunction(interestScore[0].score_interest_total) > 0.5;
}

export const resolvers = {
    Subscription: {
        postAdded: {
            subscribe: withFilter(
                () => PubSub.asyncIterator(POST_ADDED),
                (payload , variables , context) => filterFn(payload.postAdded, variables, context))
        },
        postRemoved: {
            subscribe: withFilter(
                () => PubSub.asyncIterator(POST_REMOVED),
                (payload , variables , context) => filterFn(payload.postRemoved, variables, context))
        },
    },

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
        getPostsScrapedBetween: async (_, {startTime, endTime, page, range}) => {
            return await getAllPostsBetweenScrapedDate(startTime, endTime, page, range)
        },
        getPostsPublishedBetween: async (_, {startTime, endTime, page, range}) => {
            return await getAllPostsBetweenPublishedDate(startTime, endTime, page, range)
        },
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
        postOpened: async (_ , {postId} , { user }) => {
            // Get keywords from the post.
            // Add the keywords as interests for user if they don't exist
            // If it exists, increment the value of interest by values defined in .env
            user = await user.getUser();
            if (!user) throw new Error('You must be authenticated to access this');

            let interestsRow = (await getInterestsForUser(user.uid));
            let keywordsFromPost = JSON.parse(await NativeClass.getKeywordFrequency(
                JSON.stringify(await getPostById(postId)),
                false
            ));

            let keywords = keywordsFromPost.map(k => k[0]);
            let interests = interestsRow.map(i => i.interest);
            interests.forEach(i => { i = i.toLowerCase(); });
            console.log(interests);

            keywords.forEach(keyword => {
                if (interests.includes(keyword.toLowerCase())) {
                    let score = interestsRow.find(item => item.interest === keyword).score;

                    if (!score) {
                        throw new Error(`Problem setting score for ${keyword}`);
                    } else return changeInterestScoreForUser(keyword, (score + (score / Number(process.env.POST_OPENED_MUTATION_VALUE))), user.uid)
                } else {
                    console.log(`adding keyword ${keyword}`);
                    return addInterestForUser(keyword , Number(process.env.POST_OPENED_MUTATION_VALUE), user.uid)
                }
            });

        },
        postLiked: async (_ , {postId} , { user }) => { // If the user clicked on the 👍🏾 button
            user = await user.getUser();
            if (!user) throw new Error('You must be authenticated to access this');

            let interestsRow = (await getInterestsForUser(user.uid));
            let keywordsFromPost = JSON.parse(await NativeClass.getKeywordFrequency(
                JSON.stringify(await getPostById(postId)),
                false
            ));

            let keywords = keywordsFromPost.map(k => k[0]);
            let interests = interestsRow.map(i => i.interest);
            interests.forEach(i => i.toLowerCase());
            console.log(interests);

            keywords.forEach(keyword => {
                if (interests.includes(keyword.toLowerCase())) {
                    let score = interestsRow.find(item => item.interest === keyword).score;

                    if (!score) {
                        throw new Error(`Problem setting score for ${keyword}`);
                    } else return changeInterestScoreForUser(keyword, (score + (score / Number(process.env.POST_LIKED_MUTATION_VALUE))), user.uid)
                } else {
                    console.log(`adding keyword ${keyword}`);
                    return addInterestForUser(keyword , Number(process.env.POST_LIKED_MUTATION_VALUE), user.uid)
                }
            });

        },
        postUnLiked: async (_ , {postId} , { user }) => { // If the user clicked on the 👍🏾 button twice
            user = await user.getUser();
            if (!user) throw new Error('You must be authenticated to access this');

            let interestsRow = (await getInterestsForUser(user.uid));
            let keywordsFromPost = JSON.parse(await NativeClass.getKeywordFrequency(
                JSON.stringify(await getPostById(postId)),
                false
            ));

            let keywords = keywordsFromPost.map(k => k[0]);
            let interests = interestsRow.map(i => i.interest);
            interests.forEach(i => i.toLowerCase());
            console.log(interests);

            keywords.forEach(keyword => {
                if (interests.includes(keyword.toLowerCase())) {
                    let score = interestsRow.find(item => item.interest === keyword).score;

                    if (!score) {
                        throw new Error(`Problem setting score for ${keyword}`);
                    } else return changeInterestScoreForUser(keyword, (score + (score * Number(process.env.POST_LIKED_MUTATION_VALUE))), user.uid)
                }
            });
        },
        postDisLiked: async (_ , {postId} , { user }) => {    // If the user clicked on the 👎🏾 button
            user = await user.getUser();
            if (!user) throw new Error('You must be authenticated to access this');

            let interestsRow = (await getInterestsForUser(user.uid));
            let keywordsFromPost = JSON.parse(await NativeClass.getKeywordFrequency(
                JSON.stringify(await getPostById(postId)),
                false
            ));

            let keywords = keywordsFromPost.map(k => k[0]);
            let interests = interestsRow.map(i => i.interest);
            interests.forEach(i => i.toLowerCase());
            console.log(interests);

            keywords.forEach(keyword => {
                if (interests.includes(keyword.toLowerCase())) {
                    let score = interestsRow.find(item => item.interest === keyword).score;

                    if (!score) {
                        throw new Error(`Problem setting score for ${keyword}`);
                    } else return changeInterestScoreForUser(keyword, (score + (score / Number(process.env.POST_DISLIKED_MUTATION_VALUE))), user.uid)
                } else {
                    console.log(`adding keyword ${keyword}`);
                    return addInterestForUser(keyword , Number(process.env.POST_DISLIKED_MUTATION_VALUE), user.uid)
                        .catch(err => console.error(err));
                }
            });

        },
        postImpressionReceived: async (_ , { postId, ms } , { user }) => {
            user = await user.getUser();
            if (!user) throw new Error('You must be authenticated to access this');

            let interestsRow = (await getInterestsForUser(user.uid));
            let keywordsFromPost = JSON.parse(await NativeClass.getKeywordFrequency(
                JSON.stringify(await getPostById(postId)),
                false
            ));

            let keywords = keywordsFromPost.map(k => k[0]);
            let interests = interestsRow.map(i => i.interest);
            interests.forEach(i => i.toLowerCase());
            console.log(interests);

            keywords.forEach(keyword => {
                if (interests.includes(keyword.toLowerCase())) {
                    let score = interestsRow.find(item => item.interest === keyword).score;

                    if (!score) {
                        throw new Error(`Problem setting score for ${keyword}`);
                    } else return changeInterestScoreForUser(keyword, (score + (score / (Number(process.env.POST_IMPRESSION_PER_MS_MUTATION_VALUE) * ms))), user.uid)
                } else {
                    console.log(`adding keyword ${keyword}`);
                    return addInterestForUser(keyword , Number(process.env.POST_IMPRESSION_PER_MS_MUTATION_VALUE) * ms, user.uid)
                }
            });

        }
    }

};
