import { KnexI } from './db'
import { User } from '../model/user'
import { hash, compare } from 'bcrypt'
import { randomBytes } from "crypto";
import { verify, sign, TokenExpiredError } from 'jsonwebtoken'
import {createInterestScheme} from "./interest_table";
import {sendEmail} from "../queue/queue";

User.knex(KnexI);

export async function createUserScheme(): Promise<any> {
    if (await KnexI.schema.hasTable('user')) return null; // We don't need to create it again

    return KnexI.schema.createTable('user', table => {
        table.increments('uid').primary();

        table.string('first_name');
        table.string('middle_name');
        table.string('last_name');
        table.string('email').unique();
        table.integer('role');

        table.string('phone_number');
        table.date('last_login_time');
        table.string('username').unique();
        table.string('country');
        table.string('last_location');  // comma separated geo data
        table.string('password_hash');

        table.string('google_id').unique();
        table.string('facebook_id').unique();
        table.string('twitter_id').unique();

        table.string('github_id').unique();
        table.string('linkedin_id').unique();
        table.string('telegram_id').unique();

        table.boolean('verified').defaultTo(false);
        table.string('verification_token');
    })

}

export async function insertUser(userData: User): Promise<User> {
    if (userData.username.indexOf('@') !== -1) throw new Error('Username cannot contain the @ character');
    return createUserScheme().then(() => User.query().insert(userData));
}

export async function getUser(uid: Number): Promise<User> {
    await createUserScheme();
    await createInterestScheme();
    return User.query().findById(uid).withGraphFetched({
        interests: true, providers: true
    });
}

export async function isUserVerified(uid: number) : Promise<boolean> {
    return (await User.query().findById(uid)).verified;
}

export async function getUserVerificationToken(uid: number) : Promise<boolean> {
    return (await User.query().findById(uid)).verification_token;
}

export async function setUserVerification(uid: number, verified: boolean) : Promise<boolean> {
    return !!await User.query().patchAndFetchById(uid, { verified })
}

export async function setUserVerificationToken(uid: number, verification_token: string) : Promise<boolean> {
    return !!await User.query().patchAndFetchById(uid, { verification_token })
}

export async function sendVerificationEmail(uid: number) {
    let user = await getUser(uid);
    if (!user.verified) {
        if (user.email.indexOf('@toe.app') === -1) {
            let generateToken = (await randomBytes(48)).toString('hex');
            let callBackUrl = `${process.env.HOST}/email_verify?token=${generateToken}`;

            await setUserVerificationToken(uid, generateToken);

            let genericEmail = `
            <h1> Hello, ${user.first_name} </h1>
            <h3> Verify your email address <code><${user.email}></code></h3>
            <br>
            
            <p> The verification process is quiet easy. 
            Just click on <a href="${callBackUrl}"> this </a> 
            in your browser. If you are not using a browser, copy and paste <code>${callBackUrl}</code> into one.</p>
            
            <h4> Thanks for being our user. </h4>
            <b><h4>Today On Earth [support@toe.app]</h4></b>
            `;

            return !!await sendEmail({ email: user.email, subject: 'Email Verification', html: genericEmail })
        } else throw new Error('User doesn\'t have a valid email');
    } else throw new Error('User already verified')
}

export async function verifyUserEmailWithToken(uid: number, token: string) : Promise<boolean> {
    let user = await getUser(uid);
    if (token === user.verification_token) return !! await setUserVerification(uid, true);
    else throw new Error('Token is incorrect');
}

export enum SocialType { 'google_id' , 'facebook_id' , 'twitter_id', 'instagram_id' , 'github_id' , 'linkedin_id', 'telegram_id'}

export async function addSocialId(uid: number, type: SocialType , socialId: string ): Promise<User> {
    return User.query().patchAndFetchById(uid, {
        [SocialType[type]]: socialId
    })
}

export async function socialIdExists (type: SocialType , socialId: string): Promise<User> {
    const count: User[] = await User.query().where( `${SocialType[type]}` , socialId);
    if (count.length === 0) return undefined;
    else return count[0];
}

