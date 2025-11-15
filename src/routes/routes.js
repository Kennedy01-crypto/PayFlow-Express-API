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

export default router;
