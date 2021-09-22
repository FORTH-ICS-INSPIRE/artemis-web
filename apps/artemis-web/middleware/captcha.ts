const lambdaCaptcha = require('lambda-captcha')
const SECRET = process.env.CAPTCHA_SECRET

export default function captcha() {
    return async (req, res, next) => {
        const captchaResult = lambdaCaptcha.verify(req.body.encryptedExpr, req.body.captcha, SECRET);
        if (!(process.env.TESTING === 'true') && captchaResult === 'invalid_solution') {
            res.status(400).send('Captcha solution is incorrect.');
        } else return next();
    };
}
