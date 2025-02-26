import express from "express";
import {
  createEventoController,
  getAllEventos,
  updateEventoController,
  deleteEventoController,
} from "../controller/evento.js";

const router = express.Router();

router.get("/", getAllEventos);

router.post("/", createEventoController);

router.put("/:id", updateEventoController);

router.delete("/:id", deleteEventoController);

export default router;
