import nextConnect from 'next-connect';
import auth from '../../middleware/auth';
import { extractUser } from '../../lib/helpers';
import { NextApiRequest, NextApiResponse } from 'next';
import graphQL from '../../utils/graphql';

const handler = nextConnect();
const client = graphQL.graphqlConnect();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body.table === 'stats')
    graphQL.getStats(client).then((result) => res.json(result));
});

export default handler;
