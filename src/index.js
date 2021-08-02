const dotenv = require('dotenv')
const fetch = require('node-fetch')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// Load ENV data
dotenv.config()

const PORT = process.env.SERVER_PORT || 3000
const APPN = process.env.SERVER_APPN || '/'

const API_HOST = process.env.API_HOST || "http://localhost:4000"
const API_TOKEN = process.env.API_TOKEN || "_your_token_"

// Server started
app.listen(PORT, () => {
    console.log(`API is listening on PORT : [${PORT}]`)
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    console.log("#", req.protocol + '://' + req.get('host') + req.originalUrl)
    next()
})

app.use(bodyParser.json())

// Retrive Inivitaion Link
let options = {
    method: 'POST',
    withCredentials: true,
    credentials: 'include',
    headers: {
        'X-API-KEY': API_TOKEN,
        'Content-Type': 'application/json'
    }
}

function callback(error, response, body) {
    const info = JSON.parse(body)
    console.log("RESULT", info)
}

/**
 * ----------------------------------------------
 * API Routes
 * ----------------------------------------------
 */

// Default Route
app.get(`${APPN}`, (req, res) => {
    
    fetch(`${API_HOST}/connections/create-invitation`, options)
    .then(result => result.json()).catch(err => console.log(err)).then(jsonData => {
        res.status(200)
        res.setHeader('Content-Type', 'application/json')
        return res.send(jsonData)
    })
    .catch(err => {
        res.status(400)
        res.setHeader('Content-Type', 'text/html')
        return res.send(`FAILED: `, err)
    })
})

// Deliver SSH URL over API
app.get(`${APPN}special`, (req, res) => {
    res.status(200)
    res.setHeader('Content-Type', 'text/html')

    ssh_string = "SPECIAL"

    return res.send(`${ssh_string}`)
})