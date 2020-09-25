const MongoClient = require('mongodb').MongoClient;

const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

export const initializeDB = async () => {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const connectedClient = await client.connect();
  return connectedClient.db(dbName);
};
