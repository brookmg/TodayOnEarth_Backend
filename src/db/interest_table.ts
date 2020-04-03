import { Interest } from '../model/interest'
import { KnexI } from './db'

Interest.knex(KnexI);

// --- Create scheme functions ----

/**
 * Method used for creating the table, not used anymore as knex migrations are implemented now.
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

/**
 * Method to insert new Interest into the db
 * @param interestData - the interest data that fulfills model requirement
 */
export async function insertInterest(interestData: Interest) : Promise<Interest> {
    return createInterestScheme().then(() => Interest.query().insert(interestData));
}

/**
 * Method to delete an interest from the db
 * @param id - Id of the item to be deleted
 */
export async function deleteInterest(id : number) : Promise<number> {
    return createInterestScheme().then(() => Interest.query().deleteById(id));
}

/**
 * Method to find an interest from the db
 * @param id - Id of the item to be found
 */
export async function getInterestById(id : number) : Promise<Interest> {
    return createInterestScheme().then(() => Interest.query().findById(id));
}

/**
 * Method to update an interest in the db
 * @param id - Id of the item to be updated
 * @param update - value of the update
 */
export async function updateInterestById(id : number , update : Interest) : Promise<Interest> {
    return createInterestScheme().then(() => Interest.query()
        .updateAndFetchById(id, update));
}

/**
 * Method to add an interest item for a specific user
 * @param interest - the interest keyword
 * @param score - the score of the interest ( usually in the range of [-1, 1] )
 * @param uid - the user id of the logged in user
 */
export async function addInterestForUser(interest: string, score: number, uid: number) : Promise<boolean>{
    return await createInterestScheme().then(async () => {
        let interests = await Interest.query().where({interest, uid});
        if (interests.length == 0){
            return !!await insertInterest({ interest , score, uid })
        } else return !!await updateInterestForUser(interest, {interest, score}, uid);
    });
}

/**
 * Method used to crunch number to fit in the range [-1,1]
 * @param x - the value to be crunched
 */
export function activationFunction(x) { return ( 2 / ( 1 + Math.pow(Math.E,-x)) ) - 1; }

/**
 * Method to change score value of an interest item for user
 * @param interest - the keyword of the interest
 * @param to - change it to ( activationFunction is applied on the number )
 * @param uid - the current logged in user's id
 */
export async function changeInterestScoreForUser(interest: string, to: number , uid: number) : Promise<boolean>{
    return await createInterestScheme().then(async () => {
        let interests = await Interest.query().where({interest, uid});
        if (interests.length == 0){
            return !!await insertInterest({ interest , score: activationFunction(to), uid })
        } else return !!await updateInterestForUser(interest, {interest, score: activationFunction(to)}, uid);
    });
}

/**
 * Method to change score value of an interest item for user
 * @param interest - the keyword of the interest
 * @param to - change it to ( activationFunction is not applied on the number )
 * @param uid - the current logged in user's id
 */
export async function nChangeInterestScoreForUser(interest: string, to: number , uid: number) : Promise<boolean>{
    return await createInterestScheme().then(async () => {
        let interests = await Interest.query().where({interest, uid});
        to = Math.min(Math.max(to, -1), 1);
        if (interests.length == 0){
            return !!await insertInterest({ interest , score: (to), uid })
        } else return !!await updateInterestForUser(interest, {interest, score: (to)}, uid);
    });
}

/**
 * Method to mute a specific interest keyword for the user ( change the score to -1 )
 * @param interest - keyword of the interest
 * @param uid - user id of currently logged in user
 */
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

/**
 * Method to update interest item using the interest keyword
 * @param interest - interest keyword to update
 * @param update - the update value to be pushed
 * @param uid - user id in which the interest belongs to
 */
export async function updateInterestForUser(interest: string, update: Interest, uid: number) {
    return createInterestScheme().then(async () => {
        return Interest.query().patch(update).where({
            interest, uid
        });
    });
}

/**
 * Method to unmute pre muted interest or reset the score. ( it just changes the score to 0.1 )
 * @param interest - interest keyword to update
 * @param uid - user id in which the interest belongs to
 */
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

/**
 * Method to find other users with similar interest with the given user
 * @param uid - user id of the user in which similar users are looked for
 * @param flex - tolerance value to tune the interest level of the other user
 */
export async function usersWithPotentiallySimilarInterest(uid: number, flex: number): Promise<number[]> {
    return createInterestScheme().then(async () => {
        let interestsOfSignedInUser = await getInterestsForUser(uid);
        let mainQ = Interest.query().distinct(['uid']);
        interestsOfSignedInUser.forEach(
            interest => {
                mainQ.orWhere('interest' , interest.interest)
                    .andWhereBetween('score' , [ interest.score-flex , interest.score+flex ])
            }
        );

        return (await mainQ).filter(item => item.uid !== uid);
    })
}

/**
 * Method to remove a specific interest from a user
 * @param interest - interest keyword to remove
 * @param uid - user id of the user where interest is going to be removed from
 */
export async function removeInterestForUser(interest: string, uid: number) {
    return createInterestScheme().then(async () => {
        return Interest.query().delete().where({
            interest, uid
        });
    });
}

/**
 * Method to add interest list for a user
 * @param interests - array of interests
 * @param uid - the user id where the interests are added to
 * @param clear - boolean to remove any interest in the user before inserting the new ones
 */
export async function addInterestListForUser(interests: Interest[], uid: number = -1 , clear: boolean = false) : Promise<boolean> {
    let promises = [];
    if (uid < 0) throw new Error('Unknown user');
    if (clear) await Interest.query().delete().where('uid' , uid);
    for (const interest of interests) { promises.push(addInterestForUser(interest.interest , interest.score , uid)); }

    return Promise.all(promises).then(results => { return results.every(item => item === true) })
}

/**
 * Method to get list of interests in user
 * @param uid - user id to get interests from
 */
export async function getInterestsForUser(uid : number) : Promise<Interest[]> {
    return createInterestScheme().then(() => Interest.query().where('uid' , uid))
}
