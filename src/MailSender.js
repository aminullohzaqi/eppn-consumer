require('dotenv').config()
const nodemailer = require('nodemailer')
const mailTemplate = require('./mail')
const Whatsapp = require('./whatsapp')

class MailSender {
    constructor() {
        this._transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    sendEmail(content) {

        const { hostname, displayname, agentstatus, agentmessage, lastcommunication, adminmail } = JSON.parse(content)

        const message = {
            from: 'sbdu@bmkg.go.id',
            to: [adminmail],  //process.env.ADMINMAIL1, process.env.ADMINMAIL2],
            subject: 'End Point Protection Status',
            html: mailTemplate(hostname, displayname, agentstatus, agentmessage, lastcommunication)
        }
     
        return this._transporter.sendMail(message)
    }

    sendEmailDWHU(content) {

        const { title, body, adminmail } = JSON.parse(content)

        const message = {
            from: 'sbdu@bmkg.go.id',
            to: [adminmail],  //process.env.ADMINMAIL1, process.env.ADMINMAIL2],
            subject: title,
            text: body
        }
     
        return this._transporter.sendMail(message)
    }

    sendWhatsAppDWHU(body){
        return(
            Whatsapp.whatsappReady()
        )
    }
}

module.exports = MailSender
