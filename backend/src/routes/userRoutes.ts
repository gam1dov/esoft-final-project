import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import {
  guardMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(registerUser)
  .get(guardMiddleware, adminMiddleware, getUsers);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.route("/profile").put(guardMiddleware, updateUserProfile);
router
  .route("/:id")
  .get(guardMiddleware, adminMiddleware, getUserById)
  .put(guardMiddleware, adminMiddleware, updateUser)
  .delete(guardMiddleware, adminMiddleware, deleteUser);

export default router;
