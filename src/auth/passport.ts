import Passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Strategy as GithubStrategy } from 'passport-github2'
import { isUsernameTaken } from '../db/user_table'

const dotenv = require('dotenv');
dotenv.config();

Passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
        clientID: process.env.FACEBOOK_CLIENT_ID,   // 266033008053-06q(MORE).apps.googleusercontent.com
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET, // eEriCU9KEX(MORE)
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
        consumerKey: process.env.TWITTER_CONSUMER_ID,   // 266033008053-06q(MORE).apps.googleusercontent.com
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET, // eEriCU9KEX(MORE)
        callbackURL: "http://localhost:3400/auth/twitter/callback",
    }, (accessToken , refreshToken, profile, done) => {
        console.log(`${accessToken} -> access token`);
        console.log(`${refreshToken} -> refresh token`);

        // Store user's token in the db but with more security.
        done(false, {strategy: 'twitter' , accessToken , refreshToken , ...profile});

    })
);

Passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
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