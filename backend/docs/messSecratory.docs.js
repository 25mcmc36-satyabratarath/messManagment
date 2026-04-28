export const messSecratoryDocs = `
/**
 * @swagger
 * tags:
 *   - name: MessSecretary
 *     description: Mess secretary operations
 */

/**
 * @swagger
 * /api/mess-secretary/no-of-active-cards:
 *   get:
 *     summary: Get total and active mess cards for a date
 *     tags: [MessSecretary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date for active card count
 *     responses:
 *       200:
 *         description: Daily active card counts
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/mess-secretary/net-card:
 *   get:
 *     summary: Get total, open, and closed mess card counts
 *     tags: [MessSecretary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Net card summary
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/mess-secretary/ration:
 *   get:
 *     summary: Get ration expense summary by date
 *     tags: [MessSecretary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ration summary list
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/mess-secretary/ration-consumption:
 *   post:
 *     summary: Add ration consumption entry
 *     tags: [MessSecretary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hostel_id
 *               - date
 *               - normal_expense
 *             properties:
 *               hostel_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               normal_expense:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Ration consumption added
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/mess-secretary/special-meal-summary:
 *   get:
 *     summary: Get special meal summary
 *     tags: [MessSecretary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Special meal summary list
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/mess-secretary/special-meal-poll:
 *   post:
 *     summary: Create a special meal poll
 *     tags: [MessSecretary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hostel_id
 *               - date
 *               - meal_name
 *               - total_cost
 *               - total_plates
 *             properties:
 *               hostel_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               meal_name:
 *                 type: string
 *               total_cost:
 *                 type: number
 *                 format: float
 *               total_plates:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Special meal created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/mess-secretary/special-meal:
 *   get:
 *     summary: Get all special meals
 *     tags: [MessSecretary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of special meals
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/mess-secretary/add-special-meal/{id}:
 *   post:
 *     summary: Add a student to a special meal
 *     tags: [MessSecretary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Special meal id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - plates_taken
 *             properties:
 *               student_id:
 *                 type: integer
 *               plates_taken:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Student added to special meal
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/mess-secretary/add-weekly-expense:
 *   post:
 *     summary: Add a weekly expense entry
 *     tags: [MessSecretary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hostel_id
 *               - date
 *               - normal_expense
 *             properties:
 *               hostel_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               normal_expense:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Weekly expense added
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/mess-secretary/get-weekly-expense:
 *   get:
 *     summary: Get weekly expense summary grouped by year/week
 *     tags: [MessSecretary]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly expense summary
 *       500:
 *         description: Server error
 */
`;
