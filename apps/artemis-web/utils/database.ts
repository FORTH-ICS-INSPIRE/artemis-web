const MongoClient = require('mongodb').MongoClient;

const MONGODB_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;
const dbName = process.env.MONGODB_NAME;

export const initializeDB = async () => {
  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const connectedClient = await client.connect();
  return connectedClient.db(dbName);
};
