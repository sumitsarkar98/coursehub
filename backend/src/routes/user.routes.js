import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  signup,
  login,
  userProfile,
  logout,
  allJobcandidates,
  fetchAllCourses,
  fetchDashboardDataByUser,
  getAvailableCourses,
  purchaseCourse,
} from "../controllers/user.controller.js";

const router = express.Router();

// usual routes
router.post("/register", signup);
router.post("/login", login);

router.get("/hiredStudents", allJobcandidates);
router.get("/allcourses", fetchAllCourses);

// secured routes

router.get("/profile", authMiddleware, userProfile);
router.get("/dashboard", authMiddleware, fetchDashboardDataByUser);
router.get("/dashboardcourses", authMiddleware, getAvailableCourses);

router.post("/logout", authMiddleware, logout);
router.post("/ordernow", authMiddleware, purchaseCourse);

export default router;
