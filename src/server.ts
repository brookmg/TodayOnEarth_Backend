import {authRouter} from "./auth/auth";

const express =  require('express');
const json = require('body-parser');
const cors = require('cors');
import { Router } from './queue/arena'

const app = express();

app.use(cors());
app.use(json());

app.use(Router);
app.get('/' , (req, res) => { res.send({ message: 'Hello' }) });
app.use('/auth' , authRouter);

export function start() {
    app.listen(3400, () => {
        console.log(`We are live at http://localhost:3400/`)
    })
}