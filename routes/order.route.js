import express from "express";
import {
  // createOrder,
  getOrder,
  getOrders,
  intent,
} from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

// router.post("/:gigId", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/:id", verifyToken, getOrder);
router.post("/create-payment-intent/:id", intent);

export default router;
