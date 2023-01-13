require('dotenv').config()
const { Pool } = require('pg')

class DatabaseService {
    constructor () {
        this.pool = new Pool({
            host: process.env.PGHOST,
            user: process.env.PGUSER,
            post: process.env.PGPORT,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            idleTimeoutMillis: 100
        })
    }

    async getServers () {
        const result = await this.pool.query('SELECT server.hostname, server.displayname, server.agentstatus, server.servergroup FROM server ORDER BY server.servergroup')

        return result.rows
    }

    async getAdminServers () {
        const result = await this.pool.query('SELECT server.displayname, admin.adminname, admin.email, admin.whatsapp FROM server INNER JOIN admin ON server.admin = admin.admin_id')

        return result.rows
    }

    async getDetailServer (ip) {
        const query = {
            text: 'SELECT server.displayname, server.hostname, server.agentstatus, server.agentmessage, admin.adminname, admin.email, admin.whatsapp FROM server INNER JOIN admin ON server.admin = admin.admin_id WHERE server.hostname = $1',
            values: [ip]
        }
        const result = await this.pool.query(query)

        return result.rows
    }

    // async updateAgentStatusServer (agentstatus, agentmessage, hostname, statusupdate) {
    //     const query = {
    //         text: 'UPDATE server SET agentstatus = $1, agentmessage = $2, statusupdate = $3 WHERE hostname = $4',
    //         values: [agentstatus, agentmessage, statusupdate, hostname]
    //     }
    //     const result = await this.pool.query(query)
    //     console.log(`hostname ${hostname} agentstatus has been successfully updated`)

    //     return result
    // }

    // async insertLog (serverId, agentstatus, agentmessage, statusupdate) {
    //     const id = `log-${statusupdate}`

    //     const query = {
    //         text: 'INSERT INTO log VALUES ($1, $2, $3, $4, $5)',
    //         values: [id, serverId, agentstatus, agentmessage, statusupdate]
    //     }
    //     const result = await this.pool.query(query)

    //     return result
    // }
}

module.exports = DatabaseService
