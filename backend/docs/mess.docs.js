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
 *     responses:
 *       201:
 *         description: Success
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
 *     responses:
 *       200:
 *         description: Success
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
 *     responses:
 *       201:
 *         description: Success
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
 *       404:
 *         description: No active mess card found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
`;
