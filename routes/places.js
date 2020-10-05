const router = require('express').Router()
const https = require('https')

const dotenv = require('dotenv').config()

router.get('/:id', (req, res) => {
    https.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.params.id}&key=${process.env.PLACES_API}`, r => {
        let data = ''
        r.on('data', d => {
            data += d.toString()
        })
        r.on('end', () => {
            res.setHeader('Access-Control-Allow-Origin', process.env.ACCEPT_URL)
            res.send(data)
        })
    })
})

router.get('/', async (req, res) => {
    let { lat, lng, type } = req.query || { lat: '30.2672', lng: '97.7431', type: 'restaurant' }
    https.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=24000&type=${type}&key=${process.env.PLACES_API}`, r => {
        let data = ''
        r.on('data', (d) => {
            data += `${d}`
        })
        r.on('end', () => {
            const parsedData = JSON.parse(data)
            const getImgLocation = async result => {
                if (result.photos) {

                    return new Promise(resolve => {
                        https.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=${result.photos[0].photo_reference}&key=${process.env.PLACES_API}`, r => {
                            result.img_src = r.headers.location
                            return resolve(result)
                        })
                    })
                } else {
                    return result
                }
            }

            const resData = async () => {
                return Promise.all(parsedData.results.map(async result => await getImgLocation(result)))
            }

            resData().then(data => {
                res.setHeader('Access-Control-Allow-Origin', process.env.ACCEPT_URL)
                res.send(data)
            })
        })
    })

})

router.get('/img/:photo_reference', (req, res) => {

    https.get(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=${req.params.photo_reference}&key=${process.env.PLACES_API}`, r => {
        res.setHeader('Access-Control-Allow-Origin', process.env.ACCEPT_URL)
        res.send(r.headers['location'])
    })
})




module.exports = router