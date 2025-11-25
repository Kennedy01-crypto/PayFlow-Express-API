import express from "express";
const router = express.Router();
import * as userController from "../controllers/userController.js";

router.post("/users", userController.CreateUSer);
router.get("/users", userController.GetUsers);

export default router;
