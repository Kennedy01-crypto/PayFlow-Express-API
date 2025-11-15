//import expree js
import express from "express";
import DBconnect from "./config/db.js";
import ApplicationRputes from "./routes/routes.js";

//declare port
const PORT = process.env.PORT || 8000;

const app = express();

// middleware
app.use(express.json());

//routes
app.use("/api/v1", ApplicationRputes);

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
      console.log(`Access the Application at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`❌ Error connecting to database: ${err}`);
  });
