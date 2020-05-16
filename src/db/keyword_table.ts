import { Keyword } from '../model/keyword'
import { KnexI } from './db'

Keyword.knex(KnexI);

// --- Create scheme functions ----

/**
 * Method used for creating the table, not used anymore as knex migrations are implemented now.
 */
export async function createKeywordScheme() : Promise<any> {
    if (await KnexI.schema.hasTable('keyword')) return null; // We don't need to create it again

    return KnexI.schema.createTable('keyword', table => {
        table.increments('keyword_id').primary();

        table.string('keyword');
        table.integer('post_id');
    })

}
/**
 * Method to insert new keyword item into the db
 * @param keywordData - the keyword data that fulfills model requirement
 */
export async function insertItem(keywordData: Keyword) : Promise<Keyword> {
    return createKeywordScheme(); //.then(() => Keyword.query().insert(keywordData));
}

/**
 * Method to delete a keyword from the db
 * @param id - Id of the item to be deleted
 */
export async function deleteItem(id : number) : Promise<number> {
    return Keyword.query().deleteById(id);
}

/**
 * Method to find a keyword from the db
 * @param id - Id of the item to be found
 */
export async function getItemById(id : number) : Promise<Keyword> {
    return Keyword.query().findById(id);
}

/**
 * Method to update a keyword from the db
 * @param id - Id of the item to be updated
 * @param update - the value of the update
 */
export async function updateItemById(id : number , update : Keyword) : Promise<Keyword> {
    return Keyword.query()
        .updateAndFetchById(id, update);
}

/**
 * Method to get keywords for a post from the db
 * @param postid - Id of the post to get keywords for
 */
export async function getItemsForPost(postid : number) : Promise<Keyword[]> {
    return Keyword.query().where('post_id' , postid)
}
