const dotenv = require("dotenv")

dotenv.config()

const email = process.env.DEFAULT_EMAIL;
const password = process.env.DEFAULT_PASS;
const URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@mongodb:${process.env.MONGODB_PORT}`;

async function isInCollection(db, name) {
    const collections = await db.listCollections().toArray();
    const filtered = collections.filter((collection) => collection.name === name);
    return filtered.length > 0;
}

(async function () {
    const { MongoClient } = require('mongodb');
    const argon2 = require('argon2');
    const { nanoid } = require('nanoid');

    const client = new MongoClient(URI);
    await client.connect();

    const db = client.db('artemis-web');
    
    if (!(await isInCollection(db, "users"))) {
        db.createCollection('users', function (err, res) {
            if (err) throw err;
        });
        db.collection('users').insertOne(
        {
            _id: nanoid(12),
            email: email,
            password: await argon2.hash(password),
            name: 'Admin',
            lastLogin: new Date(),
            currentLogin: new Date(),
            role: 'admin',
            token: '',
        }, (err, res) => { client.close() }
        );
    } else {
        client.close();
    }
    
})();
