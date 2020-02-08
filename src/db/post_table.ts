import { Post } from '../model/post'
import { KnexI } from './db'

Post.knex(KnexI);

// --- Create scheme functions ----

/*
    INSERT INTO post (title, body, provider, source_link, published_on, scraped_on, metadata) 
    VALUES ('Money and time' , 'Anne Marie new music was just released today.' , 'genius' , 
    'https://genius.com/feed/annie-84522' , '2020-02-04 00:00:00', '2020-02-04 00:00:00', 
    '{ \"metadata\" : {}}');
*/

export async function createPostScheme() : Promise<any> {
    let exists = await KnexI.schema.hasTable('post');
    if (exists) return; // We don't need to create it again

    return KnexI.schema.createTable('post', table => {
        table.increments('postid').primary();

        table.text('title', 'longtext');
        table.text('body', 'longtext');
        table.text('provider', 'longtext');
        table.text('source_link', 'mediumtext').unique();

        table.date('published_on');
        table.date('scraped_on');

        table.text('metadata', 'longtext');
    })

}

export async function insertPost(postData) : Promise<Post> {
    return createPostScheme().then(() => Post.query().insert(postData));
}

export async function deletePost(postid: number) : Promise<number> {
    return Post.query().deleteById(postid);
}

export async function getAllPosts() : Promise<Post[]> {
    return Post.query();
}

export async function getPostById(postid: number) : Promise<Post> {
    return Post.query().findById(postid);
}

export async function getAllPostsFromProvider(provider: string) : Promise<Post[]> {
    return Post.query().where('provider' , provider);
}

export async function getAllPostsFromSource(source: string) : Promise<Post[]> {
    return Post.query().where('source_link' , 'like' ,  `%${source}%`);
}

export async function updatePostById(postid: number , update: Post) : Promise<Post> {
    return Post.query()
        .updateAndFetchById(postid, update);
}
