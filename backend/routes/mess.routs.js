import { Router } from "express";
import { allowRoles } from "../middleware/role.js";
import { authMiddleware } from "../middleware/auth.js";
import { getMessCardView, getYearlyBill } from "../controller/card.controller.js";
import * as messController from "../controller/mess.controller.js";

const router = Router();

/**
 * @swagger
 * /api/mess/get-card-view:
 *   get:
 *     summary: Get mess card monthly view
 *     description: Returns mess card details for a student including active days, special meals, and subscriptions for a given month and year.
 *     tags: [Mess]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *         description: Month (1-12)
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2026
 *         description: Year (e.g. 2026)
 *     responses:
 *       200:
 *         description: Mess card data fetched successfully
 *       400:
 *         description: Missing or invalid query parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/get-card-view", authMiddleware, allowRoles("STUDENT"), getMessCardView);

/**
 * @swagger
 * /api/mess/get-yearly-bill:
 *   get:
 *     summary: Get yearly mess bill for a student
 *     tags: [Mess]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2026
 *     responses:
 *       200:
 *         description: Yearly bill fetched successfully
 *       400:
 *         description: Missing or invalid year parameter
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: No bill data found
 *       500:
 *         description: Server error
 */
router.get("/get-yearly-bill", authMiddleware, allowRoles("STUDENT"), getYearlyBill);

/**
 * @swagger
 * /api/mess/get-monthly-bill:
 *   get:
 *     summary: Get monthly mess bills for a student
 *     tags: [Mess]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2026
 *     responses:
 *       200:
 *         description: Monthly bills fetched successfully
 *       400:
 *         description: Missing or invalid month or year
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/get-monthly-bill", authMiddleware, allowRoles("STUDENT"), messController.getMonthlyBill);

/**
 * @swagger
 * /api/mess/feedback:
 *   post:
 *     summary: Submit student feedback
 *     tags: [Mess]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - food_rating
 *               - hygiene_rating
 *             properties:
 *               food_rating:
 *                 type: integer
 *               hygiene_rating:
 *                 type: integer
 *               comments:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post("/feedback", authMiddleware, allowRoles("STUDENT"), messController.addFeedback);

/**
 * @swagger
 * /api/mess/feedback:
 *   get:
 *     summary: Get student feedback history
 *     tags: [Mess]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feedback history fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/feedback", authMiddleware, allowRoles("STUDENT"), messController.getFeedback);

/**
 * @swagger
 * /api/mess/get-special-meal-history:
 *   get:
 *     summary: Get a student's special meal history
 *     tags: [Mess]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Special meal history fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/get-special-meal-history", authMiddleware, allowRoles("STUDENT"), messController.getSpecialMealHistory);

/**
 * @swagger
 * /api/mess/join-special-meal:
 *   post:
 *     summary: Join a special meal
 *     tags: [Mess]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - special_id
 *             properties:
 *               special_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Joined special meal successfully
 *       400:
 *         description: Missing special_id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post("/join-special-meal", authMiddleware, allowRoles("STUDENT"), messController.joinSpecialMeal);

/**
 * @swagger
 * /api/mess/add-subscription:
 *   post:
 *     summary: Add a student subscription
 *     tags: [Mess]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - item_name
 *               - cost
 *               - start_date
 *               - end_date
 *             properties:
 *               item_name:
 *                 type: string
 *               cost:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Subscription added successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post("/add-subscription", authMiddleware, allowRoles("STUDENT"), messController.addSubscription);

/**
 * @swagger
 * /api/mess/open-mess-card:
 *   post:
 *     summary: Open a new mess card for the student
 *     tags: [Mess]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Mess card opened successfully
 *       400:
 *         description: Active mess card already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post("/open-mess-card", authMiddleware, allowRoles("STUDENT"), messController.openMessCard);

/**
 * @swagger
 * /api/mess/close-mess-card:
 *   post:
 *     summary: Close the student's active mess card
 *     tags: [Mess]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mess card closed successfully
 *       404:
 *         description: No active mess card found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post("/close-mess-card", authMiddleware, allowRoles("STUDENT"), messController.closeMessCard);

export default router;