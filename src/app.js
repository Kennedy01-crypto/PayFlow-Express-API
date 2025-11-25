//import express
import express from "express";

//Database and Routes
import DBconnect from "./config/db.js";
import ApplicationRoutes from "./routes/userRoutes.js";

//others
import dotenv from "dotenv";
import AppError from "./config/AppError.js";
import globalErrorHandler from "./controllers/error.controller.js";

//1. Load Env variables
dotenv.config();

//2. declare port
const PORT = process.env.PORT || 8000;

// 3. Innitiate an express application instance
const app = express();

// 4. middleware
app.use(express.json()); // Body Json parser

// 5. conect to database
DBconnect();

/**
 * Routes
 * Error handling
 * Other Application Confogurations
 */

//** */. Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "📈 PayFlow API is running!" });
  console.log("📈 PayFlow API is running!");
});

//1. import routes here
app.use("/api/v1", ApplicationRoutes);

//2. Midlleware for unhandlled routes
app.use("/*path", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server! `, 404));
});

//3. global error handling middleware
app.use(globalErrorHandler);

//4. Start Server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the Application at http://localhost:${PORT}`);
});

//5 catch synchronous uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting Down...");
  console.error(err.name, err.message, err.stack);
  //Gracefully close server, then exit process
  server.close(() => {
    process.exit(1);
  });
});

//6. catch asynchronous unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting Down...");
  console.error(err.name, err.message, err.stack);
  //gracefully close server, then exit process
  server.close(() => {
    process.exit(1);
  });
});
