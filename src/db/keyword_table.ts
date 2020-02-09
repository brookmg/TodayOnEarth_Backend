import { Keyword } from '../model/keyword'
import { KnexI } from './db'

Keyword.knex(KnexI);

// --- Create scheme functions ----

/*
    INSERT INTO keyword (keyword, post_id) VALUES ('hello' , 1);
*/

export async function createKeywordScheme() : Promise<any> {
    if (await KnexI.schema.hasTable('keyword')) return null; // We don't need to create it again

    return KnexI.schema.createTable('keyword', table => {
        table.increments('keyword_id').primary();

        table.string('keyword');
        table.integer('post_id');
    })

}

export async function insertItem(keywordData: Keyword) : Promise<Keyword> {
    return createKeywordScheme().then(() => Keyword.query().insert(keywordData));
}

export async function deleteItem(id : number) : Promise<number> {
    return Keyword.query().deleteById(id);
}

export async function getItemById(id : number) : Promise<Keyword> {
    return Keyword.query().findById(id);
}

export async function updateItemById(id : number , update : Keyword) : Promise<Keyword> {
    return Keyword.query()
        .updateAndFetchById(id, update);
}

export async function getItemsForPost(postid : number) : Promise<Keyword[]> {
    return Keyword.query().where('post_id' , postid)
}