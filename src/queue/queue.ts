import Queue from 'bull'
import { insertItem } from '../db/post_table'
import TwitterFetcher from '../PostFetchers/TwitterFetcher'
import FacebookFetcher from '../PostFetchers/FacebookFetcher'
import TelegramFetcher from '../PostFetchers/TelegramFetcher'
import InstagramFetcher from '../PostFetchers/InstagramFetcher'

const TwitterQueue = new Queue('twitter_queue'); 
const FacebookQueue = new Queue('facebook_queue'); 
const InstagramQueue = new Queue('instagram_queue'); 
const TelegramQueue = new Queue('telegram_queue');

TwitterQueue.process((job) => {
    // twitter scraper module => push to db
    // ,then
    
    return new TwitterFetcher(job.data.from , job.data.source).getPosts().then(
        posts => posts.forEach(
            post => {
                post.metadata = JSON.stringify(post.metadata);
                if (typeof post.published_on === 'string') 
                    post.published_on = new Date(Number.parseInt(post.published_on)).toUTCString()
                post.scraped_on = new Date(post.scraped_on).toUTCString()
                insertItem(post).then(() => 
                    console.log(`added ${post.source_link} from ${post.provider}`)
                )
            }
        )
    )

})

FacebookQueue.process((job) => {
    // facebook scraper module => push to db
    // ,then
    return new FacebookFetcher(job.data.from , job.data.source).getPosts().then(
        posts => posts.forEach(
            post => {
                post.metadata = JSON.stringify(post.metadata);
                if (typeof post.published_on === 'string') 
                    post.published_on = new Date(Number.parseInt(post.published_on)).toUTCString()
                post.scraped_on = new Date(post.scraped_on).toUTCString()
                const keywords = post.keywords;
                post.keywords = undefined;
                console.log(post)
                insertItem(post).then(() => 
                    console.log(`added ${post.source_link} from ${post.provider}`)
                )
            }
        )
    )
})

InstagramQueue.process((job) => {
    // instagram scraper module => push to db
    // ,then
    return new InstagramFetcher(job.data.from , job.data.source).getPosts().then(
        posts => posts.forEach(
            post => {
                post.metadata = JSON.stringify(post.metadata);
                if (typeof post.published_on === 'string') 
                    post.published_on = new Date(Number.parseInt(post.published_on)).toUTCString()
                else post.published_on = new Date(post.published_on).toUTCString()
                post.scraped_on = new Date(post.scraped_on).toUTCString()
                insertItem(post).then(() => 
                    console.log(`added ${post.source_link} from ${post.provider}`)
                );
            }
        )
    )
})

TelegramQueue.process((job) => {
    // telegram scraper module => push to db
    // ,then
    return new TelegramFetcher(job.data.from , job.data.source).getPosts().then(
        posts => posts.forEach(
            post => {
                post.metadata = JSON.stringify(post.metadata);
                if (typeof post.published_on === 'string') 
                    post.published_on = new Date(Number.parseInt(post.published_on)).toUTCString()
                else post.published_on = new Date(post.published_on).toUTCString()
                post.scraped_on = new Date(post.scraped_on).toUTCString()
                insertItem(post).then(() => 
                    console.log(`added ${post.source_link} from ${post.provider}`)
                )
            }
        )
    );
})

async function addToTwitter(taskdata : object, cron : string = '20 * * * * *') {
    TwitterQueue.add(taskdata , {repeat: { cron: cron }})
}

async function addToFacebook(taskdata : object, cron : string = '20 * * * * *') {
    FacebookQueue.add(taskdata , {repeat: { cron: cron }})
}

async function addToInstagram(taskdata : object, cron : string = '20 * * * * *') {
    InstagramQueue.add(taskdata , {repeat: { cron: cron }})
}

async function addToTelegram(taskdata : object, cron : string = '20 * * * * *') {
    TelegramQueue.add(taskdata , {repeat: { cron: cron }})
}

export {
    addToTwitter,
    addToFacebook,
    addToInstagram,
    addToTelegram
}