import memory from "../utils/captchaMemoryStore";

const lambdaCaptcha = require('lambda-captcha')
const SECRET = process.env.CAPTCHA_SECRET

const captchaChallengeStore = {};

export default function captcha(page: string) {
    return async (req, res, next): Promise<any> => {
        const captchaResult = lambdaCaptcha.verify(req.body.encryptedExpr, req.body.captcha, SECRET);
        const hits = memory.getHits(req.ip);
        if (!captchaChallengeStore[req.ip])
            captchaChallengeStore[req.ip] = [];
        const skipCaptcha = (page === 'login' && hits < (parseInt(process.env.CAPTCHA_TRIES ?? '4', 10))) || (process.env.TESTING === 'true');

        if (!skipCaptcha && captchaResult === 'invalid_solution' || captchaChallengeStore[req.ip].includes(req.body.encryptedExpr)) {
            res.status(400).send('Captcha solution is incorrect.');
        } else {
            if (req.body.encryptedExpr.length > 0)
                captchaChallengeStore[req.ip].push(req.body.encryptedExpr);
            return next();
        }
    };
}
