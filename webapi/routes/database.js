require('dotenv').config()

const cn = {
    host: process.env.DB_HOST,
    port:  process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
};

const pgp = require('pg-promise')()
// const dbPromise = pgp('postgres://lasti:827e108d@178.128.104.74:40040/penetapankelulusan')
const dbPromise = pgp(cn)

module.exports= dbPromise