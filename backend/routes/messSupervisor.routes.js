import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = Router();

router.post("/add-ration-item", authMiddleware, allowRoles("MESS_SUPERVISOR"), ()=>{}); 
router.get("/get-ration-items", authMiddleware, allowRoles(["MESS_SUPERVISOR", "STUDENT"]), ()=>{});
router.post("/update-ration-item/:id", authMiddleware, allowRoles("MESS_SUPERVISOR"), ()=>{});
router.delete("/delete-ration-item/:id", authMiddleware, allowRoles("MESS_SUPERVISOR"), ()=>{});

router.get("/monthly-consumption", authMiddleware, allowRoles("MESS_SUPERVISOR"), ()=>{});

export default router;