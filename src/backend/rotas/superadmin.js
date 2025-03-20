
import express from "express";
import {
  cadastrarPlanoController,
  listarPlanosController,
  liberarAdministradorController,
  listarAdministradoresController,
  desativarAdministradorController,
  listarEventosPorAdministradorController,
} from "../controller/SuperAdminController.js";


const router = express.Router();

// Rota para cadastrar um novo plano
router.post("/planos", cadastrarPlanoController);

// Rota para listar todos os planos
router.get("/planos", listarPlanosController);

// Rota para liberar um administrador
router.post("/liberar-administrador", liberarAdministradorController);

// Rota para listar todos os administradores
router.get("/administradores", listarAdministradoresController);

// Rota para desativar um administrador
router.put("/administradores/:id/desativar", desativarAdministradorController);

// Rota para listar eventos criados por um administrador
router.get("/administradores/:id/eventos", listarEventosPorAdministradorController);

export default router;