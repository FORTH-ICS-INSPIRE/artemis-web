import {
    ApolloClient,
    createHttpLink, gql,
    InMemoryCache
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { MongoClient } from 'mongodb';
import fetch from 'node-fetch';
import {
    setInterval
} from 'timers/promises';
var https = require('https');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;
let last_key = '';

const forgeToken = async (): Promise<string> => {
    const client = new MongoClient(URI, {});
    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_NAME);
        const user = await db.collection('users').findOne({ email: process.env.DEFAULT_EMAIL });
        const token = jwt.sign(
            {
                'https://hasura.io/jwt/claims': {
                    'x-hasura-allowed-roles': [user.role],
                    'x-hasura-default-role': user.role,
                    'x-hasura-user-id': user._id,
                },
                user: user,
            },
            process.env.JWT_SECRET
        );
        return token;
    } catch (error) {
        console.error(error);
    }
};

const fetchHijackUpdates = async () => {
    const jwt: string = await forgeToken();

    const agent = new https.Agent({
        rejectUnauthorized: false,
    })
    const authLink = setContext(async (_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: jwt ? `Bearer ${jwt}` : '',
            },
        };
    })
    const httpLink =
        createHttpLink({
            uri: `https://localhost/api/graphql`,
            fetch,
            fetchOptions: {
                agent: agent
            },
            useGETForQueries: false,
        });


    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });

    for await (const startTime of setInterval(10000, Date.now())) {
        let date = new Date();
        date.setSeconds(date.getSeconds() - 10);

        const query = gql`
        query hijacks {
        view_hijacks(
            order_by: {time_last: desc}, where: {time_detected: {_gte: "${date.toISOString()}"}}
        ) {
            active
            comment
            configured_prefix
            hijack_as
            ignored
            dormant
            key
            rpki_status
            mitigation_started
            num_asns_inf
            num_peers_seen
            outdated
            peers_seen
            peers_withdrawn
            prefix
            resolved
            seen
            time_detected
            time_ended
            time_last
            time_started
            timestamp_of_config
            type
            under_mitigation
            withdrawn
        }
        }`;
        const result = await client.query({
            query,
        });
        const hijacks = result.data.view_hijacks;

        hijacks.forEach(hijack => {
            const key = hijack.key;
            sendNotificationFillDbEntries(key);
        });
    }
}

const sendNotification = (hijackKey: string, hjRandom: string) => {
    console.log(`Sending notification for hijack ${hijackKey}...`);
    let admin = require("firebase-admin");
    //@todo add path to service account file
    let serviceAccount = require("serviceAccountFilePath");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    const topic = 'hjtopic';
    const message = {
        data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            hjKey: hijackKey,
            hjRandom: hjRandom
        },
        notification: {
            title: 'Active Hijack detected!',
            body: 'Tap to view more'
        },
        topic: topic
    };

    // Send a message to devices subscribed to the provided topic.
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
    console.log(`Sending notification for hijack ${hijackKey} finished`);
}

const isInCollection = async (db: any, name: string): Promise<Boolean> => {
    const collections = await db.listCollections().toArray();

    return collections.some((collection) => collection.name === name);
}

const fillDbEntries = async (hijackKey: string, hjRandom: string): Promise<void> => {
    console.info(`Filling DB entries for hijack ${hijackKey}...`);

    const client = new MongoClient(URI, {});
    try {
        await client.connect();
        const db = client.db('artemis-web');
        if (!(await isInCollection(db, 'hj_notifications'))) {
            db.createCollection('hj_notifications', function (err, res) {
                if (err) throw err;
            });
        }

        const users = await db.collection('users').find().toArray();
        if (users.length) {
            db.collection('hj_notifications').insertMany(
                users.map(function (user) {
                    return {
                        hijackKey: hijackKey,
                        userId: user._id,
                        notificationReceived: false,
                        smsStatusCode: 0, // sms status codes(0: Not sent, 1: Sent, 2: Received)
                        hjRandom: hjRandom
                    }
                }),
                (err, res) => {
                    console.error('error', err);
                    client.close();
                }
            );
        }
        console.log(`Filling DB entries for hijack ${hijackKey} finished`);
    } catch (e) {
        console.error('error', e);
        client.close();
    }
}

const sendNotificationFillDbEntries = async (hijackKey: string) => {
    const { nanoid } = require('nanoid');
    let hjRandom = nanoid(12);
    await sendNotification(hijackKey, hjRandom);
    await fillDbEntries(hijackKey, hjRandom);
}

fetchHijackUpdates();
