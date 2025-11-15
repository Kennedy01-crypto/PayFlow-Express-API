import { MongoClient, ServerApiVersion } from "mongodb";
const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/payflow-db";

//function to connect to database
async function DBconnect() {
  const client = new MongoClient(URI, {
    ServerAPI: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    return client;
  } catch (err) {
    console.error(`Error connecting to database: ${err}`);
    process.exit(1);
  }
}
export default DBconnect;
