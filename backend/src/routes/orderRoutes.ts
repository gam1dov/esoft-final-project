import express from "express";
import {
  guardMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderPaid,
  updateOrderDelivered,
  getOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/myorders").get(guardMiddleware, getMyOrders);
router.route("/:id").get(guardMiddleware, getOrderById);
router.route("/:id/paid").put(guardMiddleware, updateOrderPaid);
router
  .route("/:id/delivered")
  .put(guardMiddleware, adminMiddleware, updateOrderDelivered);
router
  .route("/")
  .post(guardMiddleware, addOrderItems)
  .get(guardMiddleware, adminMiddleware, getOrders);

export default router;