export async function getUsers(page: number, range: number): Promise<User[]> {
    await createUserScheme();
    if (page >= 0 && range) return (await User.query().withGraphFetched({
        interests: true, providers: true
    }).page(page, range)).results;
    else return User.query().withGraphFetched({
        interests: true, providers: true
    });
}

export async function getTelegramLinkedUsers(page: number = -1, range: number = 0) {
    await createUserScheme();
    if (page >= 0 && range) return (await User.query().whereNotNull('telegram_id').withGraphFetched({
        interests: true, providers: true
    }).page(page, range)).results;
    else return User.query().whereNotNull('telegram_id').withGraphFetched({
        interests: true, providers: true
    });
}

export async function makeUserAdmin(uid: number): Promise<boolean> {
    await createUserScheme();
    return await User.query().patch({'role': 4}).where('uid', uid) === 1
}

export async function isUsernameTaken(username: string): Promise<boolean> {
    await createUserScheme();
    const count: User[] = await User.query().where('username' , username);
    return count.length > 0;
}

export async function isEmailUsed(email: string): Promise<boolean> {
    await createUserScheme();
    const count: User[] = await User.query().where('email' , email);
    return count.length > 0
}

export async function getUsersByEmail(email: string): Promise<User[]> {
    await createUserScheme();
    const users: User[] = await User.query().where('email' , email);
    return users
}

export async function generateUsername(first_name: string, last_name: string): Promise<string> {
    const mash = first_name.toLowerCase() + '.' + last_name.toLowerCase();
    let addon = 1;
    while (await isUsernameTaken(`${mash}.${addon}`)) {
        addon++;
    }
    return `${mash}.${addon}`;
}

export async function generateEmail(first_name: string, last_name: string): Promise<string> {
    const mash = first_name.toLowerCase() + '.' + last_name.toLowerCase();
    let addon = 1;
    while (await isEmailUsed(`${mash}.${addon}@toe.app`)) addon++;
    return `${mash}.${addon}@toe.app`;
}

export async function verifyUser(token: string): Promise<User> {
    const verified = await verify(token, '0mE09M8N880CDhhJI$9808_369'); // shouldn't be hardcoded like this
    if (verified) {
        return getUser(verified.uid)
    }
}

export async function generateToken(user: User): Promise<string> {
    const token = await sign({ uid: user.uid } , '0mE09M8N880CDhhJI$9808_369'); // shouldn't be hardcoded like this
    return token;
}

export async function deleteUser(id: number): Promise<number> {
    await createUserScheme();
    return User.query().deleteById(id);
}

export async function updateUserById(id: number , update: User): Promise<User> {
    await createUserScheme();
    return User.query()
        .updateAndFetchById(id, update);
}

export async function signInUser(email: string, password: string): Promise<string> {
    await createUserScheme();
    const user = await User.query().first().where({ email });
    if (!user) throw new Error('user doesn\'t exist');
    const correct = await compare(password , user.password_hash);
    if (correct) {
        // change last_login_time
        await User.query().patch({ last_login_time: new Date().toUTCString() }).where('uid' , user.uid)
        return generateToken(user);
    }
    else throw new Error('email or password incorrect');
}

export async function signUpUser(
    first_name: string, middle_name: string, last_name: string,
    phone_number: string, username: string, country: string,
    email: string, password: string, google_id: string,
    facebook_id: string, twitter_id: string, github_id: string,
    linkedin_id: string, telegram_id: string): Promise<User> {

    return createUserScheme().then(async () => {
        if (!username) throw new Error('username is required')
        else if (await isUsernameTaken(username)) throw new Error('username already taken')

        if (!email) throw new Error('email is required')
        else if (await isEmailUsed(email)) throw new Error('email already used by someone else')

        if (!password) throw new Error('password is required')
        const hashed = await hash(password, 10)
        return insertUser({
            first_name, middle_name, last_name, phone_number, username, country,
            email, password_hash: hashed, google_id, facebook_id, twitter_id,
            github_id, linkedin_id, telegram_id })
    })

}
