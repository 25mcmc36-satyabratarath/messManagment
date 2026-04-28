import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

//  import controller
import * as messController from "../controller/mess_secretary.js";

const router = Router();

// ======================================================
//  ACTIVE CARDS (DATE-WISE)
// ======================================================
router.get(
  "/no-of-active-cards",
  authMiddleware,
  allowRoles("MESS_SECRETARY"),
  messController.getActiveCards
);

// ======================================================
//  NET CARD (TOTAL / OPEN / CLOSED)
// ======================================================
router.get(
  "/net-card",
  authMiddleware,
  allowRoles("MESS_SECRETARY"),
  messController.getNetCard
);

// ======================================================
//  RATION SUMMARY
// ======================================================
router.get(
  "/ration",
  authMiddleware,
  allowRoles("MESS_SECRETARY"),
  messController.getRation
);

// ======================================================
// ➕ ADD RATION CONSUMPTION
// ======================================================
router.post(
  "/ration-consumption",   //  fixed spelling + slash
  authMiddleware,
  allowRoles("MESS_SECRETARY"),
  messController.addRationConsumption
);

// ======================================================
//  SPECIAL MEAL SUMMARY
// ======================================================
router.get(
  "/special-meal-summary",
  authMiddleware,
  allowRoles("MESS_SECRETARY"),
  messController.getSpecialMealSummary
);

// ======================================================
//  CREATE SPECIAL MEAL
// ======================================================
router.post(
  "/special-meal-poll",
  authMiddleware,
  allowRoles("MESS_SECRETARY"),
  messController.createSpecialMeal
);

// ======================================================
//  GET SPECIAL MEALS
// ======================================================
router.get(
  "/special-meal",
  authMiddleware,
  allowRoles(["MESS_SECRETARY", "STUDENT"]),
  messController.getSpecialMeals
);

// ======================================================
//  ADD SPECIAL MEAL
// ======================================================
router.post(
  "/special-meal",
  authMiddleware,
  allowRoles("MESS_SECRETARY"),
  messController.createSpecialMeal
);

// ======================================================
//  ADD STUDENT TO SPECIAL MEAL
// ======================================================
router.post(
  "/add-special-meal/:id",   //  removed space
  authMiddleware,
  allowRoles("MESS_SECRETARY"),
  messController.addSpecialMealStudent
);

// ======================================================
//  ADD WEEKLY EXPENSE
// ======================================================
router.post(
  "/add-weekly-expense",
  authMiddleware,
  allowRoles("MESS_SECRETARY"),
  messController.addWeeklyExpense
);

// ======================================================
//  GET WEEKLY EXPENSE
// ======================================================
router.get(
  "/get-weekly-expense",
  authMiddleware,
  allowRoles(["MESS_SECRETARY", "STUDENT"]),
  messController.getWeeklyExpense
);

export default router;