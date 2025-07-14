import db from "../connections/db.connections.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";

// ADMIN Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required for login!" });
    }

    // Find the user in the database
    const [userRows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRows[0];

    // Ensure the user has admin role
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Not an admin user." });
    }

    // Compare the provided password with the hashed one in the DB
    const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Remove hashed password before sending user data
    delete user.hashedPassword;

    // Create JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Admin login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error during admin login" });
  }
};

// Fetch all courses
const fetchAllCourses = async (req, res) => {
  try {
    const [courses] = await db.execute("SELECT * FROM courses");

    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("Failed to fetch courses:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch courses" });
  }
};

// fetch admin details
const adminProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch user info
    const [userRows] = await db.execute(
      "SELECT id, full_name, email,gender,role FROM users WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "no user found" });
    }

    const user = userRows[0];

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// add Courses
const addCourses = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    const videoLocalPath = req.files?.promoVideo?.[0]?.path;

    // Upload files to Cloudinary
    const thumbnail_url = await uploadOnCloudinary(thumbnailLocalPath);
    const video_url = await uploadOnCloudinary(videoLocalPath);

    // Check if uploads were successful
    if (!thumbnail_url || !video_url) {
      return res.status(400).json({ message: "File upload failed" });
    }

    // Insert into DB using correct db.execute()
    const [newCourse] = await db.execute(
      "INSERT INTO courses (title, description, price, thumbnail_url, video_url) VALUES (?, ?, ?, ?, ?)",
      [title, description, price, thumbnail_url, video_url]
    );
    console.log("course added successfully", newCourse);

    return res.status(201).json({
      message: "Course added successfully",
      course: {
        id: newCourse.insertId,
        title,
        description,
        price,
        thumbnail_url,
        video_url,
      },
    });
  } catch (error) {
    console.error("Error adding course:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// update courses
const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { title, description, price, instructor_id } = req.body;

    // Validation
    if (!title || !description || !price || !instructor_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the course exists
    const [existingCourse] = await db.execute(
      "SELECT * FROM courses WHERE id = ?",
      [courseId]
    );

    if (existingCourse.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update course (excluding thumbnail)
    await db.execute(
      `UPDATE courses 
       SET title = ?, description = ?, price = ?, instructor_id = ?
       WHERE id = ?`,
      [title, description, price, instructor_id, courseId]
    );

    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    console.error("Course update error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Course
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Check if course exists
    const [course] = await db.execute("SELECT * FROM courses WHERE id = ?", [
      courseId,
    ]);
    if (course.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete course from DB
    await db.execute("DELETE FROM courses WHERE id = ?", [courseId]);

    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  adminLogin,
  adminProfile,
  addCourses,
  updateCourse,
  deleteCourse,
  fetchAllCourses,
};

/*
import bcrypt from "bcrypt";
import db from "../config/db.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Adjust path
import fs from "fs";

const signup = async (req, res) => {
  try {
    const { fullname, email, password, role, gender } = req.body;
    const file = req.file;

    // Validate inputs
    if (!fullname || !email || !password || !role || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user exists
    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    // Handle image upload
    let imageUrl = null;
    if (file?.path) {
      imageUrl = await uploadOnCloudinary(file.path);
      // Delete local file after upload
      fs.unlinkSync(file.path);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    const [result] = await db.execute(
      "INSERT INTO users (full_name, email, hashedPassword, role, gender, profile_image) VALUES (?, ?, ?, ?, ?, ?)",
      [fullname, email, hashedPassword, role, gender, imageUrl]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
      profileImage: imageUrl,
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default signup;

*/
