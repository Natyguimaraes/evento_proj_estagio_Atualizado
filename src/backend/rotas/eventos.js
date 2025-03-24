import express from "express";
import {
  getAllEventos,
  getEventoPorId,
  getEventosPorAdministrador,
  createEventoController,
  updateEventoController,
  deleteEventoController,
} from "../controller/evento.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Rota: GET /api/eventos
router.get("/eventos", getAllEventos);

router.get("/eventos/:id", getEventoPorId);

// Rota: GET /api/eventos/por-administrador?administrador_id=24
router.get("/por-administrador", getEventosPorAdministrador);


// Rota: POST /api/eventos
router.post("/", upload.single("imagem_evento"), createEventoController);

// Rota: PUT /api/eventos/:id
router.put("/:id", updateEventoController);

// Rota: DELETE /api/eventos/:id
router.delete("/:id", deleteEventoController);


export default router;