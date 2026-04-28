export const wardenDocs = `
/**
 * @swagger
 * tags:
 *   - name: Warden
 *     description: Warden-only operations
 */

/**
 * @swagger
 * /api/warden/add-staff:
 *   post:
 *     summary: Add new staff (WARDEN only)
 *     tags: [Warden]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - role
 *               - hostel_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Cook Ram"
 *               email:
 *                 type: string
 *                 example: "cookram@mess.com"
 *               role:
 *                 type: string
 *                 example: "COOK"
 *               hostel_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Staff added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only Warden allowed
 */

/**
 * @swagger
 * /api/warden/get-all-staff:
 *   get:
 *     summary: Get all staff members
 *     tags: [Warden]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of staff
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 staff:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       staff_id:
 *                         type: integer
 *                       hostel_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only Warden allowed
 */

/**
 * @swagger
 * /api/warden/remove-staff/{id}:
 *   delete:
 *     summary: Remove a staff member by id
 *     tags: [Warden]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Staff ID
 *     responses:
 *       200:
 *         description: Staff removed successfully
 *       400:
 *         description: Invalid staff id
 *       404:
 *         description: Staff not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only Warden allowed
 */

/**
 * @swagger
 * /api/warden/mess-summary:
 *   get:
 *     summary: Get mess summary for the warden's hostel
 *     tags: [Warden]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mess summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total_students:
 *                       type: integer
 *                     active_cards:
 *                       type: integer
 *                     closed_cards:
 *                       type: integer
 *                     total_cards:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only Warden allowed
 */

/**
 * @swagger
 * /api/warden/all-mess-active-cards:
 *   get:
 *     summary: Get all active mess cards for the warden's hostel
 *     tags: [Warden]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active mess cards list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       card_id:
 *                         type: integer
 *                       student_id:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       open_date:
 *                         type: string
 *                         format: date
 *                       close_date:
 *                         type: string
 *                         format: date
 *                       student_name:
 *                         type: string
 *                       student_email:
 *                         type: string
 *                       room_no:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only Warden allowed
 */

/**
 * @swagger
 * /api/warden/update-email/{mess_id}:
 *   post:
 *     summary: Update mess email configuration
 *     tags: [Warden]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mess_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Mess email config id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "mess@example.com"
 *               smtp_host:
 *                 type: string
 *                 example: "smtp.example.com"
 *               smtp_port:
 *                 type: integer
 *                 example: 587
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Email configuration updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Mess email config not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only Warden allowed
 */
`;