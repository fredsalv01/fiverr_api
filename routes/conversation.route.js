import express from "express";
import {
  createConversation,
  updateConversation,
  getConversation,
  getConversations,
} from "../controllers/conversation.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", verifyToken, getConversations);
router.post("/", verifyToken, createConversation);
router.get("/single/:id", verifyToken, getConversation);
router.patch("/:id", verifyToken, updateConversation);

export default router;
