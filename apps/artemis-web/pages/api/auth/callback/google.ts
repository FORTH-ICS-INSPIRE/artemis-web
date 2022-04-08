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
    .use(auth)
    .get(async (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
        memory.incr(req.ip);
        next();
    })
    .get(
        passport.authenticate('google', { failureRedirect: '/error' }), (req: any, res: NextApiResponseExtended, next) => {
            res.redirect('/');
        }
    );

export default handler;