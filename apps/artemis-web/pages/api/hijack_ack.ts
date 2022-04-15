
import nc from 'next-connect';
import auth from "../../middleware/auth";
import { NextApiRequestExtended, NextApiResponseExtended } from "../../definitions";
import limiter from '../../middleware/limiter';

const handler = nc()
    .use(limiter('ack'))
    .use(auth)
    .post(
        (req: NextApiRequestExtended, res: NextApiResponseExtended, next) => {
            try {
                if (req.body.hijackKey && req.body.userId && req.body.hjRandom) {
                    req.db.collection('hj_notifications').updateOne(
                        { hijackKey: req.body.hijackKey, userId: req.body.userId, hjRandom: req.body.hjRandom },
                        {
                            $set: {
                                notificationReceived: true,
                            },
                        }
                    );
                    res.json({});
                } else {
                    res.status(400);
                    res.json({ Error: 'Missing parameters' });
                }
            } catch (error) {
                console.error(error);
                res.status(400).send('Bad request');
            }
        }
    );

export default handler;