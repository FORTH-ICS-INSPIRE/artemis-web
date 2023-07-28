import nc from 'next-connect';
import {
    NextApiRequestExtended,
    NextApiResponseExtended
} from '../../definitions';

import { exec } from 'child_process';

const handler = nc()
    .post(async (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
        exec('python3 ./apps/artemis-web/get_subnets.py',
        (error, stdout, stderr) => {
            res.json({ ips: stdout });
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
        
    });

export default handler;
