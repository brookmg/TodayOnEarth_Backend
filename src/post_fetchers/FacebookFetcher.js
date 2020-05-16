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

        const response = await this.downloadWebPage({ url });

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

            const postId = $(e).find("[name=ft_ent_identifier]").attr('value')

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


            const post = {
                title: postTitle,
                body: postText,
                provider: this.source,
                source_link: url + postId,

                published_on: Number(postTimestamp)*1000,
                scraped_on: Date.now(),

                keywords: [],

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

        console.log(posts);

        return posts;
    }
}