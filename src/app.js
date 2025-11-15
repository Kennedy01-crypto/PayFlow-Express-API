//import expree js
import express from "express";
import DBconnect from "./config/db.js";

//declare port
const PORT = process.env.PORT || 8000;

const app = express();

// middleware
app.use(express.json());

//routes
app.get("/", async (req, res) => res.send("Hello World"));

//check db status
app.get("/db", async (req, res) => {
  try {
    const db = app.locals.db;
    if (!db) {
      res.status(400).json({ message: `DB not found` });
    }
    res
      .status(200)
      .json({ message: `DB connected. Database name:${db.databaseName}` });
  } catch (err) {
    console.error({ message: `DB not connected` });
    res.status(400).json({ message: `DB not connected` });
  }
});

//error handling middelware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

//app listener using the db connect function
DBconnect()
  .then((client) => {
    console.log("✅ Database connected");
    app.locals.db = client.db("payflow-db");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Access the Blog Application at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`❌ Error connecting to database: ${err}`);
  });
