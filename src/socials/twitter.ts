import {getTokensForUser} from "../db/token_table";
const Twitter = require('twitter');

const dotenv = require('dotenv');
dotenv.config();

export async function postTweet(tweet: object, uid: number) {
    let [accessToken, accessTokenSecret] = (<any>await getTokensForUser(uid))[0].twitter.split("|||");

    if (!accessToken || !accessTokenSecret) throw new Error(`User doesn't have active linked twitter account`);
    let T = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_ID,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: accessToken,
        access_token_secret: accessTokenSecret
    });

    return T.post('statuses/update', tweet);
}
