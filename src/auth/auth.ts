import { Router } from "express";
import Passport  from './passport'

export const authRouter = Router();
authRouter.use(Passport.initialize());
authRouter.use(Passport.session());

authRouter.get('/google' , Passport.authenticate('google', {
    authType: 'rerequest', accessType: 'offline', prompt: 'consent', includeGrantedScopes: true,
    scope: ['profile' , 'email' , 'openid']}));

authRouter.get('/google/callback' , Passport.authenticate('google', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }),
    function(req, res) {
        res.status(200).send({
            auth: 'success',
            provider: 'google',
            message: 'You have logged in correctly'
        })
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

authRouter.get('/twitter/callback' , Passport.authenticate('twitter', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }),
    function(req, res) {
        res.status(200).send({
            auth: 'success',
            provider: 'twitter',
            message: 'You have logged in correctly'
        })
    }
);

authRouter.get('/github' , Passport.authenticate('github', { accessType: 'offline' }));

authRouter.get('/github/callback' , Passport.authenticate('github', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }),
    function(req, res) {
        res.status(200).send({
            auth: 'success',
            provider: 'github',
            message: 'You have logged in correctly'
        })
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

