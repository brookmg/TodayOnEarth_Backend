import PostFetcherBase from './PostFetcherBase';
import utils from "../utils"
const cheerio = require('cheerio')

export default class TwitterFetcher extends PostFetcherBase {

    // TODO: remove this later and replace with internet data
    getPageContentFromSampleData = () => {
        const fs = require('fs');
        const contents = fs.readFileSync("./src/PostFetchers/sampleData/twitter.html", 'utf8');

        return contents
    }


    getPosts = async () => {
        const url = `https://twitter.com/${this.source}`;
        const response = await this.downloadWebPage({ url });

        const webpageContent = response.data
        // const webpageContent = this.getPageContentFromSampleData();


        const $ = cheerio.load(webpageContent);

        let posts = []

        $(".content").each((i, e) => {
            const tweetTextDirty = $(e).find(".tweet-text").text();
            const tweetPosterFullName = $(e).find(".fullname").text()
            const tweetPosterUserName = $(e).find(".username").text()
            const tweetPosterAvatar = $(e).find("img.avatar").attr('src')
            const tweetTime = $(e).find("._timestamp").attr('data-time-ms')
            const tweetSource = `https://twitter.com${$(e).find(".tweet-timestamp").attr('href')}`


            const tweetReplies = Number($(e).find(".ProfileTweet-action--reply").find(".ProfileTweet-actionCount").attr('data-tweet-stat-count'))
            const tweetRetweets = Number($(e).find(".ProfileTweet-action--retweet").find(".ProfileTweet-actionCount").attr('data-tweet-stat-count'))
            const tweetLikes = Number($(e).find(".ProfileTweet-action--favorite").find(".ProfileTweet-actionCount").attr('data-tweet-stat-count'))

            const tweetText = utils.removeRedundantWhitespace(tweetTextDirty)

            const post = {
                title: tweetText,
                body: "", /* Twitter doesn't really have a "body" */
                provider: this.source,
                source_link: tweetSource,

                published_on: tweetTime,
                scraped_on: Date.now(),

                metadata: {
                    keywords: [],

                    community_interaction: {
                        replies: tweetReplies,
                        retweets: tweetRetweets,
                        likes: tweetLikes,
                    },

                    tweet: {
                        poster_full_name: tweetPosterFullName,
                        poster_user_name: tweetPosterUserName,
                        poster_avatar: tweetPosterAvatar,
                    }

                }


            }
            posts.push(post)
        });


        if (this.from > 0) {
            posts = posts.filter(e => e.published_on > this.from)
        }

        return posts;
    }
}
