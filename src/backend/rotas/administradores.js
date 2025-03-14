import express from "express";
import { loginAdmin, registerAdmin } from "../controller/admin.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/", registerAdmin);

export default router;
