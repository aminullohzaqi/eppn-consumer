require('dotenv').config()
const { Pool } = require('pg')

class DatabaseDWService {
    constructor () {
        this.pool = new Pool({
            host: process.env.DWPGHOST,
            user: process.env.DWPGUSER,
            post: process.env.DWPGPORT,
            password: process.env.DWPGPASSWORD,
            database: process.env.DWPGDATABASE,
            idleTimeoutMillis: 100
        })
    }

    async getLastUpdate () {
        const query = {
            text: 'SELECT * FROM core.etl_exec ORDER BY id DESC LIMIT 1',
            values: []
        }
        const result = await this.pool.query(query)
        
        return result.rows
    }

    // async getAdminServers () {
    //     const result = await this.pool.query('SELECT server.displayname, admin.adminname, admin.email, admin.whatsapp FROM server INNER JOIN admin ON server.admin = admin.admin_id')

    //     return result.rows
    // }

    // async getDetailServer (ip) {
    //     const query = {
    //         text: 'SELECT server.displayname, server.hostname, server.agentstatus, server.agentmessage, admin.adminname, admin.email, admin.whatsapp FROM server INNER JOIN admin ON server.admin = admin.admin_id WHERE server.hostname = $1',
    //         values: [ip]
    //     }
    //     const result = await this.pool.query(query)

    //     return result.rows
    // }
}

module.exports = DatabaseDWService
