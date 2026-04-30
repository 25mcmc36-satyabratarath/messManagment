import express from "express";
import mysql from "mysql2/promise";
import sqlInit from "./db/db.init.js";

import userRoutes from "./routes/user.route.js";
import wardenRoutes from "./routes/warden.route.js";
import messRoutes from "./routes/mess.routs.js";
import careTakerRoutes from "./routes/careTaker.route.js";
import messSecretaryRoutes from "./routes/messSecratory.route.js";
import supervisorRoutes from "./routes/messSupervisor.routes.js";

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
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ======================================================
//  SWAGGER (ONLY ADDITION - SAFE)
// ======================================================
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true
  })
);

// --------------------
// DB CONNECTION (POOL)
// --------------------
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "app_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

// --------------------
// DB INIT
// --------------------
async function connectDB() {
  while (true) {
    try {
      const conn = await pool.getConnection();
      console.log(" MySQL connected");

      // Always ensure DB + tables
      await conn.query(sqlInit);

      console.log(" DB & Tables ensured");

      conn.release();
      break;

    } catch (err) {
      console.log(" Waiting for DB..." + err.message);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
}

// --------------------
// ROUTES
// --------------------
app.use("/api/users", userRoutes);
app.use("/api/warden", wardenRoutes);
app.use("/api/mess", messRoutes);
app.use("/api/caretaker", careTakerRoutes);
app.use("/api/mess-secretary", messSecretaryRoutes);
app.use("/api/mess-supervisor", supervisorRoutes); 



// --------------------
// ERROR HANDLER
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
    console.log(` Server running on port ${PORT}`);
  });
}

startServer();