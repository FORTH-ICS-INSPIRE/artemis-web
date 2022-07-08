import { createRouter } from "next-connect";
import { Telnet } from 'telnet-client';
import {
    NextApiRequestExtended,
    NextApiResponseExtended
} from '../../definitions';
import limiter from '../../middleware/limiter';

const connection = new Telnet()


const params = {
    host: process.env.LDAP_HOST,
    port: process.env.LDAP_PORT,
    negotiationMandatory: false, // or negotiationMandatory: false
    timeout: 1000
}

const router = createRouter();

const handler = router
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
