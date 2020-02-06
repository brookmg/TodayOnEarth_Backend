const express =  require('express')
const json = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(json())
app.get('/' , (req, res) => { res.send({ message: 'Hello' }) })

export function start() {
    app.listen(3400, () => {
        console.log(`We are live at http://localhost:3400/`)
    })
}