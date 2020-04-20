import InstagramFetcher from './InstagramFetcher'

const instagramFetcher = new InstagramFetcher(-1, 'lindashitaye')

/*
    { 
        "body":"",
        "metadata":{ 
            "community_interaction":{ 
                "comments":36,
                "likes":1000,
                "video_views":undefined
            },
            "keywords":[ 
                "Maybe",
                "shes",
                "born",
                "with",
                "it",
                ".Top",
                "@miss.t.cal",
                "Image",
                "may",
                "contain",
                "1",
                "person",
                "tennis",
                "and",
                "outdoor"
            ],
            "post":{ 
                "accessibility_caption":"Image may contain: 1 person, tennis and outdoor",
                "additional_thumbnails":[ 
                    { 
                    "config_height":150,
                    "config_width":150,
                    "src":"https://instagram.fadd1-1.fna.fbcdn.net/v/t51.2885-15/e35/c0.0.1079.1079a/s150x150/82796721_582751155613966_2733098363396174888_n.jpg?_nc_ht=instagram.fadd1-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=81wdSRuRpWAAX_En_lO&oh=95f0b333ec811aee28ad6490b27e22b8&oe=5ECEE4AB"
                    },
                    { 
                    "config_height":240,
                    "config_width":240,
                    "src":"https://instagram.fadd1-1.fna.fbcdn.net/v/t51.2885-15/e35/c0.0.1079.1079a/s240x240/82796721_582751155613966_2733098363396174888_n.jpg?_nc_ht=instagram.fadd1-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=81wdSRuRpWAAX_En_lO&oh=3f45fbff3c51c5a21d21bc8e301439d6&oe=5EBA57E1"
                    },
                    { 
                    "config_height":320,
                    "config_width":320,
                    "src":"https://instagram.fadd1-1.fna.fbcdn.net/v/t51.2885-15/e35/c0.0.1079.1079a/s320x320/82796721_582751155613966_2733098363396174888_n.jpg?_nc_ht=instagram.fadd1-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=81wdSRuRpWAAX_En_lO&oh=cafdb283fe6e250f7ce0855b2db77052&oe=5ED5295B"
                    },
                    { 
                    "config_height":480,
                    "config_width":480,
                    "src":"https://instagram.fadd1-1.fna.fbcdn.net/v/t51.2885-15/e35/c0.0.1079.1079a/s480x480/82796721_582751155613966_2733098363396174888_n.jpg?_nc_ht=instagram.fadd1-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=81wdSRuRpWAAX_En_lO&oh=c86e93cb5d37fa27b89437391c7a1d4e&oe=5EB69D01"
                    },
                    { 
                    "config_height":640,
                    "config_width":640,
                    "src":"https://instagram.fadd1-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.0.1079.1079a/s640x640/82796721_582751155613966_2733098363396174888_n.jpg?_nc_ht=instagram.fadd1-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=81wdSRuRpWAAX_En_lO&oh=ee44f3b160c5d6e9ca6a82eca903eaf4&oe=5EDB02C3"
                    }
                ],
                "dimensions":{ 
                    "height":1079,
                    "width":1080
                },
                "full_size_image":"https://instagram.fadd1-1.fna.fbcdn.net/v/t51.2885-15/e35/82796721_582751155613966_2733098363396174888_n.jpg?_nc_ht=instagram.fadd1-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=81wdSRuRpWAAX_En_lO&oh=08bd0cc4844d28cd196dfd16b708abcf&oe=5EBB3E14",
                "is_video":false,
                "location":null,
                "owner":{ 
                    "id":"8088389405",
                    "username":"lindashitaye"
                },
                "post_id":"2236589069425431403",
                "thumbnail_image":"https://instagram.fadd1-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.0.1079.1079a/s640x640/82796721_582751155613966_2733098363396174888_n.jpg?_nc_ht=instagram.fadd1-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=81wdSRuRpWAAX_En_lO&oh=ee44f3b160c5d6e9ca6a82eca903eaf4&oe=5EDB02C3"
            }
        },
        "provider":"lindashitaye",
        "published_on":1580842215,
        "scraped_on":1580936393467,
        "source_link":"https://www.instagram.com/p/B8J9eifn9Nr",
        "title":"Maybe she's born with it 💚. Top: @miss.t.cal"
    }

*/

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