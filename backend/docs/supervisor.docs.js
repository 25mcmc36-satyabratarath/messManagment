/**
 * @swagger
 * tags:
 *   name: Supervisor
 *   description: Mess supervisor operations
 */

/**
 * @swagger
 * /api/supervisor/add-ration-item:
 *   post:
 *     summary: Add a new ration item
 *     tags: [Supervisor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the ration item
 *               quantity:
 *                 type: number
 *                 description: Quantity of the item
 *               unit:
 *                 type: string
 *                 description: Unit of measurement (e.g., kg, liters)
 *               hostel_id:
 *                 type: integer
 *                 description: Hostel ID
 *             required:
 *               - name
 *               - quantity
 *               - unit
 *               - hostel_id
 *     responses:
 *       201:
 *         description: Ration item added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only Mess Supervisor allowed
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/supervisor/get-ration-items:
 *   get:
 *     summary: Get all ration items
 *     tags: [Supervisor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of ration items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       unit:
 *                         type: string
 *                       hostel_id:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/supervisor/update-ration-item/{id}:
 *   post:
 *     summary: Update a ration item by ID
 *     tags: [Supervisor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ration item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ration item updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only Mess Supervisor allowed
 *       404:
 *         description: Ration item not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/supervisor/delete-ration-item/{id}:
 *   delete:
 *     summary: Delete a ration item by ID
 *     tags: [Supervisor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ration item ID
 *     responses:
 *       200:
 *         description: Ration item deleted successfully
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only Mess Supervisor allowed
 *       404:
 *         description: Ration item not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/supervisor/monthly-consumption:
 *   get:
 *     summary: Get monthly consumption report
 *     tags: [Supervisor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly consumption data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 consumption:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       year:
 *                         type: integer
 *                       total_consumption:
 *                         type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only Mess Supervisor allowed
 *       500:
 *         description: Server error
 */