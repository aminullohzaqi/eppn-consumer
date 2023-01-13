class Listener {
    constructor(mailSender) {
        this._mailSender = mailSender
        this.listen = this.listen.bind(this)
        this.listenDWHU = this.listenDWHU.bind(this)
    }
   
    async listen(message) {
        try {
            const { hostname, displayname, agentstatus, agentmessage, adminmail, lastcommunication } = JSON.parse(message.content.toString())
            const content = {
                hostname: hostname,
                displayname: displayname,
                agentstatus: agentstatus,
                agentmessage: agentmessage,
                adminmail: adminmail,
                lastcommunication: lastcommunication
            }
            const result = await this._mailSender.sendEmail(JSON.stringify(content))
            console.log(result)
        } catch (error) {
            console.error(error)
        }
    }

    async listenDWHU(message) {
        try {
            const { title, body, adminmail } = JSON.parse(message.content.toString())
            const content = {
                title: title,
                body: body,
                adminmail: adminmail
            }
            // const resultEmail = await this._mailSender.sendEmailDWHU(JSON.stringify(content))
            await this._mailSender.sendWhatsAppDWHU(body)
            // console.log(resultEmail)
            // console.log(resultWhatsApp)
            // console.log(JSON.stringify(content))
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = Listener
