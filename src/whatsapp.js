const qrcode = require('qrcode-terminal')
const { Client, LocalAuth, NoAuth } = require('whatsapp-web.js')
const DatabaseService = require('./DatabaseService')
const fs = require('fs')

const databaseService = new DatabaseService()

const client = new Client({
    authStrategy: new LocalAuth()
})

function whatsappInit() {
    client.on('qr', (qr) => {
        qrcode.generate(qr, {small: true})
    })
    
    whatsappReady()
    whatsappMessage()
}

function whatsappReady() {
    client.initialize()

    client.on('ready', () => {
        console.log('Client is ready!')
    
        const number = "+6281584679688"
        const text = "WA Bot is Ready"
    
        const chatId = number.substring(1) + "@c.us"
    
        client.sendMessage(chatId, text)
    })
}

function whatsappMessage() {
    client.on('message', async message => {
        if(message.body === '!ping') {
            client.sendMessage(message.from, 'pong')
        } 
        else if(message.body === '--eppserver') {
            const rowDb = await databaseService.getServers()
            let textMessage = '*Server Status* \n\n'
            for (let i = 0; i < (rowDb.length); i++) {
                let { hostname, displayname, agentstatus } = rowDb[i]
                textMessage = textMessage + 'Server Name : ' + displayname + '\n'
                textMessage = textMessage + 'IP Server : ' + hostname + '\n'
                textMessage = textMessage + 'Agent Status : ' + agentstatus + '\n\n'
            }
            await client.sendMessage(message.from, textMessage)
        } 
        else if(message.body === '--eppadmin') {
            const rowDb = await databaseService.getAdminServers()
            let textMessage = '*Server Admin* \n\n'
            for (let i = 0; i < (rowDb.length); i++) {
                let { displayname, adminname, email, whatsapp } = rowDb[i]
                textMessage = textMessage + 'Server Name : ' + displayname + '\n'
                textMessage = textMessage + 'Admin Name : ' + adminname + '\n'
                textMessage = textMessage + 'Admin Email : ' + email + '\n'
                textMessage = textMessage + 'Admin Whatsapp : ' + whatsapp + '\n\n'
            }
            await client.sendMessage(message.from, textMessage)
        }
        else if(message.body.indexOf('--epp/') > -1) {
            const splitMessage = message.body.split('/')
            const rowDb = await databaseService.getDetailServer(splitMessage[1])
            let textMessage = '*Server Admin* \n\n'
            for (let i = 0; i < (rowDb.length); i++) {
                let { displayname, hostname, agentstatus, agentmessage, adminname, email, whatsapp } = rowDb[i]
                textMessage = textMessage + 'Server Name : ' + displayname + '\n'
                textMessage = textMessage + 'Server IP : ' + hostname + '\n'
                textMessage = textMessage + 'Agent Status : ' + agentstatus + '\n'
                textMessage = textMessage + 'Agent Message : ' + agentmessage + '\n'
                textMessage = textMessage + 'Admin Name : ' + adminname + '\n'
                textMessage = textMessage + 'Admin Email : ' + email + '\n'
                textMessage = textMessage + 'Admin Whatsapp : ' + whatsapp
            }
            await client.sendMessage(message.from, textMessage)
        }
        else if(message.body === 'rani') {
            client.sendMessage(message.from, 'love youu......')
        } 
        else {
            let textMessage = '*Hai, saya bot*\n'
            textMessage = textMessage + 'Berikut adalah daftar command yang dapat digunakan:\n'
            textMessage = textMessage + '--eppserver \n'
            textMessage = textMessage + '--eppadmin \n'
            textMessage = textMessage + '--epp/{{ipserver}} \n'
            await client.sendMessage(message.from, textMessage)
        }
    })
}

module.exports = { whatsappInit }