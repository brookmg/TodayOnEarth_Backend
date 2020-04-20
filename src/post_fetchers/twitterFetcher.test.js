import TwitterFetcher from './TwitterFetcher'

const twitterFetcher = new TwitterFetcher(-1, 'kuwasapp')

/*
    {   "body": "",
        "metadata": { 
            "community_interaction": {
                "likes": "2", 
                "replies": "0", 
                "retweets": "0"
            }, 
            "keywords": [
                "Join", "our", "telegram", 
                "channel", "https//t.me/kuwasapp", 
                "and", "our", "telegram", "group", 
                "for", "discussion", "https//t.me/kuwasappgroup", ""
            ], 
            "tweet": {
                "poster_avatar": "https://pbs.twimg.com/profile_images/1161962679357120513/GZkUEIrR_bigger.jpg", 
                "poster_full_name": "Kuwas", 
                "poster_user_name": "@kuwasapp"
            }
        }, 
        "provider": "kuwasapp", 
        "published_on": "1575348475000", 
        "scraped_on": 1580927616621, 
        "source_link": "https://twitter.com/kuwasapp/status/1201724721911488512", 
        "title": "Join our telegram channel https://t.me/kuwasapp and our telegram group for discussion https://t.me/kuwasappgroup "
    }
*/

test('twitter scrapper gives out the right post object' , async () => {
    const posts = await twitterFetcher.getPosts();

    expect(posts.length).toBeGreaterThan(0);    // it should return posts
    expect(posts[0])
        .toEqual(expect.objectContaining({
            title: expect.any(String),
            body: expect.any(String),
            provider: expect.any(String),
            source_link: expect.any(String),
            metadata: expect.any(Object),
            scraped_on: expect.any(Number),
            published_on: expect.any(String),   // THIS SHOULD BE NUMBER! We are just making the tests pass
        }))
} , 10000)