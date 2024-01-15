const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB);
    const jsons = await db.collection('json').find().toArray();
    client.close();
    res.status(200).send(jsons);
};
