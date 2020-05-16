import PostFetcherBase from './PostFetcherBase';
import utils from "../utils"
const cheerio = require('cheerio')

export default class InstagramFetcher extends PostFetcherBase {

    // TODO: remove this later and replace with internet data
    getPageContentFromSampleData = () => {
        const fs = require('fs');
        const contents = fs.readFileSync("./src/PostFetchers/sampleData/instagram.html", 'utf8');

        return contents
    }


    getPosts = async () => {
        const url = `https://www.instagram.com/${this.source}`;
        const response = await this.downloadWebPage({ url });

        const webpageContent = response.data
        // const webpageContent = this.getPageContentFromSampleData();

        const $ = cheerio.load(webpageContent);

        let posts = []

        $("script").each((i, e) => {
            const scriptContent = $(e).html()

            const feedJSON = scriptContent.match(/window\.\_sharedData \= ([^]*);/m)
            if (feedJSON) {
                const userInfo = JSON.parse(feedJSON[1]).entry_data.ProfilePage[0].graphql.user

                const userPosts = userInfo.edge_owner_to_timeline_media.edges

                userPosts.forEach((e, i) => {
                    const postId = e.node.id
                    const postText =               
                    e.node.edge_media_to_caption.edges[0] != undefined ?
                    e.node.edge_media_to_caption.edges[0].node.text : '';

                    const postUrl = `https://www.instagram.com/p/${e.node.shortcode}`
                    const postCommentCount = e.node.edge_media_to_comment.count

                    const postTimestamp = e.node.taken_at_timestamp
                    const postMediaHeight = e.node.dimensions.height
                    const postMediaWidth = e.node.dimensions.width
                    const postFullImage = e.node.display_url
                    const postLikeCount = e.node.edge_liked_by.count
                    const postLocation = e.node.location

                    const postOwnerId = e.node.owner.id
                    const postOwnerUsername = e.node.owner.username
                    const postThumbnail = e.node.thumbnail_src
                    const postIsVideo = e.node.is_video
                    const postVideoViewCount = e.node.video_view_count
                    const postThumbnails = e.node.thumbnail_resources
                    const postAccessibilityCaption = e.node.accessibility_caption

                    const post = {
                        title: postText,
                        body: "",
                        provider: this.source,
                        source_link: postUrl,

                        published_on: Number(postTimestamp)*1000,
                        scraped_on: Date.now(),

                        metadata: {
                            keywords: [],

                            community_interaction: {
                                comments: postCommentCount,
                                likes: postLikeCount,
                                video_views: postVideoViewCount
                            },

                            post: {
                                post_id: postId,
                                owner: {
                                    id: postOwnerId,
                                    username: postOwnerUsername
                                },
                                location: postLocation,
                                dimensions: {
                                    height: postMediaHeight,
                                    width: postMediaWidth
                                },
                                full_size_image: postFullImage,
                                thumbnail_image: postThumbnail,
                                is_video: postIsVideo,
                                additional_thumbnails: postThumbnails,
                                accessibility_caption: postAccessibilityCaption
                            }

                        }


                    }

                    posts.push(post)
                })

            }

        });


        if (this.from > 0) {
            posts = posts.filter(e => e.published_on > this.from)
        }

        console.log(posts);

        return posts;
    }
}