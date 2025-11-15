import { Router } from "express";
import express from "express";

const router = Router();
//routes
router.get("/", async (req, res) =>
  res.status(200).json({ message: `Hello World` })
);

//check db status
router.get("/db", async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      res.status(400).json({ message: `DB not found` });
    } else {
      res
        .status(200)
        .json({ message: `DB connected. Database name:${db.databaseName}` });
    }
  } catch (err) {
    console.error({ message: `DB not connected: ${err}` });
    res.status(400).json({ message: `DB not connected: ${err}` });
  }
});

//register user
// POST request
// db.collections.("collectionsName").insertOne(qurery)
router.post("/register", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const collection = db.collection("users");
    const userData = req.body;

    //simple data validation; email and username
    if (!userData.email || !userData.username) {
      res.status(400).json({ message: `Email and username are required` });
      return;
    } else {
      const result = await collection.insertOne(userData);
      res.status(200).json({ message: `User registered ${result}` });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: `User not registered: ${err}` });
  }
});

//get a list of all users
// GET
// db.collections.("collectionsName").find().toArray()
router.get("/users", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const collection = db.collection("users");
    const users = await collection.find().toArray();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: `Users not found: ${err}` });
  }
});

export default router;
