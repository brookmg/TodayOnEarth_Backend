import Passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Strategy as GithubStrategy } from 'passport-github2'
import { isUsernameTaken } from '../db/user_table'

Passport.use(new GoogleStrategy({
        clientID: '00',   // 266033008053-06q(MORE).apps.googleusercontent.com
        clientSecret: '00', // eEriCU9KEX(MORE)
        callbackURL: "http://localhost:3400/auth/google/callback"
    }, (accessToken , refreshToken, profile, done) => {
        console.log(`${accessToken} -> access token`);
        console.log(`${refreshToken} -> refresh token`);

        // Store user's token in the db but with more security.
        done(false, {strategy: 'google' , accessToken , refreshToken , ...profile});

        if (profile.email) {
            isUsernameTaken(profile.email).then(result => {
                if (result) {

                }
            })
        }
    })
);

Passport.use(new FacebookStrategy({
        clientID: '192546__',   // 266033008053-06q(MORE).apps.googleusercontent.com
        clientSecret: '4d23c218dc4917462__', // eEriCU9KEX(MORE)
        callbackURL: "http://localhost:3400/auth/facebook/callback",
        graphAPIVersion: 'v6.0',
        enableProof: true
    }, (accessToken , refreshToken, profile, done) => {
        console.log(`${accessToken} -> access token`);
        console.log(`${refreshToken} -> refresh token`);

        // Store user's token in the db but with more security.
        done(false, {strategy: 'facebook' , accessToken , refreshToken , ...profile});

    })
);

Passport.use(new TwitterStrategy({
        consumerKey: '2yvX9O66lTAiEgXmSK4tThozA',   // 266033008053-06q(MORE).apps.googleusercontent.com
        consumerSecret: 'ZDvX2naOdBzUohKsH3MH29cHrGZVXt0nWeYEuYQgACfeMHUz4s', // eEriCU9KEX(MORE)
        callbackURL: "http://localhost:3400/auth/twitter/callback",
    }, (accessToken , refreshToken, profile, done) => {
        console.log(`${accessToken} -> access token`);
        console.log(`${refreshToken} -> refresh token`);

        // Store user's token in the db but with more security.
        done(false, {strategy: 'twitter' , accessToken , refreshToken , ...profile});

    })
);

Passport.use(new GithubStrategy({
        clientID: '--',
        clientSecret: '--',
        callbackURL: "http://localhost:3400/auth/github/callback",
    }, (accessToken , refreshToken, profile, done) => {
        console.log(`${accessToken} -> access token`);
        console.log(`${refreshToken} -> refresh token`);

        // Store user's token in the db but with more security.
        done(false, {strategy: 'github' , accessToken , refreshToken , ...profile});

    })
);


Passport.serializeUser(function(user, done) {
    done(null, user);
});

Passport.deserializeUser(function(user, done) {
    done(null, user);
});

export default Passport