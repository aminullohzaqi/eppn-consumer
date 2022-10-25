class Listener {
    constructor(mailSender) {
        this._mailSender = mailSender
        this.listen = this.listen.bind(this)
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
}

module.exports = Listener
