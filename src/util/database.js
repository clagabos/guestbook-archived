import mysql from 'mysql2';
import log from './log.js';

async function init() {
    let connection = await getConnection(guestbookPool);
    // Create table "entries" if it does not exist
    await query(`CREATE TABLE IF NOT EXISTS ${process.env.MYSQL_TABLE} (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, message TEXT NOT NULL, date DATETIME NOT NULL, hidden BOOLEAN NOT NULL DEFAULT 0, PRIMARY KEY (id))`);
    connection.release();
    log.info(`🗄️ Database initialized`);
}

let guestbookPool = mysql.createPool({
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE
});

async function getConnection(pool) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                log.error(`❌ Error getting connection to ${pool.config.connectionConfig.database} database: ${err}`);
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
}

async function query(query, params) {
    // get connection then return a promsie of the query
    let connection = await getConnection(guestbookPool);
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results, fields) => {
            if (err) {
                log.error(`❌ Error querying database: ${err}`);
                connection.release();
                reject(err);
            } else {
                connection.release();
                resolve(results);
            }
        });
    });
}

export default {
    init,
    query
}