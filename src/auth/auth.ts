import { Router } from "express";
import Passport  from './passport'
import {addSocialId, generateToken, generateUsername, socialIdExists, SocialType, verifyUser} from "../db/user_table";
const TGLogin = require('node-telegram-login');

export const authRouter = Router();
require('dotenv').config();

authRouter.use(Passport.initialize());
authRouter.use(Passport.session());

const TelegramLogin = new TGLogin(process.env.TELEGRAM_BOT_TOKEN);

let redirectionHandlerMiddleware = (req, res, err: string, data: any) => {
    if (err) {
        res.redirect(`${process.env.GATSBY_HOST}:${process.env.GATSBY_PORT}/auth_error?error=${err}`);
    } else {
        if (data.potential_user) res.redirect(`${process.env.GATSBY_HOST}:${process.env.GATSBY_PORT}/signup?data=${encodeURI(JSON.stringify(data))}`);
        else if (data.token) {
            let time = new Date().getTime() + (process.env.USER_SESSION_EXPIRES_AFTER);   // one week
            res.cookie('userId', data.token , {expires: new Date(time)});
            res.redirect(`${process.env.GATSBY_HOST}:${process.env.GATSBY_PORT}/signin`);
        }
        else {res.redirect(`${process.env.GATSBY_HOST}:${process.env.GATSBY_PORT}/auth_error?error=${encodeURI('Unknown operation')}`)}
    }
};

authRouter.get('/google' , Passport.authenticate('google', {
    authType: 'rerequest', accessType: 'offline', prompt: 'consent', includeGrantedScopes: true,
    scope: ['profile' , 'email' , 'openid']}));

authRouter.get('/google/callback' , function (req, res) {
        Passport.authenticate('google', (err, data) => {
            redirectionHandlerMiddleware(req, res, err, data)
        })(req,res);
    }
);

authRouter.get('/facebook' , Passport.authenticate('facebook', {
    authType: 'rerequest', accessType: 'offline', prompt: 'consent', scope: ['email' , 'public_profile', 'user_age_range', 'user_gender', 'manage_pages', 'publish_pages']}));

authRouter.get('/facebook/callback' , function(req, res, next) {
        Passport.authenticate('facebook', function (err, data) {
            redirectionHandlerMiddleware(req, res, err, data)
        })(req, res, next)
    }
);

authRouter.get('/twitter' , Passport.authenticate('twitter'));

authRouter.get('/twitter/callback' ,
    function (req, res) {
        Passport.authenticate('twitter', (err, data) => {
            redirectionHandlerMiddleware(req, res, err, data);
        })(req,res);
    }
);

authRouter.get('/github' , Passport.authenticate('github', { accessType: 'offline' }));

authRouter.get('/github/callback' ,
    function (req, res) {
        Passport.authenticate('github', (err, data) => {
            redirectionHandlerMiddleware(req, res, err, data)
        })(req,res);
    }
);

authRouter.get('/linkedin' , Passport.authenticate('linkedin', { accessType: 'offline' }));

authRouter.get('/linkedin/callback' ,
    function (req, res) {
        Passport.authenticate('linkedin', (err, data) => {
            redirectionHandlerMiddleware(req, res, err, data)
        })(req,res);
    }
);

authRouter.get('/telegram/callback' , TelegramLogin.defaultMiddleware(), async (req, res) => {
    function done(err, data: object = {}) { redirectionHandlerMiddleware(req,res,err,data) }

    if (res.locals.telegram_user) {
        let profile = res.locals.telegram_user;

        let result = req.cookies.userId;
        let clientIdExists = await socialIdExists(SocialType.telegram_id, profile.id);

        if (result && !clientIdExists) {
            // we have a user ... just modify the token table

            let user = await verifyUser(result);
            let addSocial = await addSocialId(user.uid , SocialType.telegram_id , profile.id);

            done(null,{
                token: await generateToken(user)
            });
        } else if (clientIdExists) {
            if (result && (await verifyUser(result)).uid !== clientIdExists.uid) {
                return done('This social account is liked with someone else')
            }

            return done(null, {
                token: await generateToken(clientIdExists)
            });
        } else {
            // new user, so send it to the front-end to get more info

            let { first_name , last_name } = profile;

            done(null, {
                potential_user: {
                    first_name: first_name,
                    middle_name: undefined,
                    last_name: last_name || '.telegram',
                    email: `${first_name}.${last_name}.${profile.id.substring(0,4)}@toe.app`,
                    username: await generateUsername(first_name, last_name || 'tg'),
                    telegram_id: profile.id
                }
            });
        }
    }
});
