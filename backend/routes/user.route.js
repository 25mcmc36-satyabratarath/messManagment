 import { Router } from "express";
import { sendOtp, verifyOtp , logout } from "../controller/user.controller.js";
import { allowRoles } from "../middleware/role.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: OTP-based Role Authentication APIs
 */

/**
 * @swagger
 * /api/users/send-otp:
 *   post:
 *     summary: Send OTP to user email (role-based)
 *     tags: [Auth]
 *     description: Sends OTP to email after validating user role (STUDENT / ADMIN / WARDEN)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: 25mcmc29@uohyd.ac.in
 *               role:
 *                 type: string
 *                 enum: [STUDENT, ADMIN, WARDEN]
 *                 example: STUDENT
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: OTP sent
 *               token: "jwt_temp_token_here"
 *               role: "STUDENT"
 *       404:
 *         description: User not found with specified role
 *       500:
 *         description: Server error
 */
router.post("/send-otp", sendOtp);

/**
 * @swagger
 * /api/users/verify-otp:
 *   post:
 *     summary: Verify OTP and login (role-based)
 *     tags: [Auth]
 *     description: Verifies OTP and returns JWT token with role-based access
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - token
 *               - role
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               token:
 *                 type: string
 *                 example: "jwt_temp_token_here"
 *               role:
 *                 type: string
 *                 enum: [STUDENT, ADMIN, WARDEN]
 *                 example: STUDENT
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: Login successful
 *               token: "auth_jwt_token"
 *               role: "STUDENT"
 *               user:
 *                 student_id: 1
 *                 name: "Adarsh Kumar"
 *                 email: "25mcmc29@uohyd.ac.in"
 *       401:
 *         description: Invalid or expired OTP
 *       404:
 *         description: User not found with specified role
 *       500:
 *         description: Server error
 */
router.post("/verify-otp", verifyOtp);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     description: Clears the authentication cookie and logs out the user
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             example:
 *               message: Logged out
 */
router.post("/logout", logout);

export default router;
