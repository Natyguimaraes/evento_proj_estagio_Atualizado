import express from "express";
import { loginAdmin, registerAdmin, buscarAdministradorLogado } from "../controller/admin.js";
import { autenticar } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rota para login do administrador
router.post("/login", loginAdmin);

// Rota para registrar um novo administrador
router.post("/", registerAdmin);

// Rota para buscar informações do administrador logado (protegida)
router.get("/me", autenticar, buscarAdministradorLogado);

export default router;
