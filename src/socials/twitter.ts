import {getTokensForUser} from "../db/token_table";

const Twitter = require('twitter');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

async function pushMedia(t: any, media: Buffer) : Promise<string> {
    return (await t.post('media/upload', {media: media})).media_id_string;
}

export async function postTweet(tweet: any, medias: string[], uid: number) {
    let [accessToken, accessTokenSecret] = (<any>await getTokensForUser(uid))[0].twitter.split("|||");

    if (!accessToken || !accessTokenSecret) throw new Error(`User doesn't have active linked twitter account`);
    let T = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_ID,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: accessToken,
        access_token_secret: accessTokenSecret
    });

    if (medias.length > 0) {
        let mediaBuffers = medias.map(media => fs.readFileSync(media));
        tweet.media_ids = (await Promise.all(mediaBuffers.map(
            mediaBuffer => {
                return pushMedia(T, mediaBuffer);
            }
        ))).reduce((i , j) => `${i},${j}`);
    }

    return T.post('statuses/update', tweet);
}
