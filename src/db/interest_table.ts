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

export function activationFunction(x) { return ( 2 / ( 1 + Math.pow(Math.E,-x)) ) - 1; }

export async function changeInterestScoreForUser(interest: string, to: number , uid: number) : Promise<boolean>{
    return await createInterestScheme().then(async () => {
        let interests = await Interest.query().where({interest, uid});
        if (interests.length == 0){
            return !!await insertInterest({ interest , score: activationFunction(to), uid })
        } else return !!await updateInterestForUser(interest, {interest, score: activationFunction(to)}, uid);
    });
}

export async function nChangeInterestScoreForUser(interest: string, to: number , uid: number) : Promise<boolean>{
    return await createInterestScheme().then(async () => {
        let interests = await Interest.query().where({interest, uid});
        to = Math.min(Math.max(to, -1), 1);
        if (interests.length == 0){
            return !!await insertInterest({ interest , score: (to), uid })
        } else return !!await updateInterestForUser(interest, {interest, score: (to)}, uid);
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

export async function removeInterestForUser(interest: string, uid: number) {
    return createInterestScheme().then(async () => {
        return Interest.query().delete().where({
            interest, uid
        });
    });
}

export async function addInterestListForUser(interests: Interest[], uid: number = -1 , clear: boolean = false) : Promise<boolean> {
    let promises = [];
    if (uid < 0) throw new Error('Unknown user');
    if (clear) await Interest.query().delete().where('uid' , uid);
    for (const interest of interests) { promises.push(addInterestForUser(interest.interest , interest.score , uid)); }

    return Promise.all(promises).then(results => { return results.every(item => item === true) })
}

export async function getInterestsForUser(uid : number) : Promise<Interest[]> {
    return createInterestScheme().then(() => Interest.query().where('uid' , uid))
}
