import authorization from '../../middleware/authorization';
import nc from 'next-connect';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';
import auth from '../../middleware/auth';
import { csrf } from '../../libs/csrf';
import memory from '../../utils/captchaMemoryStore';

const lambdaCaptcha = require('lambda-captcha')
const SECRET = process.env.CAPTCHA_SECRET
import absoluteUrl from 'next-absolute-url'


function generateCaptcha() {
  const captchaConfig = lambdaCaptcha.LambdaCaptchaConfigManager.default(SECRET)
  const captcha = lambdaCaptcha.create(captchaConfig)

  return {
    // The captcha SVG that you can display inside e.g. a form
    captchaSvg: captcha.captchaSvg,

    // This is the un-encrypted expression of the captcha.
    captchaExpression: captcha.expr,

    // This is the encrypted expression of the captcha.
    // Pass it along with your server side verification requests.
    encryptedCaptchaExpression: captcha.encryptedExpr
  }
}


const handler = nc()
  .use(auth)
  .post(async (req: any, res: NextApiResponseExtended) => {
    const { page } = req.body;

    if (page === 'login') {
      const hits = memory.getHits(req.ip);
      if (!hits || hits < (parseInt(process.env.CAPTCHA_TRIES ?? '4'))) {
        res.status(200);
        res.json({ svg: '', encryptedExpr: '', hasCaptcha: false });
        return;
      }
    }

    const captcha = generateCaptcha();
    const svg = captcha.captchaSvg;

    res.status(200);
    res.json({ svg: svg, encryptedExpr: captcha.encryptedCaptchaExpression, hasCaptcha: true });
  });

export default handler;
