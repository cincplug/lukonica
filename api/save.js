const { MongoClient } = require("mongodb");

module.exports = async (req, res) => {
  const { data } = req.body;
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.MONGODB_DB);
  await db.collection("json").insertOne({ data });
  client.close();
  res.status(200).send({ status: "success" });
};
