const qrcode = require('qrcode-terminal')
const { Client, LocalAuth, NoAuth } = require('whatsapp-web.js')
const { Configuration, OpenAIApi } = require('openai')
const DatabaseService = require('./DatabaseService')
const DatabaseDWService = require('./DatabaseDWService')

const databaseService = new DatabaseService()
const databaseDWService = new DatabaseDWService()

const client = new Client({
    authStrategy: new LocalAuth()
})

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
  
const openai = new OpenAIApi(configuration);

if (!configuration.apiKey) {
    console.log('Api Key is Invalid')
}

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
        else if(message.body === '--dwhu') {
            const rowDb = await databaseDWService.getLastUpdate()
            let textMessage = '*Last Update* \n\n'
            for (let i = 0; i < (rowDb.length); i++) {
                let { 
                    tanggal_dan_waktu, 
                    tipe, 
                    status, 
                    row_fakta_mutasi,
                    row_fakta_dapat_disekolahkan, 
                    row_fakta_hukuman,
                    row_fakta_ijin_belajar,
                    row_fakta_kepala_satker,
                    row_fakta_naik_pangkat,
                    row_fakta_penghargaan,
                    row_fakta_series
                } = rowDb[i]
                textMessage = textMessage + 'Tanggal : ' + tanggal_dan_waktu + '\n'
                textMessage = textMessage + 'Tipe : ' + tipe + '\n'
                textMessage = textMessage + 'Status : ' + status + '\n\n'
                textMessage = textMessage + '*Total Rows* \n\n'
                textMessage = textMessage + 'Total Row Fakta Mutasi : ' + row_fakta_mutasi + '\n'
                textMessage = textMessage + 'Total Row Fakta Dapat Disekolahkan : ' + row_fakta_dapat_disekolahkan + '\n'
                textMessage = textMessage + 'Total Row Fakta Hukuman : ' + row_fakta_hukuman + '\n'
                textMessage = textMessage + 'Total Row Fakta Izin Belajar : ' + row_fakta_ijin_belajar + '\n'
                textMessage = textMessage + 'Total Row Fakta Kepala Satker : ' + row_fakta_kepala_satker + '\n'
                textMessage = textMessage + 'Total Row Fakta Naik Pangkat : ' + row_fakta_naik_pangkat + '\n'
                textMessage = textMessage + 'Total Row Fakta Penghargaan : ' + row_fakta_penghargaan + '\n'
                textMessage = textMessage + 'Total Row Fakta Series : ' + row_fakta_series + '\n' 
            }
            client.sendMessage(message.from, textMessage)
        } 
        else if(message.body === 'rani') {
            client.sendMessage(message.from, 'love youu......')
        } 
        else if(message.body.indexOf('command') > -1) {
            let textMessage
            textMessage = 'Berikut adalah daftar command yang dapat digunakan:\n'
            textMessage = textMessage + '--eppserver \n'
            textMessage = textMessage + '--eppadmin \n'
            textMessage = textMessage + '--epp/{{ipserver}} \n'
            textMessage = textMessage + '--dwhu'
            await client.sendMessage(message.from, textMessage)
        }
        else {
            try {
                const completion = await openai.createCompletion({
                    model: "text-ada-001",
                    prompt: message.body,
                    temperature: 0.6,
                    max_tokens: 100
                });
                let textMessage = completion.data.choices[0].text
                await client.sendMessage(message.from, textMessage.trim())
            } catch(error) {
                if (error.response) {
                    console.error(error.response.status, error.response.data);
                } else {
                    console.error(`Error with OpenAI API request: ${error.message}`);
                }
            }
        }
    })
}

module.exports = { whatsappInit }