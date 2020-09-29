const express = require('express')
const https = require('https')
const dotenv = require('dotenv').config()
const axios = require('axios')
const app = express()


app.get('/api/places', async (req, res) => {
    let { lat, lng, type } = req.query || { lat: '30.2672', lng: '97.7431', type: 'restaurant' }
    https.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=24000&type=${type}&key=${process.env.PLACES_API}`, r => {
        let data = ''
        r.on('data', (d) => {
            data += `${d}`
        })
        r.on('end', () => {
            const parsedData = JSON.parse(data)

            const getImgLocation = async result => {
                return new Promise(resolve => {
                    https.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=${result.photos[0].photo_reference}&key=${process.env.PLACES_API}`, r => {
                        result.img_src = r.headers.location
                        return resolve(result)
                    })
                })
            }

            const resData = async () => {
                return Promise.all(parsedData.results.map(async result => await getImgLocation(result)))
            }

            resData().then(data => {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send(data)
            })
        })
    })

})

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server listening on port: ${port}.`))