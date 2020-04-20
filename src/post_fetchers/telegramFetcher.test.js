import TelegramFetcher from './TelegramFetcher'

const telegramFetcher = new TelegramFetcher(-1, 'androiddeveu')

/*
    {
        "body": "",
        "metadata": {
            "community_interaction": {
                "views": "3900"
            }, 
            "keywords": ["https//dev.to/tsalikispk/uploadinganandroidlibraryonjcenter2ddf"], 
            "message": {
                "audio": {
                    "src": undefined
                }, 
                "author_name": "", 
                "image": {
                    "src": ""
                }, 
                "owner": {
                    "link": "https://t.me/androiddeveu", 
                    "name": "Android Developers"
                }
            }
        }, 
        "provider": "androiddeveu", 
        "published_on": 1578513947000, 
        "scraped_on": 1580938491134, 
        "source_link": "https://t.me/androiddeveu/776", 
        "title": "https://dev.to/tsalikispk/uploading-an-android-library-on-jcenter-2ddf"
    }
*/

test('telegram scrapper gives out the right post object' , async () => {
    const posts = await telegramFetcher.getPosts();

    expect(posts.length).toBeGreaterThan(0);    // it should return posts
    expect(posts[0])
        .toEqual(expect.objectContaining({
            title: expect.any(String),
            body: expect.any(String),
            provider: expect.any(String),
            source_link: expect.any(String),
            metadata: expect.any(Object),
            scraped_on: expect.any(Number),
            published_on: expect.any(Number),   // THIS SHOULD BE NUMBER! We are just making the tests pass
        }))
} , 10000)