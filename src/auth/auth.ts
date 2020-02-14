import { Router } from "express";
import Passport  from './passport'

export const authRouter = Router();
authRouter.use(Passport.initialize());

authRouter.get('/google' , Passport.authenticate('google', {
    authType: 'rerequest', accessType: 'offline', prompt: 'consent', includeGrantedScopes: true,
    scope: ['profile' , 'email' , 'openid']}));

authRouter.get('/google/callback' , Passport.authenticate('google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
    }),
    function(req, res) {
        res.status(200).send({
            auth: 'success',
            provider: 'google',
            message: 'You have logged in correctly'
        })
    }
);

authRouter.get('/google/success' , (req , res) => {
    res.status(200).send({
        auth: 'success',
        provider: 'google',
        message: 'You have logged in correctly'
    })
});

authRouter.get('/google/failure' , (req , res) => {
    res.status(401).send({
        auth: 'failure',
        provider: 'google',
        message: 'You are not logged in'
    })
});

