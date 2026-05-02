export const messDocs = `
/**
 * @openapi
 * /api/mess/get-card-view:
 *   get:
 *     tags:
 *       - Mess
 *     summary: Get monthly mess card view for the authenticated student
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               card_id: 1
 *               student_id: 101
 *               month: 2
 *               year: 2026
 *               active_days: 20
 *               special_meals: 2
 *               subscriptions: 1
 *               total_amount: 2500
 *       400:
 *         description: Missing month or year
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /api/mess/get-yearly-bill:
 *   get:
 *     tags:
 *       - Mess
 *     summary: Get yearly bill summary for the authenticated student
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               year: 2026
 *               total_bills: 30000
 *               total_paid: 15000
 *               balance_due: 15000
 *               monthly_breakdown:
 *                 - month: 1
 *                   amount: 2500
 *                 - month: 2
 *                   amount: 2500
 *       400:
 *         description: Missing year
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: No bill data found
 */

/**
 * @openapi
 * /api/mess/get-monthly-bill:
 *   get:
 *     tags:
 *       - Mess
 *     summary: Get monthly bills for the authenticated student
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               bills:
 *                 - id: 1
 *                   month: 2
 *                   year: 2026
 *                   base_amount: 2000
 *                   special_meals: 300
 *                   subscriptions: 200
 *                   total: 2500
 *                   paid: true
 *       400:
 *         description: Missing month or year
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /api/mess/feedback:
 *   post:
 *     tags:
 *       - Mess
 *     summary: Submit student feedback
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
 *           example:
 *             food_rating: 4
 *             hygiene_rating: 5
 *             comments: "Great food quality, clean premises"
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               message: "Feedback submitted"
 *       400:
 *         description: Missing ratings
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /api/mess/feedback:
 *   get:
 *     tags:
 *       - Mess
 *     summary: Get student feedback history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               feedback:
 *                 - id: 1
 *                   food_rating: 4
 *                   hygiene_rating: 5
 *                   comments: "Great food quality"
 *                   created_at: "2026-02-01T10:30:00Z"
 *                 - id: 2
 *                   food_rating: 3
 *                   hygiene_rating: 4
 *                   comments: "Average service"
 *                   created_at: "2026-01-15T14:20:00Z"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /api/mess/get-special-meal-history:
 *   get:
 *     tags:
 *       - Mess
 *     summary: Get special meal history for the authenticated student
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               history:
 *                 - id: 1
 *                   meal_name: "Biryanis Sunday"
 *                   date: "2026-02-01"
 *                   cost: 150
 *                   status: "confirmed"
 *                 - id: 2
 *                   meal_name: "Italian Night"
 *                   date: "2026-01-25"
 *                   cost: 120
 *                   status: "completed"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /api/mess/join-special-meal:
 *   post:
 *     tags:
 *       - Mess
 *     summary: Join a special meal
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
 *           example:
 *             special_id: 5
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               message: "Joined special meal"
 *       400:
 *         description: Missing special_id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /api/mess/add-subscription:
 *   post:
 *     tags:
 *       - Mess
 *     summary: Add a student subscription
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
 *           example:
 *             item_name: "Extra Rice"
 *             cost: 200
 *             start_date: "2026-02-01"
 *             end_date: "2026-02-28"
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               message: "Subscription added"
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /api/mess/open-mess-card:
 *   post:
 *     tags:
 *       - Mess
 *     summary: Open a new mess card
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               message: "Mess card opened"
 *               card_id: 42
 *       400:
 *         description: Active card already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @openapi
 * /api/mess/close-mess-card:
 *   post:
 *     tags:
 *       - Mess
 *     summary: Close the current mess card
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               message: "Mess card closed"
 *       404:
 *         description: No active mess card found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
`;
