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
        table.float('score');
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

export async function addInterestForUser(interest: string, score: number, uid: number) : Promise<boolean>{
    return await createInterestScheme().then(async () => {
        let interests = await Interest.query().where({interest, uid});
        if (interests.length == 0){
            return !!await insertInterest({ interest , score, uid })
        } else return !!await updateInterestForUser(interest, {interest, score}, uid);
    });
}

export async function changeInterestScoreForUser(interest: string, by: number , uid: number) {
    return createInterestScheme().then(async () => {
    });
}

export async function muteInterestForUser(interest: string, uid: number) {
    return createInterestScheme().then(async () => {
        let interests = await Interest.query().where({interest, uid});
        if (interests.length == 0) {
            return !!await insertInterest({interest, score: -1, uid})
        } else return Interest.query().patch({score: -1}).where({
            interest, uid
        });
    });
}

export async function updateInterestForUser(interest: string, update: Interest, uid: number) {
    return createInterestScheme().then(async () => {
        return Interest.query().patch(update).where({
            interest, uid
        });
    });
}

export async function unMuteOrResetInterestForUser(interest: string, uid: number) {
    return createInterestScheme().then(async () => {
        let interests = await Interest.query().where({interest, uid});
        if (interests.length == 0) {
            return !!await insertInterest({interest, score: 0.1, uid})
        } else return Interest.query().patch({score: 0.1}).where({
            interest, uid
        });
    });
}

export async function removeInterestForUser(interest: string, uid: number) {
    return createInterestScheme().then(async () => {
        return Interest.query().delete().where({
            interest, uid
        });
    });
}

export async function addInterestListForUser(interests: Interest[], uid: number) : Promise<boolean> {
    let promises = [];
    for (const interest of interests) { promises.push(addInterestForUser(interest.interest , interest.score , uid)); }

    return Promise.all(promises).then(results => { return results.every(item => item === true) })
}

export async function getInterestsForUser(uid : number) : Promise<Interest[]> {
    return createInterestScheme().then(() => Interest.query().where('uid' , uid))
}
