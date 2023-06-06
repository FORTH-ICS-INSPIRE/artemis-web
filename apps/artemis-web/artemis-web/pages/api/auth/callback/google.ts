import nc from 'next-connect';
import {
    NextApiRequestExtended,
    NextApiResponseExtended
} from '../../../../definitions';
import passport from '../../../../libs/passport';
import auth from '../../../../middleware/auth';
import memory from '../../../../utils/captchaMemoryStore';

const handler = nc()
    .use(auth)
    .get(async (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
        memory.incr(req.ip);
        next();
    })
    .get(
        passport.authenticate('google', { failureRedirect: '/error' }), (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
            res.redirect('/');
        }
    );

export default handler;