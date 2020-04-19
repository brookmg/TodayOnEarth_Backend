import { authRouter } from "./auth/auth";
const http = require('http');

const express = require('express');
const json = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
import { Router } from './queue/arena'
import { server } from './graphql/gql'
import {verifyUser, verifyUserEmailWithToken} from "./db/user_table";
import { Bot } from "./bot/bot";

const dotenv = require('dotenv');
dotenv.config();

const app = express();

// CORS whitelist
const whitelist = [
    `${process.env.GATSBY_HOST}:${process.env.GATSBY_PORT}`,
    `${process.env.HOST}:${process.env.PORT}`,
    `^(https?://(?:.+\\.)?netlify\\.com(?::\\d{1,5})?)$`,
    `^(https?://(?:.+\\.)?netlify\\.app(?::\\d{1,5})?)$`,
    `https://todayonearth.netlify.com`,
    `http://todayonearth.netlify.com`,
    `https://todayonearth.netlify.app`,
    `http://todayonearth.netlify.app`,
    `https://toeapi.herokuapp.com`,
    `http://toeapi.herokuapp.com`
];

const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};

app.use(cors(corsOptions));
app.use(json());

app.use(Router);
app.use(cookieParser());

app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.get('/', (req, res) => { res.send({ message: 'Hello' }) }); // dummy to test

// Endpoint for verifying email address
app.get('/email_verify' , async (req, res) => {
    let token = req.query.token;
    if (!token) res.redirect(`${process.env.GATSBY_HOST}:${process.env.GATSBY_PORT}/auth_error?error=Invalid%20token`);

    if (!req.cookies.userId) res.redirect(`${process.env.GATSBY_HOST}:${process.env.GATSBY_PORT}/auth_error?error=Login%20first`);
    let user = await verifyUser(req.cookies.userId);

    verifyUserEmailWithToken(user.uid, token).then(v => {
        res.redirect(`${process.env.GATSBY_HOST}:${process.env.GATSBY_PORT}/signin?reason=Email%20verified`);
    }).catch(err => {
        res.redirect(`${process.env.GATSBY_HOST}:${process.env.GATSBY_PORT}/auth_error?error=${err.toString()}`);
    })
});

app.use('/auth', authRouter);

app.use(Bot.webhookCallback('/ef5f7569fb2fb7d584b8c5ee6d4c89726e56d7d80d19548cfd3e87524a6c244b')); // SHA256(`TodayOnEarthBotTelegramSecretLink`)
//todo This should be uncommented once deployment is done.
//Bot.telegram.setWebhook(`${process.env.HOST}:${process.env.PORT}/ef5f7569fb2fb7d584b8c5ee6d4c89726e56d7d80d19548cfd3e87524a6c244b`).then();

export function start() {
    server.applyMiddleware({ app, cors: corsOptions });
    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);

    Bot.launch().then(r => console.dir(r)).catch(err => console.dir(err));
    httpServer.listen(process.env.PORT, () => {
        console.log(`🚀 GQL is 🔴 at ${process.env.HOST}:${process.env.PORT}${server.graphqlPath}`);
        console.log(`🚀 GQL Subscriptions are 🔴 at ${process.env.HOST}:${process.env.PORT}${server.subscriptionsPath}`);
    })
}
