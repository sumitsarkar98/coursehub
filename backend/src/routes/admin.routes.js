import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  adminLogin,
  fetchAllCourses,
  adminProfile,
  addCourses,
  updateCourse,
  deleteCourse,
} from "../controllers/admin.controller.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

//ususal routers
router.post("/login", adminLogin);
router.get("/allcourses", fetchAllCourses);

//protected routes
router.get("/profile", authMiddleware, adminProfile);
router.post(
  "/addcourse",
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "promoVideo", maxCount: 1 },
  ]),
  addCourses
);

router.put("/updatecourse/:courseId", authMiddleware, updateCourse);
router.delete("/deletecourse/:courseId", authMiddleware, deleteCourse);

export default router;
