const express = require('express')
const dotenv = require('dotenv').config()
const axios = require('axios')
const app = express()

// ROUTES
const places = require('./routes/places')


app.use('/api/places', places)



const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server listening on port: ${port}.`))