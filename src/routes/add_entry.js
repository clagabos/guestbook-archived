import chalk from "chalk";
import database from "../util/database.js";
import log from "../util/log.js";
import { Webhook } from "discord-webhook-node";
const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL)

const route = {
    type: "POST",
    path: "/add_entry",
    handler: function(req, res) {
        if(req.body.name && req.body.message && req.body.captcha && req.session.captcha) {
            // Ensure name is less than 48 characters and greater than 3
            if(req.body.name.length > 48 || req.body.name.length < 3) {
                res.status(400).render("error/400");
                return;
            }
            // Ensure message is less than 256 characters and greater than 4
            if(req.body.message.length > 256 || req.body.message.length < 4) {
                res.status(400).render("error/400");
                return;
            }
            // Ensure captcha is correct
            if(req.session.captcha && req.body.captcha !== req.session.captcha.captcha.text) {
                res.status(400).render("error/400");
                return;
            }

            database.query(`INSERT INTO ${process.env.MYSQL_TABLE} (name, message, date) VALUES (?, ?, ?)`, [req.body.name, req.body.message, new Date()]).then(() => {
                res.status(200).redirect("/");
                hook.send(`New entry added by **${req.body.name}**\n\n${req.body.message}`)
                    .catch(err => {
                        log.error(`❌ Error sending webhook: ${err}`);
                    });
            }).catch(err => {
                log.error(`❌ Error adding entry to database: ${err}`);
                res.status(500).render("error/500");
            });
        } else {
            res.status(400).render("error/400");
        }
    }
}

export default route;