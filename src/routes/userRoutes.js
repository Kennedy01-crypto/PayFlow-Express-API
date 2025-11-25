import express from "express";
const router = express.Router();
import * as userController from "../controllers/userController.js";

router.post("/", userController.CreateUSer);

export default router;