import { authRouter } from "./auth/auth";

const express = require('express');
const json = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
import { Router } from './queue/arena'
import { server } from './graphql/gql'

const dotenv = require('dotenv');
dotenv.config();

const app = express();

const whitelist = [
    `${process.env.GATSBY_HOST}:${process.env.GATSBY_PORT}`,
    `${process.env.HOST}:${process.env.PORT}`
]
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions));
app.use(json());

app.use(Router);
app.use(cookieParser());

app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.get('/', (req, res) => { res.send({ message: 'Hello' }) });
app.use('/auth', authRouter);

export function start() {
    server.applyMiddleware({ app, cors: corsOptions });
    app.listen(process.env.PORT, () => {
        console.log(`We are live at ${process.env.HOST}:${process.env.PORT}/`)
    })
}