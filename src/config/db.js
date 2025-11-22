//import Mongoose
import mongoose from "mongoose";

//conection URI
const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/payflow-db";

//function to connect to database
async function DBconnect() {
  try {
    await mongoose.connect(URI);
    console.log("✅ Connected to database");
  } catch (err) {
    console.error(`Error connecting to database: ${err}`);
    process.exit(1);
  }
}
export default DBconnect;
