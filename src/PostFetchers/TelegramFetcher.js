import PostFetcherBase from './PostFetcherBase';
import utils from "../utils"
const cheerio = require('cheerio')

export default class TelegramFetcher extends PostFetcherBase {

    // TODO: remove this later and replace with internet data
    getPageContentFromSampleData = () => {
        const fs = require('fs');
        const contents = fs.readFileSync("./src/PostFetchers/sampleData/telegram.html", 'utf8');

        return contents
    }


    getPosts = async () => {
        const url = `https://t.me/s/${this.source}`;
        const response = await this.downloadWebPage({ url });

        const webpageContent = response.data
        // const webpageContent = this.getPageContentFromSampleData();


        const $ = cheerio.load(webpageContent);

        let posts = []

        $(".tgme_widget_message_bubble").each((i, e) => {
            const messageText = $(e).find(".js-message_text").text()

            const messageOwnerLink = $(e).find(".tgme_widget_message_owner_name").attr("href")
            const messageOwnerName = $(e).find(".tgme_widget_message_owner_name").text()
            const messageAudioSrc = $(e).find("audio").attr("src")
            const messageViewsDirty = $(e).find(".tgme_widget_message_views").text()
            const messageAuthor = $(e).find(".tgme_widget_message_from_author").text()
            const messageDate = $(e).find(".tgme_widget_message_date").find("time").attr("datetime")
            const messagePermalink = $(e).find("a.tgme_widget_message_date").attr("href")
            const messageImageSrcDirty = $(e).find("a.tgme_widget_message_photo_wrap").attr("style") || ""


            let messageImageSrc = ""
            const imageMatch = messageImageSrcDirty.match(/background\-image\:url\(\'([^]*)\'\)/m)
            if (imageMatch && imageMatch[1]) {
                messageImageSrc = imageMatch[1]
            }

            const messageViews = Number(messageViewsDirty.replace(".", "")
                .replace("K", "00")
                .replace("M", "00000"))

            let allKeyWords = messageText.split(" ");

            const messageKeywords = [];
            allKeyWords.forEach((wordDirty, i) => {
                const word = utils.fixNonAlphaNumeric(wordDirty);

                if (word.length > 0) {
                    if (word[0] === "#") { // if word is hashtag
                        // extract just the hashtag
                        messageKeywords.push(word.match(/#[\w]+/gi)[0])
                    } else {
                        messageKeywords.push(word)
                    }
                }
            })


            const post = {
                title: messageText,
                body: "",
                provider: this.source,
                source_link: messagePermalink,

                published_on: new Date(messageDate).getTime(),
                scraped_on: Date.now(),

                metadata: {
                    keywords: messageKeywords,

                    community_interaction: {
                        views: messageViews,
                    },

                    message: {
                        owner: {
                            link: messageOwnerLink,
                            name: messageOwnerName,
                        },
                        audio: {
                            src: messageAudioSrc
                        },
                        image: {
                            src: messageImageSrc
                        },
                        author_name: messageAuthor
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
