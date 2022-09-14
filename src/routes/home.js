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

        // get total number of pages
        let total_pages = await database.query("SELECT COUNT(*) FROM entries");
        total_pages = Math.ceil(total_pages[0]["COUNT(*)"] / 10);

        database.query("SELECT * FROM entries ORDER BY date DESC LIMIT 10 OFFSET ?", [offset]).then(rows => {
            res.status(200).render('pages/home', {entries: rows, page: page, total_pages: total_pages});
        }).catch(err => {
            log.error(`❌ Error getting entries from database: ${err}`);
            res.status(500).send("Internal server error");
        });
    }
}

export default route;