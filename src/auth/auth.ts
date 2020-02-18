import { Router } from "express";
import Passport  from './passport'

export const authRouter = Router();
require('dotenv').config();

authRouter.use(Passport.initialize());
authRouter.use(Passport.session());

authRouter.get('/google' , Passport.authenticate('google', {
    authType: 'rerequest', accessType: 'offline', prompt: 'consent', includeGrantedScopes: true,
    scope: ['profile' , 'email' , 'openid']}));

authRouter.get('/google/callback' , function (req, res) {
        Passport.authenticate('google', (err, data, info) => {
            if (err) {
                res.status(401).send({
                    auth: 'error',
                    provider: 'google',
                    message: `${err}`
                })
            } else {
                res.status(200).send({
                    auth: 'success',
                    provider: 'google',
                    data
                })
            }
        })(req,res);
    }
);

authRouter.get('/facebook' , Passport.authenticate('facebook', {
    authType: 'rerequest', accessType: 'offline', prompt: 'consent', scope: ['email' , 'public_profile', 'user_age_range', 'user_gender']}));

authRouter.get('/facebook/callback' , function(req, res, next) {
        Passport.authenticate('facebook', function (err, data, info) {
            // error happened so redirect to /failure
            res.locals._err = err;
            res.locals._data = data;
            res.locals._info = info;
            next()
        })(req, res, next)
    },
    function(req, res) {
        if (res.locals._err) {
            res.status(401).send({
                auth: 'error',
                provider: 'facebook',
                message: `${res.locals._err}`
            })
        } else {
            res.status(200).send({
                auth: 'success',
                provider: 'facebook',
                data: res.locals._data
            })
        }
    }
);

authRouter.get('/twitter' , Passport.authenticate('twitter'));

authRouter.get('/twitter/callback' ,
    function (req, res) {
        Passport.authenticate('twitter', (err, data, info) => {
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
        })(req,res);
    }
);

authRouter.get('/github' , Passport.authenticate('github', { accessType: 'offline' }));

authRouter.get('/github/callback' ,
    function (req, res) {
        Passport.authenticate('github', (err, data, info) => {
            if (err) {
                res.status(401).send({
                    auth: 'error',
                    provider: 'github',
                    message: `${err}`
                })
            } else {
                res.status(200).send({
                    auth: 'success',
                    provider: 'github',
                    data
                })
            }
        })(req,res);
    }
);

authRouter.get('/success' , (req , res) => {
    res.status(200).send({
        auth: 'success',
        message: 'You have logged in correctly'
    })
});

authRouter.get('/failure' , (req , res) => {
    res.status(401).send({
        auth: 'failure',
        message: 'You are not logged in'
    })
});

