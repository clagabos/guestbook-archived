import 'dotenv/config';
import express from 'express';
const app = express();
import https from 'https';
import http from 'http';
import cors from 'cors';
import body_parser from 'body-parser';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import log from './util/log.js';
import database from './util/database.js';

let config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config.json')));
database.init();

let server = http.createServer(app);
if(process.env.SSL == 'true') {
    // Register HTTPS server
    server = https.createServer({
        key: fs.readFileSync(path.join(process.cwd(), 'certs/key.pem')),
        cert: fs.readFileSync(path.join(process.cwd(), 'certs/cert.pem'))
    }, app);
}

// Register template engine
app.set('view engine', 'pug');
app.set('views', path.join(process.cwd(), "views"));

// Give all views a base directory and access to the config variable
app.locals.basedir = path.join(process.cwd(), "views");
app.locals.config = config;

// Middleware
app.use(cors());
app.use(body_parser.json({limit: "1mb", parameterLimit: 100000})); // Parse json requests
app.use(body_parser.urlencoded({ extended: true, limit: "1mb", parameterLimit: 100000 })); // Parse urlencoded bodies

// Routes
let routes = fs.readdirSync(path.join(process.cwd(), 'src/routes'));
routes.forEach(async file => {

    if(file.endsWith('.js')) {
        // Import route
        let route = await import(`./routes/${file}`);
        route = route.default;

        // Register route
        app[route.type.toLowerCase()](route.path, route.handler);
        log.info(`🔌 Registered route ${chalk.cyanBright(route.type)} ${chalk.greenBright(route.path)}`);
    }

    // Once all of the routes have been registered
    if(file == routes[routes.length - 1]) {
        // Static files
        app.use(express.static(path.join(process.cwd(), 'static')));

        // Listen for 404
        app.use((req, res) => {
            res.status(404).redirect("/");
        });
        log.info(`🔌 Registered route ${chalk.greenBright('404')}`);

        // Start server
        server.on('listening', () => {
            log.info(`🚀 Webserver listening on port ${process.env.PORT}`);
        }).on('error', (err) => {
            log.error(`❗ Server error on startup: ${err}`);
        }).listen(process.env.PORT);
    };
    
});

