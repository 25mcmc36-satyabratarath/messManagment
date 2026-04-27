import { Router } from "express";
import router from "./user.route";
import { authMiddleware } from "../middleware/auth";
import { allowRoles } from "../middleware/role";

router.get("/no-of-active-cards", authMiddleware, allowRoles("MESS_SECRETARY"), ()=>{});
router.get("/net-card", authMiddleware, allowRoles("MESS_SECRETARY"), ()=>{});
router.get("/ration" , authMiddleware , allowRoles("MESS_SECRETARY") , ()=>{});
router.post("ration-comsumption" , authMiddleware , allowRoles("MESS_SECRETARY") , ()=>{});
router.get("/special-meal-summary", authMiddleware, allowRoles("MESS_SECRETARY"), ()=>{});
router.post("/special-meal-poll", authMiddleware, allowRoles("MESS_SECRETARY"), ()=>{});
router.get("/special-meal" ,authMiddleware ,allowRoles(["MESS_SECRETARY", "STUDENT"]) , ()=>{}); 
router.post("/special-meal" ,authMiddleware, allowRoles("MESS_SECRETARY") , ()=>{});
router.post("/add-special-meal/:id " , authMiddleware , allowRoles("MESS_SECRETARY") , ()=>{});
router.post("/add-weekly-expense" , authMiddleware , allowRoles("MESS_SECRETARY") , ()=>{});
router.get("/get-weekly-expense" , authMiddleware , allowRoles(["MESS_SECRETARY", "STUDENT"]) , ()=>{});
