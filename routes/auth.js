import { Router } from "express";
import { register, login, getProfile } from "../controllers/authController.js";

const router = Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile", getProfile);

export default router;
