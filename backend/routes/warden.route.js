import { Router } from "express";
import { addStaff, getAllStaff } from "../controller/user.controller.js";
import {
  removeStaff,
  getMessSummary,
  getAllMessActiveCards,
  updateEmailConfig
} from "../controller/warden.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Warden
 *   description: Warden-only operations
 */

/**
 * @swagger
 * /api/warden/add-staff:
 *   post:
 *     summary: Add new staff (WARDEN only)
 *     tags: [Warden]
 *     description: Warden can add staff to hostel
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
 *         content:
 *           application/json:
 *             example:
 *               message: Staff added successfully
 *               staff_id: 10
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only Warden allowed
 */
router.post(
  "/add-staff",
  authMiddleware,
  allowRoles("WARDEN"),
  addStaff
);

router.get("/get-all-staff", authMiddleware, allowRoles("WARDEN"), getAllStaff);
router.delete("/remove-staff/:id", authMiddleware, allowRoles("WARDEN"), removeStaff);
router.get("/mess-summary", authMiddleware, allowRoles("WARDEN"), getMessSummary);
router.get("/all-mess-active-cards", authMiddleware, allowRoles("WARDEN"), getAllMessActiveCards);
router.post("/update-email/:mess_id", authMiddleware, allowRoles("WARDEN"), updateEmailConfig);

export default router;