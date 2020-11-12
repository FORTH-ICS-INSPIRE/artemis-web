const myArgs = process.argv.slice(2);

(async function () {
    const { MongoClient } = require('mongodb');
    const argon2 = require('argon2');
    const { nanoid } = require('nanoid');

    const uri = myArgs[2];

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db('artemis-web');

    if (!db.collection('users')) {
        db.createCollection('users', function (err, res) {
            if (err) throw err;
            db.collection('users').insertOne(
                {
                    $set: {
                        _id: nanoid(12),
                        email: myArgs[0],
                        password: await argon2.hash(myArgs[1]),
                        name: 'Admin',
                        lastLogin: new Date(),
                        currentLogin: new Date(),
                        role: 'admin',
                        token: '',
                    },
                }, (err, res) => { db.close() }
            );
        });
    }
})();
