import Queue from 'bull'

const TwitterQueue = new Queue('twitter_queue'); 
const FacebookQueue = new Queue('facebook_queue'); 
const InstagramQueue = new Queue('instagram_queue'); 
const TelegramQueue = new Queue('telegram_queue');

TwitterQueue.process((job, done) => {
    // twitter scraper module => push to db
    // ,then
    console.log('twitter' , job.data)
    done();
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