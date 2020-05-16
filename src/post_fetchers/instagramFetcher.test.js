import InstagramFetcher from './InstagramFetcher'

const instagramFetcher = new InstagramFetcher(-1, 'zuck')


test('instagram scrapper gives out the right post object' , async () => {
    const posts = await instagramFetcher.getPosts();

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