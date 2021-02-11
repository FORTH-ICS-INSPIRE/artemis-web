import authorization from '../../middleware/authorization';
import nc from 'next-connect';
import {
  NextApiRequestExtended,
  NextApiResponseExtended,
} from '../../definitions';
import auth from '../../middleware/auth';
import * as Amqp from 'amqp-ts';
import { BrokerExchangeOptions, BrokerQueueOptions } from 'typescript-rabbitmq';
import Broker from 'typescript-rabbitmq';
import uuidv4 from 'uuid/v4';

const sendRMQAction = async (obj) => {
  const { exchangeName, payload, routing_key } = obj;
  const {
    RABBITMQ_USER,
    RABBITMQ_PASS,
    RABBITMQ_HOST,
    RABBITMQ_PORT,
  } = process.env;

  let config: any = {
    connection: {
      user: RABBITMQ_USER,
      pass: RABBITMQ_PASS,
      host: RABBITMQ_HOST,
      port: RABBITMQ_PORT,
      timeout: 2000,
      name: 'rabbitmq',
    },
    exchanges: [],
    queues: [],
    binding: [],
    logging: {
      adapters: {
        stdOut: {
          level: 3,
          bailIfDebug: true,
        },
      },
    },
  };

  let broker = new Broker(config);
  await broker.connect();

  await broker.addExchange(exchangeName, 'direct', {
    durable: false,
  } as BrokerExchangeOptions);
  await broker.init();

  console.log('sender: going to send message ..');
  await broker.send(exchangeName, routing_key, JSON.stringify(payload), {
    persistent: false,
    noAck: false,
    timestamp: Date.now(),
    contentEncoding: 'utf-8',
    contentType: 'application/x-ujson',
    headers: {
      messageId: uuidv4(),
      source: exchangeName + ':' + routing_key,
    },
  });
  console.log('sender: message sent ..');
};

const handler = nc()
  .use(auth)
  .use(authorization(['admin']))
  .post(async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    let obj = {};
    const {
      action,
      hijack_key,
      prefix,
      hijack_type,
      hijack_as,
      state,
    } = req.body;

    switch (action) {
      case 'mitigate':
        obj = {
          action: action,
          routing_key: 'mitigate',
          exchangeName: 'mitigation',
          priority: 2,
          payload: { key: hijack_key, prefix: prefix },
        };
        break;
      case 'unmitigate':
        obj = {
          action: action,
          routing_key: 'unmitigate',
          exchangeName: 'mitigation',
          priority: 2,
          payload: { key: hijack_key, prefix: prefix },
        };
        break;
      case 'resolve':
        obj = {
          action: action,
          routing_key: 'resolve',
          exchangeName: 'hijack-update',
          priority: 2,
          payload: {
            key: hijack_key,
            prefix: prefix,
            type: hijack_type,
            hijack_as: parseInt(hijack_as),
          },
        };
        break;
      case 'ignore':
        obj = {
          action: action,
          routing_key: 'ignore',
          exchangeName: 'hijack-update',
          priority: 2,
          payload: {
            key: hijack_key,
            prefix: prefix,
            type: hijack_type,
            hijack_as: parseInt(hijack_as),
          },
        };
        break;
      case 'delete':
        obj = {
          action: action,
          routing_key: 'delete',
          exchangeName: 'hijack-update',
          priority: 2,
          payload: {
            key: hijack_key,
            prefix: prefix,
            type: hijack_type,
            hijack_as: parseInt(hijack_as),
          },
        };
        break;
      case 'seen':
        obj = {
          action: action,
          routing_key: 'seen',
          exchangeName: 'hijack-update',
          priority: 2,
          payload: { key: hijack_key, state: state },
        };
        break;
      default:
        res.status(401);
        return;
    }

    sendRMQAction(obj);
    res.json({ status: 'success' });
    res.status(200);
  });

export default handler;
