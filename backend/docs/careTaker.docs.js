/**
 * @swagger
 * tags:
 *   name: CareTaker
 *   description: CareTaker management
 */

/**
 * @swagger
 * /api/caretaker/add-new-student:
 *   post:
 *     summary: Add a new student
 *     tags: [CareTaker]
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
 *               email:
 *                 type: string
 *               hostel_id:
 *                 type: integer
 *             required:
 *               - name
 *               - email
 *               - hostel_id
 *     responses:
 *       201:
 *         description: Student added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/caretaker/get-all-student-details:
 *   get:
 *     summary: Get all students
 *     tags: [CareTaker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       student_id:
 *                         type: integer
 *                       hostel_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       room_no:
 *                         type: string
 *                       hostel_name:
 *                         type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/caretaker/add-new-card:
 *   post:
 *     summary: Create mess card for student
 *     tags: [CareTaker]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: integer
 *             required:
 *               - student_id
 *     responses:
 *       201:
 *         description: Mess card created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/caretaker/add-expense:
 *   post:
 *     summary: Add daily expense
 *     tags: [CareTaker]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               normal_expense:
 *                 type: number
 *                 format: float
 *             required:
 *               - date
 *               - normal_expense
 *     responses:
 *       201:
 *         description: Expense added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/caretaker/get-expense:
 *   get:
 *     summary: Get daily expenses for the caretaker's hostel
 *     tags: [CareTaker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expenses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       expense_id:
 *                         type: integer
 *                       hostel_id:
 *                         type: integer
 *                       date:
 *                         type: string
 *                         format: date
 *                       normal_expense:
 *                         type: number
 *                         format: float
 *       500:
 *         description: Server error
 */