import database from "../util/database.js";
import log from "../util/log.js";

const route = {
    type: "GET",
    path: "/",
    handler: async function(req, res) {
        // get page query
        let page = req.query.page || 1;
        // pages are 10 entries long, so get the first 10 entries on page 1, the next 10 on page 2, etc.
        let offset = (page - 1) * 10;

        // get the first entry in the table that is not hidden
        let first_entry = await database.query(`SELECT * FROM ${process.env.MYSQL_TABLE} WHERE hidden = 0 ORDER BY id ASC LIMIT 1`);


        database.query(`SELECT * FROM ${process.env.MYSQL_TABLE} WHERE hidden = 0 ORDER BY date DESC LIMIT 10 OFFSET ?`, [offset]).then(rows => {
            if(first_entry.length == 0) {
                first_entry[0] = { id: undefined}
            }
            res.status(200).render('pages/home', {entries: rows, page: page, first_entry: first_entry[0].id});
        }).catch(err => {
            log.error(`❌ Error getting entries from database: ${err}`);
            res.status(500).send("Internal server error");
        });
    }
}

export default route;