import Passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { isUsernameTaken } from '../db/user_table'

Passport.use(new GoogleStrategy({
        clientID: '',   // 266033008053-06q(MORE).apps.googleusercontent.com
        clientSecret: '', // eEriCU9KEX(MORE)
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

Passport.serializeUser(function(user, done) {
    done(null, user);
});

Passport.deserializeUser(function(user, done) {
    done(null, user);
});

export default Passport