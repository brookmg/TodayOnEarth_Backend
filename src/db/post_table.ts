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
    if (await KnexI.schema.hasTable('post')) return; // We don't need to create it again

    return KnexI.schema.createTable('post', table => {
        table.increments('postid').primary();

        table.string('title');
        table.string('body');
        table.string('provider');
        table.string('source_link');

        table.date('published_on');
        table.date('scraped_on');

        table.string('metadata');
    })

}

export async function insertItem(postData) : Promise<Post> {
    return Post.query().insert(postData);
}

export async function deleteItem(id: number) : Promise<number> {
    return Post.query().deleteById(id);
}

export async function getItemById(id: number) : Promise<Post> {
    return Post.query().findById(id);
}

export async function updateItemById(id: number , update: Post) : Promise<Post> {
    return Post.query()
        .updateAndFetchById(id, update);
}
