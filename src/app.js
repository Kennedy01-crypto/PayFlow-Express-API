//import express
import express from "express";

//Daatabase
import DBconnect from "./config/db.js";
import ApplicationRoutes from "./routes/routes.js";

//declare port
const PORT = process.env.PORT || 8000;

const app = express();

// middleware
app.use(express.json());

//conect to database
DBconnect();

//routes
app.use("/api/v1", ApplicationRoutes);

//error handling middelware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

//app listener using the db connect function
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the Application at http://localhost:${PORT}`);
});
