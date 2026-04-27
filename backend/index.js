import express from "express";
import mysql from "mysql2/promise";
import sqlInit from "./db/db.init.js";

import userRoutes from "./routes/user.route.js";
import wardenRoutes from "./routes/warden.route.js";

import messRoutes from "./routes/mess.routs.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------
// MIDDLEWARE
// --------------------
app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: "*",   // for dev (allow all)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --------------------
// DB CONNECTION (POOL)
// --------------------
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "mess_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

// --------------------
// DB INIT (Docker Safe)
// --------------------
async function connectDB() {
  while (true) {
    try {
      const conn = await pool.getConnection();
      console.log("✅ MySQL connected");

      const [rows] = await conn.query(`
        SELECT SCHEMA_NAME 
        FROM INFORMATION_SCHEMA.SCHEMATA 
        WHERE SCHEMA_NAME = 'mess_management'
      `);

      if (rows.length === 0) {
        await conn.query(sqlInit);
        console.log("🆕 Fresh DB initialized");
      } else {
        await conn.query("USE mess_management");
        console.log("📦 DB exists:", rows[0].SCHEMA_NAME);
      }

      conn.release();
      break;

    } catch (err) {
      console.log("⏳ Waiting for DB..." + err.message);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
}

// --------------------
// ROUTES
// --------------------
app.use("/api/users", userRoutes);     // Auth routes
app.use("/api/warden", wardenRoutes);  // Warden routes
app.use("/api/mess", messRoutes);     // mess card roue


// --------------------
// GLOBAL ERROR HANDLER
// --------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// --------------------
// START SERVER
// --------------------
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();