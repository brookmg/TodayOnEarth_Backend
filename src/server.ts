import {authRouter} from "./auth/auth";

const express =  require('express');
const json = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
import { Router } from './queue/arena'
import {server, UserHandler} from './graphql/gql'

const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors());
app.use(json());

app.use(Router);
app.use(cookieParser());

app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.get('/' , (req, res) => { res.send({ message: 'Hello' }) });
app.use('/auth' , authRouter);

export function start() {
    server.applyMiddleware({ app });
    app.listen(process.env.PORT, () => {
        console.log(`We are live at ${process.env.HOST}:${process.env.PORT}/`)
    })
}