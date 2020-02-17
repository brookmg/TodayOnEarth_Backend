import FacebookFetcher from './FacebookFetcher'

const facebookFetcher = new FacebookFetcher(-1, 'kuwasapp')

/*
    {
        "body": "The new premier league is about to start. We will have the first game tomorrow , sunday 21th of Hidar. Download our app now and follow up with the latest stuff happening in our league. https://kuwas-android.web.app/",
        "keywords": [
            "The",
            "new",
            "premier",
            "league",
            "is",
            "about",
            "to",
            "start.",
            "We",
            "will",
            "have",
            "the",
            "first",
            "game",
            "tomorrow",
            "sunday",
            "21th",
            "of",
            "Hidar.",
            "Download",
            "our",
            "app",
            "now",
            "and",
            "follow",
            "up",
            "with",
            "the",
            "latest",
            "stuff",
            "happening",
            "in",
            "our",
            "league.",
            "https//kuwasandroid.web.app/"
        ],
        "metadata": {
            "post": {
                "poster_avatar": "https://scontent.fadd1-1.fna.fbcdn.net/v/t1.0-1/cp0/p50x50/69745805_117240512980080_1746375977916694528_n.jpg?_nc_cat=106&_nc_oc=AQlyCMMEWEoXLyeNw82hnRN9dEuO3UnRlpDrCgnRq78TqSr7zK91l60UAOJw8iiT7mo&_nc_ht=scontent.fadd1-1.fna&oh=7767ca4dc9d5d46f0aa01719a664026a&oe=5ED8672D",
                "poster_media_img": "https://scontent.fadd1-1.fna.fbcdn.net/v/t1.0-0/p526x296/78264147_161038455266952_278028643412738048_o.jpg?_nc_cat=101&_nc_oc=AQk1l9aX8lNyQBohRVw2v7dpxILv_THdkPunTkuHN6yJpcRxbEp01puGE6X5fMlkb1I&_nc_ht=scontent.fadd1-1.fna&_nc_tp=6&oh=82e0c7242f01d99e88bc36cb61d3b12e&oe=5EC67C1D",
                "poster_media_metadata": "",
                "poster_media_text": "",
                "poster_user_name": "kuwasapp"
            }
        },
        "provider": "kuwasapp",
        "published_on": "1575141178",
        "scraped_on": 1580934278162,
        "source_link": "https://www.facebook.com/kuwasapp/posts/",
        "title": "The new premier league is about to start. We will have the first game tomorrow , sunday 21th of Hidar. Download our app now and follow up with the latest stuff happening in our league. https://kuwas-android.web.app/"
    }
*/

test('facebook scrapper gives out the right post object' , async () => {
    const posts = await facebookFetcher.getPosts();

    expect(posts.length).toBeGreaterThan(0);    // it should return posts
    expect(posts[0])
        .toEqual(expect.objectContaining({
            title: expect.any(String),
            body: expect.any(String),
            provider: expect.any(String),
            source_link: expect.any(String),
            metadata: expect.any(Object),
            scraped_on: expect.any(Number),
            published_on: expect.any(Number),
        }))
} , 10000)