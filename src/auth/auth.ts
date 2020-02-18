import { Router } from "express";
import Passport  from './passport'

export const authRouter = Router();
require('dotenv').config();

authRouter.use(Passport.initialize());
authRouter.use(Passport.session());

let redirectionHandlerMiddleware = (req, res, err: string, data: any) => {
    if (err) {
        res.redirect(`${process.env.GATSBY_HOST}:${process.env.GATSBY_PORT}/auth_error?error=${err}`);
    } else {
        if (data.potential_user) res.redirect(`${process.env.GATSBY_HOST}:${process.env.GATSBY_PORT}/signup?data=${encodeURI(JSON.stringify(data))}`);
        else if (data.token) {
            let time = new Date().getTime() + (7 * 24 * 3600 * 1000);   // one week
            res.cookie('token', data.token , {expires: new Date(time)});
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
    authType: 'rerequest', accessType: 'offline', prompt: 'consent', scope: ['email' , 'public_profile', 'user_age_range', 'user_gender']}));

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
