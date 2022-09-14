import chalk from "chalk";
import database from "../util/database.js";
import log from "../util/log.js";

const route = {
    type: "POST",
    path: "/add_entry",
    handler: function(req, res) {
        if(req.body.name && req.body.message) {
            // Ensure name is less than 48 characters and greater than 3
            if(req.body.name.length > 48 || req.body.name.length < 3) {
                res.status(400).json({error: "Invalid name length"});
                return;
            }
            // Ensure message is less than 256 characters and greater than 4
            if(req.body.message.length > 256 || req.body.message.length < 4) {
                res.status(400).json({error: "Invalid message length"});
                return;
            }

            database.query("INSERT INTO entries (name, message, date) VALUES (?, ?, ?)", [req.body.name, req.body.message, new Date()]).then(() => {
                res.status(200).json({success: true});
            }).catch(err => {
                log.error(`❌ Error adding entry to database: ${err}`);
                res.status(500).json({success: false});
            });
        } else {
            res.status(400).json({success: false});
        }
    }
}

export default route;