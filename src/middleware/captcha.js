import { CaptchaGenerator } from "captcha-canvas";

let captchas = {};

const middleware = {
    name: "captcha-generator",
    handler: async function (req,res,next) {
        if(!captchas[req.session.id]) { // If the captcha doesn't exist, create it
            let captcha = new CaptchaGenerator()
            captcha.setDimension(300,600);
            captcha.setCaptcha({
                color: "#000000",
                font: "Arial",
                size: 100,
                characters: 8,
            })
            captcha.generate().then(buffer => {
                captchas[req.session.id] = { captcha: captcha, buffer: buffer };
                req.session.captcha = captchas[req.session.id];
                // Remove the captcha after 5 minutes
                setTimeout(() => {
                    delete captchas[req.session.id];
                }, 5 * 60 * 1000);
                return next();
            }).catch(err => {
                console.error(err);
                return res.status(500).send("Internal server error");
            });
        } else { // If the captcha exists, just continue
            req.session.captcha = captchas[req.session.id];
            return next();
        }
    }
}

export default middleware;