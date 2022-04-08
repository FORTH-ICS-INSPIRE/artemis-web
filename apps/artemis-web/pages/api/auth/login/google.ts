import nc from 'next-connect';
import passport from '../../../../libs/passport';
import {
    NextApiRequestExtended,
    NextApiResponseExtended,
} from '../../../../definitions';
import auth from '../../../../middleware/auth';
import { extractLdapUser } from '../../../../utils/parsers';
import { csrf } from '../../../../libs/csrf';
import captcha from '../../../../middleware/captcha';
import limiter from '../../../../middleware/limiter';
import memory from '../../../../utils/captchaMemoryStore';

const handler = nc()
    .use(limiter('google'))
    .use(auth)
    .get(async (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
        memory.incr(req.ip);
        next();
    })
    .get(
        passport.authenticate('google', {
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        }, (req, res, next) => {
            next();
        })
    );

export default handler;