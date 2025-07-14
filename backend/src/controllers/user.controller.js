import db from "../connections/db.connections.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// user Signup
const signup = async (req, res) => {
  try {
    const { fullname, email, password, role, gender } = req.body;

    // Validate input
    if (!fullname || !email || !password || !role || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the user into the database
    const [result] = await db.execute(
      "INSERT INTO users (full_name, email, hashedPassword, role, gender) VALUES (?, ?, ?, ?, ?)",
      [fullname, email, hashedPassword, role, gender]
    );

    return res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal Server Error /controller" });
  }
};

// user Login
const login = async (req, res) => {
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

    // Compare the provided password with the hashed one in the DB
    const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Remove password before sending user data (for security)
    delete user.hashedPassword;

    // Create JWT Token (you can include user id or email in the payload)
    const token = jwt.sign(
      { id: user.id, email: user.email }, // payload
      process.env.JWT_SECRET, // secret key
      { expiresIn: "1h" } // token expiration time
    );

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error for login /controller" });
  }
};

// logout user
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

// Get logged-in user details
const userProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch user info
    const [userRows] = await db.execute(
      "SELECT id, full_name, email, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRows[0];

    // 2. Fetch purchased/enrolled courses with details
    const [purchasedCourses] = await db.execute(
      `SELECT e.course_id, e.progress, c.title, c.description
       FROM coursehub.enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.user_id = ?`,
      [userId]
    );

    // 3. Fetch available courses (not enrolled)
    let availableCourses = [];
    if (purchasedCourses.length > 0) {
      const enrolledIds = purchasedCourses.map((course) => course.course_id);
      const placeholders = enrolledIds.map(() => "?").join(",");

      const [notEnrolled] = await db.execute(
        `SELECT id, title, description FROM courses WHERE id NOT IN (${placeholders})`,
        enrolledIds
      );

      availableCourses = notEnrolled;
    } else {
      const [allCourses] = await db.execute(
        "SELECT id, title, description FROM courses"
      );
      availableCourses = allCourses;
    }

    res.status(200).json({
      user,
      purchasedCourses,
      availableCourses,
    });
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get hired students details
const allJobcandidates = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        jc.*, 
        u.full_name AS candidate_name
      FROM 
        jobcandidates jc
      JOIN 
        users u ON jc.student_id = u.id
    `);

    const filteredRows = rows.map((row) => {
      const { id, student_id, joining_date, status, ...rest } = row;
      return {
        ...rest,
        candidate_name: row.candidate_name, // keep name from users table
      };
    });

    res.status(200).json(filteredRows);
  } catch (error) {
    console.error("Failed to load jobcandidates:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get all courses
const fetchAllCourses = async (req, res) => {
  try {
    const [rows] = await db.execute(`
    SELECT * FROM courses     
    `);

    const courseData = rows.map((row) => {
      const { created_at, thumbnail_url, ...filteredData } = row;
      return filteredData;
    });

    res.status(200).json({ courseData });
  } catch (error) {
    console.error("failed to fetch courses :", error);
    res.status(500).json({ message: "failed to fetch courses" });
  }
};

// GET dashboard data for a specific user using the view
const fetchDashboardDataByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.execute(
      `
      SELECT * FROM coursehub.dashboardData WHERE user = ?
    `,
      [userId]
    );

    res.status(200).json({ dashboardData: rows });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

// get available course for selected-user
const getAvailableCourses = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.query(
      `
    SELECT c.id,title,description,price,rating
    FROM courses c
    WHERE NOT EXISTS (
      SELECT 1 
      FROM enrollments e 
      WHERE e.user_id = ? AND e.course_id = c.id
    )
  `,
      [userId]
    ); // assuming db is a configured MySQL connection
    res.status(200).json({ availableCourses: rows });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// place order
const purchaseCourse = async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.body;

  if (!courseId && !userId) {
    return res.status(400).json({ error: "Course and user is required" });
  }

  try {
    await db.query(
      `INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)`,
      [userId, courseId]
    );
    res.status(200).json({ message: "This Course is assigned to you." });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//named export
export {
  signup,
  login,
  userProfile,
  logout,
  allJobcandidates,
  fetchAllCourses,
  fetchDashboardDataByUser,
  getAvailableCourses,
  purchaseCourse,
};
