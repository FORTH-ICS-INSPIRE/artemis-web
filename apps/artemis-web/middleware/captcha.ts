import memory from "../utils/captchaMemoryStore";

const lambdaCaptcha = require('lambda-captcha')
const SECRET = process.env.CAPTCHA_SECRET

export default function captcha() {
    return async (req, res, next): Promise<any> => {
        const captchaResult = lambdaCaptcha.verify(req.body.encryptedExpr, req.body.captcha, SECRET);
        const hits = memory.getHits(req.ip);
        const skipCaptcha = (hits < (parseInt(process.env.CAPTCHA_TRIES) ?? 4)) || (process.env.TESTING === 'true');

        if (!skipCaptcha && captchaResult === 'invalid_solution') {
            res.status(400).send('Captcha solution is incorrect.');
        } else return next();
    };
}
