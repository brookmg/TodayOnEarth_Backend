import { Interest } from '../model/interest'
import { KnexI } from './db'

Interest.knex(KnexI);

// --- Create scheme functions ----

/*
    INSERT INTO interest (interest, uid) VALUES ('hello' , 1);
*/

export async function createInterestScheme() : Promise<any> {
    if (await KnexI.schema.hasTable('interest')) return null; // We don't need to create it again

    return KnexI.schema.createTable('interest', table => {
        table.increments('interest_id').primary();

        table.string('interest');
        table.integer('uid');
    })

}

export async function insertInterest(interestData: Interest) : Promise<Interest> {
    return createInterestScheme().then(() => Interest.query().insert(interestData));
}

export async function deleteInterest(id : number) : Promise<number> {
    return createInterestScheme().then(() => Interest.query().deleteById(id));
}

export async function getInterestById(id : number) : Promise<Interest> {
    return createInterestScheme().then(() => Interest.query().findById(id));
}

export async function updateInterestById(id : number , update : Interest) : Promise<Interest> {
    return createInterestScheme().then(() => Interest.query()
        .updateAndFetchById(id, update));
}

export async function getInterestsForUser(uid : number) : Promise<Interest[]> {
    return createInterestScheme().then(() => Interest.query().where('uid' , uid))
}