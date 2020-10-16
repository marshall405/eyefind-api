const express = require('express')
const https = require('https')

const dotenv = require('dotenv').config()
const axios = require('axios')
const app = express()

// ROUTES

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ACCEPT_URL)
    next()
})
const places = require('./routes/places')


app.use('/api/places', places)

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server listening on port: ${port}.`))