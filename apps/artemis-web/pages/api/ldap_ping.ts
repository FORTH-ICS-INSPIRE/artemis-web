const { Telnet } = require('telnet-client')
const connection = new Telnet()
import nc from 'next-connect';
import {
    NextApiRequestExtended,
    NextApiResponseExtended,
} from '../../definitions';
import auth from '../../middleware/auth';
import { extractLdapUser } from '../../utils/parsers';
import { csrf } from '../../libs/csrf';
import captcha from '../../middleware/captcha';
import limiter from '../../middleware/limiter';
import memory from '../../utils/captchaMemoryStore';

// these parameters are just examples and most probably won't work for your use-case.
const params = {
    host: process.env.LDAP_HOST,
    port: process.env.LDAP_PORT,
    negotiationMandatory: false, // or negotiationMandatory: false
    timeout: 1000
}

const handler = nc()
    .use(limiter('ldap'))
    .get(async (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
        try {
            await connection.connect(params)
            res.json({ hasLdap: true });
        } catch (error) {
            // handle the throw (timeout)
            res.json({ hasLdap: false });
        }
    });

export default handler;
