import {Login} from '../model/login'
import {KnexI} from "./db";
import {getUser, getUsersByEmail, updateUserById} from "./user_table";
import {randomBytes} from "crypto";
import {sendEmail} from "../queue/queue";
import { hash , compare } from 'bcrypt'

Login.knex(KnexI);

export async function createLoginSchema() : Promise<any> {
    if (await KnexI.schema.hasTable('login')) return null; // We don't need to create it again

    return KnexI.schema.createTable('login', table => {
        table.increments('login_id').primary();

        table.string('token');
        table.integer('uid');
        table.integer('type');

        table.dateTime('access_time');
        table.string('request_detail');
    })

}

export async function isPasswordResetTokenValid(token: string) : Promise<boolean> {
    await createLoginSchema();
    return (await Login.query().where({ token })).length > 0
}

export async function passwordResetRequested(forEmail: string) : Promise<boolean> {
    await createLoginSchema();

    if (forEmail.indexOf('@toe.app') === -1) {
        let user: any = await getUsersByEmail(forEmail);
        if (!user || user.length == 0) throw new Error('User doesn\'t exist');

        let generateToken = (await randomBytes(48)).toString('hex');
        let callBackUrl = `${process.env.HOST}/password_reset?token=${generateToken}`;

        await Login.query().insert(<any>{
            token: generateToken,
            uid: user.uid,
            type: 1,
            access_time: new Date().toUTCString(),
            request_detail: 'UNKNOWN'   // for the time being
        });

        let genericEmail = `
            <h1> Hello, ${user.first_name} </h1>
            <h3> A password reset has been requested </h3>
            <br>
            
            <p> 
                Somebody just requested a password reset around the time ${new Date().toUTCString()}. If this was you please 
                click on <a href="${callBackUrl}"> this </a> in your browser. If you are not using a browser, 
                copy and paste <code>${callBackUrl}</code> into one.
            </p>
             
            <p style="padding: 2%; margin: 0.22%; background: #c32a2acc; color: white">
                Please ignore this message if it's not you who requested the password reset. Somebody might be trying to access 
                your account for some bizarre reason. 
            </p>  
            
            <h4> Thanks for being our user. </h4>
            <b><h4>Today On Earth [support@toe.app]</h4></b>
            `;

        return !!await sendEmail({ email: user.email, subject: 'Password Reset', html: genericEmail })
    }
}

export async function resetPasswordWithToken(token: string, newPassword: string) : Promise<boolean>{
    await createLoginSchema();

    const { uid } = <any>(await Login.query().where({token}))[0];
    if (uid) {
        if (compare(newPassword , (await getUser(uid)).password_hash))
            throw new Error('Password is already in use by user.');
        else {
            return !!await updateUserById(uid, { password_hash: await hash(newPassword, 10) })
        }
    } else {
        throw new Error('Invalid token')
    }
}
