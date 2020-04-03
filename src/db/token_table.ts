import { Token } from '../model/token'
import { KnexI } from '../db/db'

Token.knex(KnexI)

export async function createTokenScheme() : Promise<any> {
    if (await KnexI.schema.hasTable('token')) return null; // We don't need to create it again

    return KnexI.schema.createTable('token', table => {
        table.increments('id').primary();

        table.integer('uid').unique();
        table.text('google' , 'longtext');
        table.text('facebook' , 'longtext');
        table.text('twitter' , 'longtext');
        table.text('instagram' , 'longtext');
    })

}

export async function insertToken(tokenData: object) : Promise<Token> {
    return createTokenScheme().then(() => Token.query().insert(tokenData));
}

export async function deleteToken(id : number) : Promise<number> {
    return Token.query().deleteById(id);
}

export async function getTokenById(id : number) : Promise<Token> {
    return Token.query().findById(id);
}

/**
 * Method to add a specific platform token to a user
 * @param type - type of token ( can only be ['google', 'facebook' , 'twitter' , 'instagram' , 'github' , 'linkedin'] )
 * @param token - the token string ( usually two tokens separated by ||| )
 * @param uid - the user id to add the token to
 */
export async function addTokenForUser(type: string, token: string, uid: number) : Promise<boolean> {
    const allowedTypes = ['google', 'facebook' , 'twitter' , 'instagram' , 'github' , 'linkedin'];
    if (!allowedTypes.includes(type)) throw new Error('Token provided for unknown source');

    return await createTokenScheme().then(async () => {
        const countOfToken = (await Token.query().where('uid' , uid)).length;
        if (countOfToken == 0) {
            const insertItem = await insertToken({ uid: uid, facebook: "" , twitter: "", instagram: "" });
        }

        return await Token.query().patch({[type] : token}).where('uid' , uid) === 1
    })
}

/**
 * Method to remove the token of a type from a user
 * @param type - type of token ( can only be ['google', 'facebook' , 'twitter' , 'instagram' , 'github' , 'linkedin'] )
 * @param uid - the user id to remove the token from
 */
export async function removeTokenForUser(type: string, uid: number) : Promise<boolean> {
    const allowedTypes = ['facebook' , 'twitter' , 'instagram'];
    if (!allowedTypes.includes(type)) throw new Error('Removing token for unknown source');

    return await createTokenScheme().then(async () => {
        const countOfToken = (await Token.query().where('uid' , uid)).length;
        if (countOfToken == 0) {
            const insertItem = await insertToken({ uid: uid, facebook: "" , twitter: "", instagram: "" })
            return await Token.query().patch(
                JSON.parse(`{ "${type}" : "" }`)
            ).where('uid' , uid) === 1
        }
        else {
            return await Token.query().patch(
                JSON.parse(`{ "${type}": "" }`)
            ).where('uid' , uid) === 1
        }
    })
}

export async function updateTokenById(id : number , update : Token) : Promise<Token> {
    return Token.query()
        .updateAndFetchById(id, update);
}

export async function getTokensForUser(uid : number) : Promise<Token[]> {
    return Token.query().where('uid' , uid)
}
