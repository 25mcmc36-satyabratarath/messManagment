import {Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { addNewStudent, getAllStudents, addNewCard, addExpense, getExpenses } from "../controller/careTaker.controller.js";

const router = Router();    

router.post("/add-new-student", authMiddleware, allowRoles("CARE_TAKER"), addNewStudent);
router.get("/get-all-student-details", authMiddleware, allowRoles("CARE_TAKER"), getAllStudents);
router.post("/add-new-card", authMiddleware, allowRoles("CARE_TAKER"), addNewCard);
router.post("/add-expense", authMiddleware, allowRoles("CARE_TAKER"), addExpense);
router.get("/get-expense", authMiddleware, allowRoles("CARE_TAKER"), getExpenses);


export default router;