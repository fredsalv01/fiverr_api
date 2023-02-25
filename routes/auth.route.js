import express from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  currentUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/current-user", verifyToken,  currentUser);

export default router;
