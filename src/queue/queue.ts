import Queue from 'bull'
import { insertItem } from '../db/post_table'
import TwitterFetcher from '../PostFetchers/TwitterFetcher'

const TwitterQueue = new Queue('twitter_queue'); 
const FacebookQueue = new Queue('facebook_queue'); 
const InstagramQueue = new Queue('instagram_queue'); 
const TelegramQueue = new Queue('telegram_queue');

TwitterQueue.process((job, done) => {
    // twitter scraper module => push to db
    // ,then
    
    new TwitterFetcher(job.data.from , job.data.source).getPosts().then(
        posts => posts.forEach(
            post => {
                post.metadata = JSON.stringify(post.metadata);
                if (typeof post.published_on === 'string') 
                    post.published_on = new Date(Number.parseInt(post.published_on)).toUTCString()
                post.scraped_on = new Date(post.scraped_on).toUTCString()
                insertItem(post).then(() => 
                    console.log(`added ${post.source_link} from ${post.provider}`)
                ).catch(err => console.error(err));
            }
        )
    ).then(() => done());

})

FacebookQueue.process((job, done) => {
    // facebook scraper module => push to db
    // ,then
    console.log('facebook' , job.data)
    done();
})

InstagramQueue.process((job, done) => {
    // instagram scraper module => push to db
    // ,then
    console.log('insta' , job.data)
    done();
})

TelegramQueue.process((job, done) => {
    // telegram scraper module => push to db
    // ,then
    console.log('telegram' , job.data)
    done();
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