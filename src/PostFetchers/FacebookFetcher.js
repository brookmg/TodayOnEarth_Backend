import PostFetcherBase from './PostFetcherBase';
import utils from "../utils"
const cheerio = require('cheerio')

export default class FacebookFetcher extends PostFetcherBase {

    // TODO: remove this later and replace with internet data
    getPageContentFromSampleData = () => {
        const fs = require('fs');
        const contents = fs.readFileSync("./src/PostFetchers/sampleData/facebook.html", 'utf8');

        return contents
    }


    getPosts = async () => {
        const url = `https://www.facebook.com/${this.source}/posts/`;

        console.log("brfore")
        const response = await this.downloadWebPage({ url });
        console.log("after")

        const webpageContent = response.data
        // const webpageContent = this.getPageContentFromSampleData();


        const $ = cheerio.load(webpageContent);

        let posts = []

        $(".userContentWrapper").each((i, e) => {
            const postTextDirty = $(e).find(".userContent").find("p").text();

            const postAvatar = $(e).find("img.img").attr("src");
            const postTimestamp = $(e).find("abbr").attr("data-utime");


            const postMediaTextDirty = $(e).find(".accessible_elem").text()

            const postMediaImg = $(e).find(".scaledImageFitWidth").attr("src")
            const postMediaMetadata = $(e).find(".scaledImageFitWidth").attr("aria-label") || ""


            const postLinks = [];
            $(e).find("a").each((i, e) => {
                const link = $(e).attr("href")
                if (link.startsWith("https://l.facebook.com/l.php?")) {
                    const linkObj = {
                        link,
                        title: $(e).attr("aria-label"),
                    }
                    postLinks.push(linkObj)
                }
            })

            const postText = utils.removeRedundantWhitespace(postTextDirty)
            const postMediaText = utils.removeRedundantWhitespace(postMediaTextDirty)


            let postTitle = postText;
            if (postMediaText.length > 0) postTitle = postMediaText


            let allKeyWords = postTitle.split(" ");

            if (postMediaMetadata.length > 0)
                allKeyWords = [...allKeyWords, ...postMediaMetadata.split(" ")]


            const postKeywords = []
            allKeyWords.forEach((wordDirty, i) => {
                const word = utils.fixNonAlphaNumeric(wordDirty);

                if (word.length > 0) {
                    if (word[0] === "#") { // if word is hashtag
                        // extract just the hashtag
                        if (word.match(/#[\w]+/gi) != null) // edge case where posts contain nothing after hash sign `# Hollywood` 
                            postKeywords.push(word.match(/#[\w]+/gi)[0])
                    } else {
                        postKeywords.push(word)
                    }
                }
            })





            const post = {
                title: postTitle,
                body: postText,
                provider: this.source,
                source_link: url,

                published_on: postTimestamp,
                scraped_on: Date.now(),

                keywords: postKeywords,

                metadata: {
                    post: {
                        poster_user_name: this.source,
                        poster_avatar: postAvatar,
                        poster_media_text: postMediaText,
                        poster_media_img: postMediaImg,
                        poster_media_metadata: postMediaMetadata,
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