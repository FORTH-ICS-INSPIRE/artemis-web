const MongoClient = require('mongodb').MongoClient;

const dbName = process.env.MONGODB_NAME;

export const initializeDB = async () => {
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
  const connectedClient = await client.connect();
  return connectedClient.db(dbName);
};
