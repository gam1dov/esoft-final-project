import express from "express";
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  getAllCategories,
} from "../controllers/productController.js";
import {
  guardMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/categories", getAllCategories);

router
  .route("/")
  .get(getAllProducts)
  .post(guardMiddleware, adminMiddleware, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(guardMiddleware, adminMiddleware, updateProduct)
  .delete(guardMiddleware, adminMiddleware, deleteProduct);

router.route("/:id/reviews").post(guardMiddleware, createProductReview);

export default router;
