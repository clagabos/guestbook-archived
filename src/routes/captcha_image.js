import database from "../util/database.js";
import log from "../util/log.js";

const route = {
    type: "GET",
    path: "/captcha",
    handler: async function(req, res) {
        let captcha = req.session.captcha.captcha;
        let image_buffer = req.session.captcha.buffer;
        // Set the content type to image/png
        res.set("Content-Type", "image/png");
        // Send the buffer
        res.send(image_buffer);
    }
}

export default route;