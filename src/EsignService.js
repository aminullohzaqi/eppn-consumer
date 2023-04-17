/* eslint-disable indent */
require('dotenv').config()
const fetch = require('node-fetch')
const https = require('https')

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
})

class EsignApiService {
    constructor () {
        this.url_opr = process.env.URL_OPR
        this.url_qr = process.env.URL_QR
        this.url_dev = process.env.URL_DEV

    }

    async getDataStatusCode (type) {
        let response
        if (type === "eSIGN Operasional") {
            response = await fetch(this.url_opr, {
                method: 'get'
            })
        } else if (type === "BMKG QR Code Generator") {
            response = await fetch(this.url_qr, {
                method: 'get'
            })
        } else if (type === "eSIGN Development") {
            response = await fetch(this.url_dev, {
                method: 'get'
            })
        }
        const status = await response.status

        return status
    }
}

module.exports = EsignApiService
