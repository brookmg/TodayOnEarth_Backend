import Queue from 'bull'
import { insertPost } from '../db/post_table'
import TwitterFetcher from '../PostFetchers/TwitterFetcher'
import FacebookFetcher from '../PostFetchers/FacebookFetcher'
import TelegramFetcher from '../PostFetchers/TelegramFetcher'
import InstagramFetcher from '../PostFetchers/InstagramFetcher'
import * as NodeMailer from 'nodemailer'
import {getAllProviders} from "../db/provider_table";

const {REDIS_URL} = process.env;
const Redis = require('ioredis');
const client = new Redis(REDIS_URL);
const subscriber = new Redis(REDIS_URL);

const opts = {
    createClient: function (type) {
        switch (type) {
            case 'client':
                return client;
            case 'subscriber':
                return subscriber;
            default:
                return new Redis(REDIS_URL);
        }
    }
};

const TwitterQueue = new Queue('twitter_queue' , opts);
const FacebookQueue = new Queue('facebook_queue', opts);
const InstagramQueue = new Queue('instagram_queue', opts);
const TelegramQueue = new Queue('telegram_queue', opts);
const EmailQueue = new Queue('email_queue', opts);
const ProviderFetchIssuer = new Queue('provider_fetch_issuer', opts);

const dotenv = require('dotenv');
dotenv.config();

TwitterQueue.process((job) => {
    // twitter scraper module => push to db
    // ,then

    return new TwitterFetcher(job.data.from , job.data.source).getPosts().then(
        posts => posts.forEach(
            post => {
                if (post.metadata) {
                    // move keywords outside
                    if (typeof post.metadata === 'string') post.metadata = JSON.parse(post.metadata)
                    if (post.metadata.keywords != undefined) post.keywords = post.metadata.keywords
                    post.metadata.keywords = undefined
                }
                insertPost(post).then(() => {
                    if (job.data.log) console.log(`added ${post.source_link} from ${post.provider}`)
                }).catch(e => console.error(`failed to add ${post.source_link} with ${e}`))
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
                if (post.metadata && post.metadata.keywords) {
                    // move keywords outside
                    post.keywords = post.metadata.keywords
                    post.metadata.keywords = undefined
                }
                insertPost(post).then(() => {
                    if (job.data.log) console.log(`added ${post.source_link} from ${post.provider}`)
                }).catch(e => console.error(`failed to add ${post.source_link} with ${e}`))
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
                if (post.metadata && post.metadata.keywords) {
                    // move keywords outside
                    post.keywords = post.metadata.keywords
                    post.metadata.keywords = undefined
                }
                insertPost(post).then(() => {
                    if (job.data.log) console.log(`added ${post.source_link} from ${post.provider}`)
                }).catch(e => console.error(`failed to add ${post.source_link} with ${e}`))
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

                if (post.metadata && post.metadata.keywords) {
                    post.keywords = post.metadata.keywords
                    post.metadata.keywords = undefined
                }

                insertPost(post).then(() => {
                    if (job.data.log) console.log(`added ${post.source_link} from ${post.provider}`)
                }).catch(e => console.error(`failed to add ${post.source_link} with ${e}`))
            }
        )
    );
})

EmailQueue.process(async job => {
    // This is for a test , We should replace this with actual account

    let transporter = NodeMailer.createTransport({
        service: 'Gmail', // upgrade later with STARTTLS
        auth: {
            user: process.env.GMAIL_DUMMY_ACCOUNT,
            pass: process.env.GMAIL_DUMMY_ACCOUNT_PASSWORD
        }
    });

    let info = await transporter.sendMail({
        from: '"Today On Earth" <toe@toe.app>',
        to: job.data.email || process.env.GMAIL_DUMMY_ACCOUNT,
        subject: job.data.subject || 'NO SUBJECT EMAIL>>>',
        html: job.data.html || '<h1> NO HTML BODY ? </h1>'
    });

    console.dir(info)
});

ProviderFetchIssuer.process(async () => {
    // get all the providers in the system. Place them in the appropriate queue one by one.
    let providers = await getAllProviders();
    for (const provider of providers) {
        console.log(`Handing off ... ${provider.provider} to ${provider.source.toLowerCase()} queue`);
        switch (provider.source.toLowerCase()) {
            case 'facebook': await addToFacebook({from: -1, source: provider.provider}); break;
            case 'twitter': await addToTwitter({from: -1, source: provider.provider}); break;
            case 'telegram': await addToTelegram({from: -1, source: provider.provider}); break;
            case 'instagram': await addToInstagram({from: -1, source: provider.provider}); break;
            default: console.error(`unknown source: ${provider.source.toLowerCase()} `);
        }
    }
});

async function addToTwitter(taskData : object) {
    TwitterQueue.add(taskData)
}

async function addToFacebook(taskData : object) {
    FacebookQueue.add(taskData)
}

async function addToInstagram(taskData : object) {
    InstagramQueue.add(taskData)
}

async function addToTelegram(taskData : object) {
    TelegramQueue.add(taskData)
}

async function sendEmail(taskdata : object) {
    return EmailQueue.add(taskdata)
}

async function startIssuer(cron : string = '20 * * * * *') {
    ProviderFetchIssuer.add({} , {repeat: {cron: cron}})
}

export {
    addToTwitter,
    addToFacebook,
    addToInstagram,
    addToTelegram,
    sendEmail,
    startIssuer
}
