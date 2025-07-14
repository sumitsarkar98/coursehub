import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log("Connected to MySQL");

export default db;

// import mysql from "mysql2/promise";

// async function connectDB() {
//   try {
//     const db = await mysql.createConnection({
//       host: process.env.db_host || "localhost",
//       user: process.env.db_user,
//       password: process.env.db_password,
//       database: process.env.deb_database,
//     });

//     console.log("Database connection established successfully");
//   } catch (error) {
//     console.error("Error connecting to the database:", error);
//     process.exit(1);
//   }
// }

// export default connectDB;
