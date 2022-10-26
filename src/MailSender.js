require('dotenv').config()
const nodemailer = require('nodemailer')
const mailTemplate = require('./mail')
 
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
            from: 'sbdu@bmkg.go.ig',
            to: [adminmail, 'aminulloh.zaqi@bmkg.go.id'],  //process.env.ADMINMAIL1, process.env.ADMINMAIL2],
            subject: 'End Point Protection Status',
            html: mailTemplate(hostname, displayname, agentstatus, agentmessage, lastcommunication)
        }
     
        return this._transporter.sendMail(message)
    }
}

module.exports = MailSender
