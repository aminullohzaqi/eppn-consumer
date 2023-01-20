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
            text: `SELECT (SELECT tanggal_dan_waktu FROM core.etl_exec ORDER BY id DESC LIMIT 1) as tanggal_dan_waktu,
            (SELECT tipe FROM core.etl_exec ORDER BY id DESC LIMIT 1) as tipe,
            (SELECT status FROM core.etl_exec ORDER BY id DESC LIMIT 1) as status,
            (SELECT COUNT(sk_pegawai) FROM core.fakta_mutasi) as row_fakta_mutasi,
            (select COUNT(sk_pegawai) from core.fakta_dapat_disekolahkan) as row_fakta_dapat_disekolahkan,
            (select COUNT(sk_pegawai) from core.fakta_hukuman) as row_fakta_hukuman,
            (select COUNT(sk_pegawai) from core.fakta_ijin_belajar) as row_fakta_ijin_belajar,
            (select COUNT(sk_fks) from core.fakta_kepala_satker) as row_fakta_kepala_satker,
            (select COUNT(sk_pegawai) from core.fakta_naik_pangkat) as row_fakta_naik_pangkat,
            (select COUNT(sk_pegawai) from core.fakta_penghargaan) as row_fakta_penghargaan,
            (select COUNT(sk_pegawai) from core.fakta_series) as row_fakta_series`,
            values: []
        }
        const result = await this.pool.query(query)
        
        return result.rows
    }
}

module.exports = DatabaseDWService
